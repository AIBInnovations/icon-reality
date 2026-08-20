// NRI Corner — hub + six topic pages, all driven from this file.
//
// Every topic renders through the same <NriTopicPage> component, so the six
// routes share one layout and one lead flow. Content here is general
// information about how buying property in India works for a non-resident; it
// is explicitly not personalised legal, tax or financial advice, and the
// disclaimers below are rendered on the pages that need them (read.md §35, §38).

import { EMAIL } from './contact';

export const NRI_INTRO =
  "Buying property in India from abroad is mostly a documentation problem, not a property problem. The plot you can inspect on video; the paperwork, the payment route and the registration are what actually need someone on the ground. That is the part our NRI desk handles.";

export const NRI_MEDIA = {
  hero: { src: '/images/oscar/photos/photo-4.jpg', credit: 'Oscar Palace, Indore–Nagpur Highway' },
  support: { src: '/images/siddhayatan/gallery-6.jpg', credit: 'Siddhayatan, Manglia' },
};

export const NRI_ASSURANCES = [
  { k: 'One point of contact', v: 'The same person from first call to registration — across time zones.' },
  { k: 'Remote inspection', v: 'Live video walkthroughs of the actual plot, not a marketing film.' },
  { k: 'Documentation support', v: 'Agreement, registration and coordination with your representative in India.' },
  { k: 'Nothing gated', v: 'Layouts, plot sizes and galleries are viewable without submitting a form.' },
];

/**
 * The six NRI topics. `slug` becomes /nri/<slug>. Each is content-complete on
 * its own — sections render only if they carry data, so a topic can grow
 * without touching the component.
 */
export const NRI_TOPICS = [
  {
    slug: 'buying-process',
    nav: 'Buying Process',
    title: 'The buying process for NRIs',
    summary: 'Nine steps from first enquiry to handover, written for someone who is not in India.',
    hero: { src: '/images/oscar/entrance/entrance-2.jpg', credit: 'Oscar Palace' },
    intro:
      "Nothing below is unique to Icon Realty — this is broadly how a plotted purchase in India works for a non-resident. We have written it out so you can see the whole path before you start, and know which steps need you physically present (very few) and which do not.",
    steps: [
      { title: 'Discover projects', body: 'Browse layouts, plot sizes, locations and galleries on this site. None of it is behind a form.' },
      { title: 'Virtual consultation', body: 'A call at a time that works in your zone. We go through corridors, plot availability and honest distances.' },
      { title: 'Select the property', body: 'Shortlist plots by size, orientation and position in the layout. We send the master layout marked with what is available.' },
      { title: 'KYC & documentation', body: 'Passport, OCI/PIO card where applicable, PAN, overseas address proof and photographs. We tell you exactly what is needed before you gather anything.' },
      { title: 'Legal & RERA verification', body: 'Title documents, approved layout and any applicable RERA registration — reviewed by you or your legal representative before you commit.' },
      { title: 'Financing (if required)', body: 'If you intend to use an NRI home loan, we coordinate the project-side documentation the lender asks for.' },
      { title: 'Booking', body: 'Booking amount paid through your NRE / NRO account or normal banking channels, followed by the agreement.' },
      { title: 'Power of attorney & registration', body: 'Registration happens at the sub-registrar in Indore. If you cannot travel, a power of attorney lets a trusted representative sign on your behalf.' },
      { title: 'Handover', body: 'Registered documents, plot demarcation on site, and a walkthrough — recorded on video if you are not able to attend.' },
    ],
    ctaHeading: 'Start with a call, not a form.',
    ctaBody: 'Tell us your time zone and we will call you at a reasonable hour.',
  },
  {
    slug: 'legal-rera',
    nav: 'Legal & RERA',
    title: 'Legal & RERA support',
    summary: 'What RERA is, what to verify before you commit, and where we help.',
    hero: { src: '/images/oscar/layout/layout-2.jpg', credit: 'Oscar Palace — plot layout' },
    intro:
      'RERA — the Real Estate (Regulation and Development) Act — established a state-level regulator that registered real-estate projects report to. In Madhya Pradesh that is MP RERA. Where a project is registered, its registration number and details are publicly searchable on the regulator\'s website.',
    sections: [
      {
        title: 'What to verify before you commit',
        items: [
          'The title documents for the land, and the chain of ownership behind them.',
          'The approved layout plan, and that the plot you are buying appears on it.',
          'Any applicable RERA registration for the project, checked directly on the regulator\'s own website rather than on a brochure.',
          'Approvals from the relevant local planning authority.',
          'That the plot dimensions in the agreement match what is demarcated on site.',
        ],
      },
      {
        title: 'Where we help',
        items: [
          'Providing the project documentation set for your review, or your lawyer\'s.',
          'Sharing RERA registration details for projects that carry them — displayed on the project page itself, not buried in a footer.',
          'Coordinating the agreement and the registration appointment at the sub-registrar in Indore.',
          'Working with your legal representative or power of attorney holder in India.',
        ],
      },
    ],
    note:
      'We provide documentation and coordination. We do not provide legal advice, and we would encourage you to have an independent advocate review any purchase — including one from us.',
    ctaHeading: 'Ask us for the document set.',
    ctaBody: 'Tell us which project you are considering and we will send what we hold on it.',
  },
  {
    slug: 'taxation',
    nav: 'Taxation',
    title: 'Taxation — a general guide for NRI buyers',
    summary: 'The categories of tax that come up when a non-resident buys, holds, rents or sells Indian property.',
    hero: { src: '/images/ruchi-lifescapes/gallery-5.jpg', credit: 'Ruchi Lifescapes, Jhalaria' },
    intro:
      'This page sets out the categories you will encounter, so that you know what to ask your tax advisor about. Rates, thresholds and treaty treatment change, and they depend on your residency status and personal circumstances — so no rates are quoted here.',
    sections: [
      {
        title: 'At the time of purchase',
        items: [
          'Stamp duty and registration charges, levied by the state government of Madhya Pradesh on the registered value.',
          'GST, where applicable to the transaction type. Treatment differs between land, under-construction property and completed property.',
          'TDS on the purchase consideration, where the transaction crosses the applicable threshold — the buyer is responsible for deducting and depositing it.',
        ],
      },
      {
        title: 'While you hold the property',
        items: [
          'Municipal property tax, payable locally.',
          'Income tax on rental income, if the property is let out. Non-residents are taxable in India on income arising in India.',
          'TDS on rent, which a tenant may be required to deduct when paying rent to a non-resident.',
        ],
      },
      {
        title: 'When you sell',
        items: [
          'Capital gains tax, with the treatment depending on how long the property was held.',
          'TDS on the sale consideration payable to a non-resident, which the buyer deducts.',
          'Availability of exemptions and reinvestment reliefs, subject to conditions.',
        ],
      },
      {
        title: 'Payment routes & repatriation',
        items: [
          'Purchases are funded through normal banking channels or from NRE / NRO / FCNR accounts.',
          'Which account you pay from affects how easily sale proceeds can later be repatriated, so it is worth deciding before you pay, not after.',
          'Repatriation of sale proceeds is subject to RBI/FEMA conditions and limits, and generally requires certification from a chartered accountant.',
        ],
      },
    ],
    disclaimer:
      'Tax treatment depends on individual circumstances and applicable law. This page is general information and not personalised tax advice.',
    ctaHeading: 'Speak with the NRI desk.',
    ctaBody: 'We can walk you through the process and, where useful, point you to independent professionals.',
  },
  {
    slug: 'home-loans',
    nav: 'Home Loans',
    title: 'Home loan assistance for NRIs',
    summary: 'How NRI home loans typically work, what lenders ask for, and what we coordinate.',
    hero: { src: '/images/oscar-fort/gallery-3.jpg', credit: 'Oscar Fort, Bicholi Mardana' },
    intro:
      'Indian banks and housing finance companies lend to non-residents for property purchase, on terms that differ from resident lending. Eligibility, loan-to-value and tenure are set by the lender — not by us — so the honest summary below stops where the bank\'s underwriting begins.',
    sections: [
      {
        title: 'How it typically works',
        items: [
          'You apply to an Indian lender directly, or through their overseas representative where one exists.',
          'The lender assesses eligibility on income, employment stability, age and existing obligations.',
          'Loan-to-value, tenure and rate are determined by the lender under its own policy and applicable RBI norms.',
          'EMI repayment is made from an NRE / NRO account or through normal banking channels.',
          'A resident co-applicant or representative is often required; requirements vary by lender.',
        ],
      },
      {
        title: 'Documents lenders commonly ask for',
        items: [
          'Passport and visa, plus OCI / PIO card where applicable.',
          'Overseas address proof and employment contract or appointment letter.',
          'Salary slips and overseas bank statements.',
          'PAN and Indian address proof where available.',
          'A power of attorney in favour of a representative in India, in the lender\'s prescribed format.',
        ],
      },
      {
        title: 'What we coordinate',
        items: [
          'The project-side documentation the lender asks for — approved layout, title set, and the agreement.',
          'Scheduling valuation or technical inspection visits at the site.',
          'Acting as the point of contact in Indore while you are abroad.',
        ],
      },
    ],
    note:
      'Icon Realty is not a lender and does not arrange credit. Eligibility, sanction, rate and terms are decided entirely by the bank or housing finance company you apply to.',
    ctaHeading: 'Need the project documents for a lender?',
    ctaBody: 'Tell us the project and the bank, and we will send what they ask us for.',
  },
  {
    slug: 'virtual-tours',
    nav: 'Virtual Tours',
    title: 'Virtual tours & remote booking',
    summary: 'Inspect the plot, the layout and the site from wherever you are — then book remotely.',
    hero: { src: '/images/oscar/park/park-7.jpg', credit: 'Oscar Palace' },
    intro:
      "A marketing film shows a project at its best. A live video call shows it as it is on the day you ask. We do both, and we would rather you saw the second one before you commit anything.",
    sections: [
      {
        title: 'What a remote inspection includes',
        items: [
          'A live video call from the site, walking the actual plot you are considering — not a showcase corner.',
          'The master layout on screen, with available plots marked.',
          'Road widths, boundary, entry and the position of your plot relative to open space.',
          'Recorded walkthroughs you can re-watch, or send to family, afterwards.',
          'Project films and construction footage where they exist.',
        ],
      },
      {
        title: 'Booking remotely',
        items: [
          'Documentation shared and reviewed digitally before anything is signed.',
          'Booking amount paid through normal banking channels or your NRE / NRO account.',
          'Agreement executed remotely, with registration handled in Indore by you or your power of attorney holder.',
          'Recorded handover if you are not able to travel for it.',
        ],
      },
    ],
    ctaHeading: 'Schedule a virtual site visit.',
    ctaBody: 'Pick a date and time in your zone. We will call from the site.',
    ctaLabel: 'Schedule a Virtual Site Visit',
  },
  {
    slug: 'power-of-attorney',
    nav: 'Power of Attorney',
    title: 'Power of attorney guidance',
    summary: 'What a POA is used for in a property purchase, and how it is typically executed from abroad.',
    hero: { src: '/images/singapore-lifestyle-2/gallery-2.jpg', credit: 'Singapore Lifestyle 2, Super Corridor' },
    intro:
      'A power of attorney is a legal instrument by which you authorise someone in India to act on your behalf. In a property purchase it exists to solve one problem: registration happens in person, at the sub-registrar, in Indore.',
    sections: [
      {
        title: 'When a POA is typically used',
        items: [
          'Executing and registering the sale deed when you cannot travel.',
          'Completing formalities a lender requires in India.',
          'Handling post-registration formalities such as mutation and utility connections.',
          'Taking physical handover of the plot on your behalf.',
        ],
      },
      {
        title: 'How it is typically executed from abroad',
        items: [
          'The document is drafted in India, in the format the transaction and any lender require.',
          'It is signed by you abroad, and attested or notarised — commonly at an Indian consulate or embassy, or before a notary in your country of residence.',
          'It is then sent to India, where it is adjudicated and stamped as applicable before use.',
          'Procedure and stamping requirements differ by country and by state — confirm the exact route for your case before you sign anything.',
        ],
      },
      {
        title: 'Choosing a POA holder',
        items: [
          'A POA carries real authority. It should be given to someone you would trust with the asset itself.',
          'It can be drafted narrowly — limited to a specific transaction and a specific property — rather than as a general authority.',
          'It can be revoked, following the applicable procedure.',
        ],
      },
    ],
    note:
      'This page is general information about how a power of attorney is commonly used, not legal advice. Have the instrument drafted and reviewed by an advocate for your specific circumstances.',
    ctaHeading: 'Speak with NRI assistance.',
    ctaBody: 'We can explain how registration works for the project you are considering, and coordinate with your representative in India.',
    ctaLabel: 'Speak With NRI Assistance',
  },
];

export const NRI_TOPICS_BY_SLUG = NRI_TOPICS.reduce((acc, t) => {
  acc[t.slug] = t;
  return acc;
}, {});

export const NRI_DESK = {
  email: EMAIL,
  note: 'Our NRI desk works around your time zone — tell us where you are and when suits, and we will call then.',
};
