import Reveal from './Reveal';
import { BANK_PARTNERS, BANK_PARTNER_NOTE } from '../data/company';
import './BankPartners.css';

/**
 * Home-loan assistance.
 *
 * Icon Realty states that bank loans are available on its plots but has not
 * published a list of tie-ups, so this renders the factual statement and no
 * logos. The moment real partners are added to data/company.js the list
 * appears — inventing bank relationships in the meantime would be a claim made
 * on someone else's behalf (read.md §36, §71).
 */
export default function BankPartners({
  partners = BANK_PARTNERS,
  note = BANK_PARTNER_NOTE,
  heading = 'Home loan assistance.',
  eyebrow = 'Banking',
  action,
  className = '',
  id,
}) {
  return (
    <section className={`bank-partners ${className}`} id={id}>
      <div className={`container bank-partners__inner ${partners.length ? '' : 'bank-partners__inner--solo'}`}>
        <div className="bank-partners__copy">
          <Reveal as="span" className="eyebrow bank-partners__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display bank-partners__heading" delay={0.05}>{heading}</Reveal>
          <Reveal as="p" className="bank-partners__note" delay={0.1}>{note}</Reveal>
          {action && <Reveal className="bank-partners__action" delay={0.15}>{action}</Reveal>}
        </div>

        {partners.length > 0 && (
          <Reveal className="bank-partners__logos" delay={0.1}>
            <ul>
              {partners.map((b) => (
                <li key={b.name}>
                  {b.logo
                    ? <img src={b.logo} alt={b.name} loading="lazy" decoding="async" />
                    : <span>{b.name}</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
