import { act1Beats, featureChapters } from "@/lib/story/chapters";

export function HomeSeoContent() {
  const hook = act1Beats[0];

  return (
    <section className="sr-only" aria-label="agentomatic frontdesk overview">
      <h1>{hook.title.join(" ")}</h1>
      <p>{hook.body}</p>
      <p>
        ai front desk for your team — routine calls handled, warm handoff when it matters.
      </p>
      <h2>frontdesk features</h2>
      <ul>
        {featureChapters.map((feature) => (
          <li key={feature.id}>
            <strong>
              {feature.title.join(" ")}
            </strong>{" "}
            — {feature.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
