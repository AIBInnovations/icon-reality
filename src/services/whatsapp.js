import { WHATSAPP_NUMBER } from '../data/contact';

/**
 * Build a wa.me deep link with a pre-filled, context-aware message.
 *
 * Always a real URL rendered on a real <a> — never a JS click handler — so it
 * opens in the WhatsApp app on mobile, keeps middle-click/long-press working,
 * and is picked up automatically by the delegated whatsapp_click tracker in
 * analytics/Analytics.jsx.
 */
export function whatsappUrl(message) {
  const text = (message || DEFAULT_MESSAGE).trim();
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_MESSAGE =
  "Hi Icon Realty, I'd like to know more about your projects.";

/** Contextual openers, so the team knows what the chat is about on message one. */
export const waMessage = {
  project: (name) =>
    `Hi Icon Realty, I'm interested in ${name}. Please share more details.`,
  siteVisit: (name) =>
    name
      ? `Hi Icon Realty, I'd like to book a site visit at ${name}.`
      : "Hi Icon Realty, I'd like to book a site visit.",
  price: (name) =>
    `Hi Icon Realty, please share price details for ${name}.`,
  brochure: (name) =>
    `Hi Icon Realty, please share the ${name} brochure.`,
  investor: () =>
    'Hi Icon Realty, I would like to schedule an investment consultation.',
  nri: () =>
    "Hi Icon Realty, I'm an NRI buyer and would like assistance with property selection and remote booking.",
  virtualTour: (name) =>
    name
      ? `Hi Icon Realty, I'd like to schedule a virtual site visit for ${name}.`
      : "Hi Icon Realty, I'd like to schedule a virtual site visit.",
  channelPartner: () =>
    "Hi Icon Realty, I'm interested in becoming a channel partner.",
  general: () => DEFAULT_MESSAGE,
};
