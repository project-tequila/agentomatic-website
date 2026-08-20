/**
 * HubSpot lead capture for Agentomatic Sales OS.
 * Creates/updates Contact + Company + Deal for inbound form submissions.
 * @see docs/sales-os/hubspot-setup.md
 */

export type InboundLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  query?: string;
};

export type HubSpotLeadResult = {
  contactId: string;
  companyId: string;
  dealId: string;
};

const HUBSPOT_API = "https://api.hubapi.com";

/** Map contact-form sector labels → CRM `icp_vertical`. */
export function mapSectorToIcpVertical(sector: string): string {
  const s = sector.trim().toLowerCase();
  if (s.includes("clinic") || s.includes("health")) return "clinic";
  if (s.includes("legal") || s.includes("professional")) return "legal";
  if (s.includes("home")) return "home_services";
  if (s.includes("hospital")) return "hospitality";
  if (s.includes("salon") || s.includes("beauty")) return "salon";
  if (s.includes("educat")) return "education";
  return "other";
}

function token(): string {
  const t = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!t) {
    throw new Error("HubSpot is not configured (missing HUBSPOT_ACCESS_TOKEN).");
  }
  return t;
}

async function hubspotFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${HUBSPOT_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HubSpot API ${res.status}: ${body.slice(0, 500)}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function isUnknownPropertyError(message: string): boolean {
  return /PROPERTY_DOESNT_EXIST|property.*does not exist|Could not get.*property/i.test(message);
}

async function createOrUpdateWithFallback(
  path: string,
  method: "POST" | "PATCH",
  fullProperties: Record<string, string>,
  safeProperties: Record<string, string>,
): Promise<string> {
  try {
    const result = await hubspotFetch<{ id: string }>(path, {
      method,
      body: JSON.stringify({ properties: fullProperties }),
    });
    return result.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!isUnknownPropertyError(message)) throw error;
    const result = await hubspotFetch<{ id: string }>(path, {
      method,
      body: JSON.stringify({ properties: safeProperties }),
    });
    return result.id;
  }
}

type HsObject = { id: string };

async function searchContactByEmail(email: string): Promise<string | null> {
  const data = await hubspotFetch<{ results: HsObject[] }>("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [{ propertyName: "email", operator: "EQ", value: email }],
        },
      ],
      limit: 1,
    }),
  });
  return data.results[0]?.id ?? null;
}

async function upsertContact(input: InboundLeadInput, icpVertical: string): Promise<string> {
  const safe: Record<string, string> = {
    email: input.email,
    firstname: input.firstName,
    lastname: input.lastName,
    phone: input.phone,
    company: input.company,
  };
  const full: Record<string, string> = {
    ...safe,
    lead_source: "inbound_form",
    lead_channel: "organic",
    icp_vertical: icpVertical,
  };

  const existingId = await searchContactByEmail(input.email);
  if (existingId) {
    await createOrUpdateWithFallback(
      `/crm/v3/objects/contacts/${existingId}`,
      "PATCH",
      full,
      safe,
    );
    return existingId;
  }

  return createOrUpdateWithFallback("/crm/v3/objects/contacts", "POST", full, safe);
}

async function createCompany(name: string, icpVertical: string): Promise<string> {
  const safe = { name };
  const full = { ...safe, icp_vertical: icpVertical };
  return createOrUpdateWithFallback("/crm/v3/objects/companies", "POST", full, safe);
}

async function associate(
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
  associationTypeId: number,
): Promise<void> {
  await hubspotFetch(`/crm/v4/objects/${fromType}/${fromId}/associations/${toType}/${toId}`, {
    method: "PUT",
    body: JSON.stringify([
      {
        associationCategory: "HUBSPOT_DEFINED",
        associationTypeId,
      },
    ]),
  });
}

/** HubSpot default association type IDs */
const ASSOC = {
  contactToCompany: 1,
  dealToContact: 3,
  dealToCompany: 5,
  noteToContact: 202,
  noteToDeal: 214,
} as const;

async function createDeal(input: InboundLeadInput, icpVertical: string): Promise<string> {
  const description = [
    `Inbound demo request from agentomatic.in/contact`,
    `Sector: ${input.sector}`,
    `icp_vertical: ${icpVertical}`,
    `pipeline_mode: inbound`,
    `lead_source: inbound_form`,
    `agent_owner: nirav`,
    input.query?.trim() ? `Query: ${input.query.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const safe: Record<string, string> = {
    dealname: `${input.company} — inbound demo`,
    description,
  };

  const pipelineId = process.env.HUBSPOT_PIPELINE_ID?.trim();
  const stageId = process.env.HUBSPOT_STAGE_NEW_ID?.trim();
  if (pipelineId) safe.pipeline = pipelineId;
  if (stageId) safe.dealstage = stageId;

  const full: Record<string, string> = {
    ...safe,
    pipeline_mode: "inbound",
    lead_source: "inbound_form",
    lead_channel: "organic",
    icp_vertical: icpVertical,
    agent_owner: "nirav",
    pain_summary: input.query?.trim() || `Inbound demo request (${input.sector})`,
    next_action: "Qualify inbound lead (Nirav)",
  };

  return createOrUpdateWithFallback("/crm/v3/objects/deals", "POST", full, safe);
}

async function createNote(body: string): Promise<string> {
  const created = await hubspotFetch<HsObject>("/crm/v3/objects/notes", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        hs_note_body: body,
        hs_timestamp: String(Date.now()),
      },
    }),
  });
  return created.id;
}

/**
 * Idempotent-ish inbound capture: upsert contact by email, always new deal for this request.
 */
export async function createInboundLead(input: InboundLeadInput): Promise<HubSpotLeadResult> {
  const icpVertical = mapSectorToIcpVertical(input.sector);

  const contactId = await upsertContact(input, icpVertical);
  const companyId = await createCompany(input.company, icpVertical);
  await associate("contacts", contactId, "companies", companyId, ASSOC.contactToCompany);

  const dealId = await createDeal(input, icpVertical);
  await associate("deals", dealId, "contacts", contactId, ASSOC.dealToContact);
  await associate("deals", dealId, "companies", companyId, ASSOC.dealToCompany);

  const noteBody = [
    "Inbound form submission (agentomatic.in/contact)",
    `Sector: ${input.sector}`,
    `ICP vertical: ${icpVertical}`,
    `pipeline_mode: inbound`,
    `lead_source: inbound_form`,
    `Phone: ${input.phone}`,
    input.query?.trim() ? `Query:\n${input.query.trim()}` : "Query: (none)",
    "agent_owner: nirav — next: qualify (fit_score + next_action)",
  ].join("\n");

  const noteId = await createNote(noteBody);
  await associate("notes", noteId, "contacts", contactId, ASSOC.noteToContact);
  await associate("notes", noteId, "deals", dealId, ASSOC.noteToDeal);

  return { contactId, companyId, dealId };
}
