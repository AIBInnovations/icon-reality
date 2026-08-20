import Reveal from './Reveal';
import './SectionHeading.css';

/**
 * Eyebrow → display heading → lede. The exact three-part opening every existing
 * section on the site already uses (Services, Trust, Highlights, Gallery,
 * Final CTA), extracted so new sections inherit the rhythm instead of each
 * re-deriving its own spacing and type scale.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  tone = 'light',        // 'light' on cream, 'dark' inside a charcoal shell
  as: Tag = 'h2',
  id,
  className = '',
}) {
  return (
    <div className={`section-heading section-heading--${align} section-heading--${tone} ${className}`}>
      {eyebrow && (
        <Reveal as="span" className="eyebrow section-heading__eyebrow">{eyebrow}</Reveal>
      )}
      {title && (
        <Reveal as={Tag} className="display section-heading__title" delay={0.05} id={id}>
          {title}
        </Reveal>
      )}
      {lede && (
        <Reveal as="p" className="section-heading__lede" delay={0.1}>{lede}</Reveal>
      )}
    </div>
  );
}
