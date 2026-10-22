import type { Block, CaseStudy as CaseStudyContent, Flow } from "@/content/projects";

// Renders a structured case study from content/projects.ts: full-width
// section headings over a comfortable reading column.

function FlowDiagram({ flow }: { flow: Flow }) {
  return (
    <figure className="flow">
      <figcaption className="flow-label">{flow.label}</figcaption>
      {flow.lanes.map((lane) => (
        <div key={lane.title} className="flow-lane">
          <p className="flow-lane-title">{lane.title}</p>
          <ol className="flow-steps">
            {lane.steps.map((s) => (
              <li key={s.text} className="flow-step" data-owner={s.owner}>
                {s.text}
                {s.owner && <span className="sr-only"> ({s.owner === "mine" ? flow.legend.mine : flow.legend.existing})</span>}
              </li>
            ))}
          </ol>
        </div>
      ))}
      <ul className="flow-legend" aria-hidden>
        <li data-owner="mine">{flow.legend.mine}</li>
        <li data-owner="existing">{flow.legend.existing}</li>
      </ul>
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "bullets":
      return (
        <ul className="bullets">
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "note":
      return (
        <aside className="cs-note">
          <p className="cs-note-label">{block.label}</p>
          <p>{block.text}</p>
        </aside>
      );
    case "quote":
      return (
        <figure className="cs-quote">
          <blockquote>
            <p>{block.text}</p>
          </blockquote>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "compare":
      return (
        <div className="compare">
          {block.options.map((o) => (
            <section key={o.title} className="compare-option" data-chosen={o.chosen || undefined}>
              <h3>
                {o.title}
                {o.chosen && <span className="compare-chosen">Chosen</span>}
              </h3>
              <p>{o.when}</p>
              <p className="compare-evidence">{o.evidence}</p>
            </section>
          ))}
        </div>
      );
    case "flow":
      return <FlowDiagram flow={block.flow} />;
    case "columns":
      return (
        <div className="cs-columns">
          {block.columns.map((c) => (
            <section key={c.title}>
              <h3>{c.title}</h3>
              <ul className="bullets">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      );
    case "proposed":
      return (
        <aside className="cs-proposed">
          <p className="cs-note-label">{block.label}</p>
          <ul className="bullets">
            {block.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </aside>
      );
  }
}

export function CaseStudySections({ study }: { study: CaseStudyContent }) {
  return (
    <div className="cs-story">
      {study.sections.map((s) => (
        <section key={s.id} className="cs-part" aria-labelledby={`cs-${s.id}`}>
          <h2 id={`cs-${s.id}`} className="section-title">
            {s.title}
          </h2>
          <div className="cs-flow">
            {s.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// Projections: a labelled section of three equal cards (value, then what it
// measures) with the assumptions in a footer beneath, so the figures read
// clearly as estimates rather than measured results.
export function ProjectedImpact({ projected }: { projected: NonNullable<CaseStudyContent["projected"]> }) {
  return (
    <section className="projected" aria-labelledby="projected-h">
      <header className="projected-head">
        <h2 id="projected-h" className="projected-title">
          {projected.title}
        </h2>
        <span className="projected-badge">{projected.badge}</span>
      </header>
      <dl className="projected-cards">
        {projected.figures.map((f) => (
          <div key={f.label} className="projected-card">
            <dt>{f.label}</dt>
            <dd>
              {f.value}
              {f.unit && <span className="projected-unit"> {f.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="projected-note">{projected.note}</p>
    </section>
  );
}
