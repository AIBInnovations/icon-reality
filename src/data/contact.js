// Single source of truth for every customer-facing contact detail on the site.
// Phone numbers, WhatsApp, email and address are referenced from the header,
// footer, dock, sticky mobile CTA, lead forms and JSON-LD — so they change here
// once, not in fifteen files.

export const PHONES = [
  { label: '+91 9425 9425 10', tel: '+919425942510', primary: true },
  { label: '+91 9425 9425 11', tel: '+919425942511' },
];

/** The number every sales CTA dials / opens WhatsApp on. */
export const PRIMARY_PHONE = PHONES[0];

/** wa.me wants a bare international number — no +, no spaces. */
export const WHATSAPP_NUMBER = '919425942510';

export const EMAIL = 'iconrealty02@gmail.com';

export const ADDRESS = {
  name: 'Icon Realty',
  locality: 'Indore',
  region: 'Madhya Pradesh',
  postalCode: '452001',
  country: 'India',
  lines: ['Icon Realty', 'Indore, Madhya Pradesh – 452001'],
};

export const MAPS_URL = 'https://maps.google.com/?q=Icon+Realty+Indore+Madhya+Pradesh';

export const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/iconrealtyofficial/' },
  { name: 'YouTube', url: 'https://www.youtube.com/@IconRealtyOfficial' },
  { name: 'Facebook', url: 'https://www.facebook.com/IconRealtyOfficial' },
];

/** `tel:` href for a phone entry — always use this, never plain text. */
export const telHref = (phone = PRIMARY_PHONE) => `tel:${phone.tel}`;
