import Reveal from './Reveal';
import './ProjectCompliance.css';

/**
 * RERA & documentation, shown on the project page itself — never tucked into
 * the footer (read.md §21).
 *
 * The honest case matters as much as the registered one: when a project has no
 * published RERA number, this renders a plain statement that registration
 * details are provided on request, rather than a fabricated number or a silent
 * omission that reads as if there were nothing to disclose.
 */
export default function ProjectCompliance({
  rera,                 // { number, url, authority } | null
  developer,
  marketedBy,
  documents = [],       // [{ label, href }]
  projectName,
  className = '',
  id,
}) {
  const rows = [
    developer && { k: 'Developer', v: developer },
    marketedBy && { k: 'Marketed by', v: marketedBy },
    rera?.authority && { k: 'Authority', v: rera.authority },
  ].filter(Boolean);

  return (
    <section className={`compliance ${className}`} id={id}>
      <div className="container">
        <div className="compliance__shell">
          <div className="compliance__head">
            <Reveal as="span" className="eyebrow compliance__eyebrow">Compliance</Reveal>
            <Reveal as="h2" className="display compliance__heading" delay={0.05}>
              RERA & documentation.
            </Reveal>
          </div>

          <div className="compliance__body">
            {rera?.number ? (
              <Reveal className="compliance__badge">
                <span className="compliance__badge-k">RERA registration number</span>
                <span className="compliance__badge-v">{rera.number}</span>
                {rera.url && (
                  <a
                    href={rera.url}
                    target="_blank"
                    rel="noreferrer"
                    className="compliance__badge-link"
                  >
                    Verify on the authority's website
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </Reveal>
            ) : (
              <Reveal className="compliance__badge compliance__badge--pending">
                <span className="compliance__badge-k">RERA registration</span>
                <p className="compliance__badge-note">
                  {projectName ? `${projectName}'s ` : 'This project’s '}
                  registration and approval details are shared with the full documentation set on
                  request, and are verifiable directly with the authority before you commit to
                  anything. We do not publish a registration number we cannot evidence here.
                </p>
              </Reveal>
            )}

            {rows.length > 0 && (
              <Reveal className="compliance__rows" delay={0.08}>
                <dl>
                  {rows.map((r) => (
                    <div className="compliance__row" key={r.k}>
                      <dt>{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            {documents.length > 0 && (
              <Reveal className="compliance__docs" delay={0.12}>
                <span className="compliance__docs-k">Documents</span>
                <ul>
                  {documents.map((d) => (
                    <li key={d.href}>
                      <a href={d.href} target="_blank" rel="noreferrer" download>
                        {d.label}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M8 3v8m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
