import { useId, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './Disclosure.css';

/**
 * A heading + its list, collapsible ON PHONES ONLY.
 *
 * The NRI page carries about sixty checklist items across six sections. On a
 * desktop column they are a scannable reference; stacked into a 390px phone
 * they were seventeen screens of unbroken body copy, which is the definition of
 * cluttered. Collapsed, the reader sees the headings and opens the two or three
 * that apply to them.
 *
 * Nothing is hidden from anyone who does not want it hidden: above 720px there
 * is no button and no collapsed state, and the markup is exactly the heading
 * and the list it always was. Content is never removed, only deferred.
 *
 * It renders a FRAGMENT, never a wrapper element. Every section that uses this
 * puts the group inside a grid whose column rules are written with
 * `:nth-child()` — an extra div would reparent the group and every one of those
 * rules would silently stop matching.
 *
 * Accessibility (CLAUDE.md §9): the button sits inside the heading so the
 * document outline is unchanged, it carries aria-expanded and aria-controls,
 * and the panel is hidden with an explicit `display` rule rather than relying
 * on the user agent's `[hidden]`, which any `display` declaration would beat.
 */
export default function Disclosure({
  title,
  /** class for the <h3>, so each section keeps its own type treatment */
  titleClassName = '',
  /** optional element rendered before the heading (a numeral, a roman numeral) */
  prefix = null,
  /** every group starts closed: leaving one open kept a third of the copy on
      screen and undid most of the density the collapse is there to buy */
  defaultOpen = false,
  children,
}) {
  const isPhone = useMediaQuery('(max-width: 720px)');
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  if (!isPhone) {
    return (
      <>
        {prefix}
        <h3 className={titleClassName}>{title}</h3>
        {children}
      </>
    );
  }

  return (
    <>
      {prefix}
      <h3 className={`${titleClassName} disclosure__heading`}>
        <button
          type="button"
          className="disclosure__trigger"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="disclosure__label">{title}</span>
          <span className="disclosure__mark" aria-hidden>
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path className="disclosure__mark-bar" d="M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div className="disclosure__panel" id={id} hidden={!open}>
        {children}
      </div>
    </>
  );
}
