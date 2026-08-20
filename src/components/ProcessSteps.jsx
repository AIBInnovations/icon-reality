import Reveal from './Reveal';
import './ProcessSteps.css';

/**
 * A numbered journey — the NRI buying process, the channel-partner journey, the
 * remote booking path.
 *
 * Rendered as an ordered list with a connecting rule, so it reads as a sequence
 * to a screen reader as well as to the eye. On mobile the rule moves to the
 * left of the numbers and the whole thing becomes a single vertical spine
 * rather than a squeezed horizontal row.
 */
export default function ProcessSteps({ steps = [], className = '' }) {
  if (!steps.length) return null;

  return (
    <ol className={`process-steps ${className}`}>
      {steps.map((step, i) => (
        <Reveal
          as="li"
          key={step.title || i}
          className="process-steps__step"
          delay={Math.min(i, 6) * 0.05}
        >
          <span className="process-steps__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
          <div className="process-steps__body">
            <h3 className="process-steps__title">{step.title}</h3>
            {step.body && <p className="process-steps__copy">{step.body}</p>}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
