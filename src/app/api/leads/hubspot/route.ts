import { NextResponse } from "next/server";

import { createInboundLead, type InboundLeadInput } from "@/lib/hubspot/leads";

export const runtime = "nodejs";

type LeadBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  sector?: string;
  query?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: LeadBody): { ok: true; data: InboundLeadInput } | { ok: false; error: string } {
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const sector = body.sector?.trim() ?? "";
  const query = body.query?.trim() || undefined;

  if (!firstName || !lastName || !company || !sector) {
    return { ok: false, error: "First name, last name, company, and sector are required." };
  }
  if (!email || !emailPattern.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return { ok: false, error: "Enter a valid phone number with at least 10 digits." };
  }

  return {
    ok: true,
    data: { firstName, lastName, email, phone, company, sector, query },
  };
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validated = validate(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  if (!process.env.HUBSPOT_ACCESS_TOKEN?.trim()) {
    return NextResponse.json(
      { error: "Lead capture is temporarily unavailable. Please try again, or use the form later." },
      { status: 503 },
    );
  }

  try {
    const result = await createInboundLead(validated.data);
    return NextResponse.json({
      ok: true,
      contactId: result.contactId,
      companyId: result.companyId,
      dealId: result.dealId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create lead.";
    console.error("[api/leads/hubspot]", message);
    return NextResponse.json(
      { error: "Could not save your request. Please try again, or use the form later." },
      { status: 502 },
    );
  }
}
