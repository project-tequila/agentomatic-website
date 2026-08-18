import { act1Beats } from "@/lib/story/chapters";

/**
 * Lightweight above-the-fold homepage hero shown before Helios/WebGL hydrates.
 * LCP should land on this visible heading, not a canvas or sr-only copy.
 */
export function HomeHeroFallback() {
  const hook = act1Beats[0];

  return (
    <div className="site-3d min-h-svh" aria-busy="true">
      <div className="site-3d__canvas-skeleton" aria-hidden />
      <div className="site-3d__scroll min-h-svh">
        <section className="relative min-h-svh w-full" aria-label="Frontdesk story">
          <div className="rumik-story__sticky">
            <div className="rumik-story__writing">
              <div className="rumik-story__copy">
                <div className="rumik-story__chapter">
                  <div className="rumik-story__headline">
                    <p className="rumik-story__kicker">{hook.kicker}</p>
                    <h1 className="rumik-story__title">
                      <span>{hook.title[0]}</span>
                      <span>{hook.title[1]}</span>
                    </h1>
                    {hook.subtitle ? <p className="rumik-story__subtitle">{hook.subtitle}</p> : null}
                  </div>
                  <p className="rumik-story__body">{hook.body}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
