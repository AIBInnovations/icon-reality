// Buying guide: the document checks behind a plot purchase.
//
// Copy, meta title, meta description, FAQs, keywords, dates and the canonical
// slug all come from the SEO brief (Google Doc, tab "How to Verify RERA, Title
// & Land Documents"). The brief's schema was written for
// /verify-rera-title-land-documents-before-buying-plot-indore/, which is why the
// slug is that and not the headline.
//
// No RERA numbers, prices or approval claims about any project (CLAUDE.md §5):
// this post is general due diligence and names no Icon Realty development. The
// brief's two caveats, that RERA is not a title check and that the checklist is
// not legal advice, are kept as callouts so they cannot be skimmed past.

export default {
  slug: 'verify-rera-title-land-documents-before-buying-plot-indore',
  title: 'How to Verify RERA, Title & Land Documents Before Buying a Plot in Indore',
  cardTitle: 'RERA, Title & Land Docs',
  category: 'Buying guide',
  articleSection: 'Real Estate Buying Guide',

  metaTitle: 'How to Verify RERA & Land Documents Before Buying a Plot',
  metaDescription:
    'Learn how to verify RERA, title deed, encumbrance, land use, layout, mutation, tax, road access and survey records before buying a plot in Indore.',
  excerpt:
    'RERA, the title chain, the sale deed, encumbrance, land use, the approved layout, mutation, tax, road access and the physical survey: the checks to complete before you pay for a plot in Indore.',

  answer:
    'Before buying a plot in Indore, verify the applicable RERA registration, ownership and title chain, sale deed, encumbrance status, Khasra/Khatauni records, land-use classification, approved layout, development permissions, mutation, property-tax status, legal road access and physical boundaries. Compare the documents with government records and conduct an independent legal and physical verification before making a substantial payment.',

  datePublished: '2026-09-16',
  dateModified: '2026-09-29',

  image: '/images/oscar/entrance/entrance-3.jpg',
  imageAlt:
    'Oscar Palace seen from above: the arched entrance gate on the highway, with tree-lined internal avenues and green open spaces behind it.',
  imageCredit: 'Oscar Palace, Indore–Nagpur Highway',

  keywords: [
    'property due diligence in Indore',
    'RERA verification in Indore',
    'land title verification in Indore',
    'plot verification in Indore',
    'title deed verification',
    'sale deed verification',
    'encumbrance certificate',
    'land-use classification in Indore',
    'approved layout',
    'development permissions',
    'mutation of property',
    'property tax verification',
    'physical survey of land',
  ],

  blocks: [
    // ---------------------------------------------------------------- intro
    {
      type: 'p',
      text: 'Buying a plot is not simply a decision about location, size or price. Before paying a token amount or signing an agreement, a buyer should establish whether the land can legally be sold, whether the seller has the right to sell it, whether the proposed development has the required permissions and whether the physical property matches the documents.',
    },
    {
      type: 'p',
      text: [
        'This process is commonly referred to as ',
        { text: 'property due diligence', b: true },
        '.',
      ],
    },
    {
      type: 'p',
      text: [
        'For anyone considering a residential plot in Indore, the verification should cover ',
        {
          text: 'RERA, title deed, sale deed, encumbrance, land-use classification, approved layout, development permissions, mutation, property tax, access road and physical survey',
          b: true,
        },
        '.',
      ],
    },
    {
      type: 'callout',
      title: 'NOT LEGAL ADVICE',
      text: 'The following checklist is designed as an educational starting point. Actual documents should be reviewed by an independent property lawyer and relevant technical professionals before purchase.',
    },

    // ------------------------------------------------------------------- 1
    { type: 'h2', text: '1. Start With RERA Verification' },
    {
      type: 'p',
      text: [
        "If the plotted development falls within the scope of the Real Estate (Regulation and Development) Act, check the project's ",
        { text: 'RERA registration', b: true },
        " rather than relying only on a brochure or salesperson's statement.",
      ],
    },
    {
      type: 'p',
      text: 'For a RERA-registered project, verify the project name, promoter details, registration number, approved information and other disclosures available through the relevant authority.',
    },
    {
      type: 'p',
      text: [
        'This is particularly important when comparing ',
        { text: 'new residential projects in Indore', to: '/projects' },
        ', ',
        { text: 'premium residential projects in Indore', b: true },
        ' or other plotted developments.',
      ],
    },
    {
      type: 'p',
      text: "Madhya Pradesh's real-estate regulatory framework applies to qualifying real-estate projects, and the MP Real Estate Appellate Tribunal has specifically considered plotted developments within the scope of RERA in its published decisions.",
    },
    {
      type: 'callout',
      title: 'RERA IS NOT A TITLE CHECK',
      text: 'Do not treat RERA registration as a substitute for title verification. RERA and title due diligence answer different questions.',
    },

    // ------------------------------------------------------------------- 2
    { type: 'h2', text: '2. Verify the Title Deed and Ownership Chain' },
    {
      type: 'p',
      text: [
        'The next step is ',
        { text: 'title deed verification', b: true },
        '.',
      ],
    },
    {
      type: 'p',
      text: 'Ask for the documents establishing how the present owner acquired the land and examine the chain of ownership going back through previous transfers as appropriate.',
    },
    { type: 'p', text: 'Check whether:' },
    {
      type: 'ul',
      items: [
        "The seller's name matches the land records.",
        'The survey or khasra details correspond across documents.',
        'Previous sale deeds or transfer documents are available.',
        'Any inheritance, partition, gift or court order affecting ownership is disclosed.',
        'The person signing the transaction actually has authority to sell.',
      ],
    },
    {
      type: 'p',
      text: "Madhya Pradesh's official land-record services provide access to certified Khasra, Khatauni, maps and other land records.",
    },
    {
      type: 'p',
      text: [
        'For higher-value ',
        { text: 'luxury property in Indore', b: true },
        ' or ',
        { text: 'premium property in Indore', b: true },
        ', independent legal title review becomes particularly important because the financial exposure can be substantial.',
      ],
    },

    // ------------------------------------------------------------------- 3
    { type: 'h2', text: '3. Check the Sale Deed Carefully' },
    {
      type: 'p',
      text: [
        'A ',
        { text: 'sale deed verification', b: true },
        ' should not be treated as a formality.',
      ],
    },
    {
      type: 'p',
      text: 'Compare the proposed transaction documents with the underlying land records. Pay attention to the seller and buyer names, survey/khasra numbers, area, boundaries, consideration, rights and restrictions.',
    },
    {
      type: 'p',
      text: 'If the seller is acting through a power of attorney, company, partnership or another representative arrangement, obtain appropriate documentation establishing that authority.',
    },
    {
      type: 'p',
      text: 'The registration system in Madhya Pradesh provides official services for property-related instruments, including sale and transfer documentation.',
    },

    // ------------------------------------------------------------------- 4
    { type: 'h2', text: '4. Obtain an Encumbrance Check' },
    {
      type: 'p',
      text: [
        'An ',
        { text: 'encumbrance certificate or equivalent encumbrance search', b: true },
        ' helps identify whether the property is affected by registered mortgages, charges or other recorded interests.',
      ],
    },
    {
      type: 'p',
      text: 'The Madhya Pradesh government service portal specifically describes obtaining an EC as a way to verify whether title is affected by loans or mortgages.',
    },
    {
      type: 'p',
      text: 'However, buyers should not assume that one certificate automatically resolves every possible legal issue. Ask a property lawyer to conduct an appropriate search of relevant records and litigation information.',
    },

    // ------------------------------------------------------------------- 5
    { type: 'h2', text: '5. Verify Land-Use Classification' },
    {
      type: 'p',
      text: 'A plot may look suitable for a house but still have restrictions relating to its permitted use.',
    },
    {
      type: 'p',
      text: [
        'Check the applicable ',
        { text: 'land-use classification in Indore', b: true },
        ', development plan, zoning and any conversion or diversion requirement.',
      ],
    },
    {
      type: 'p',
      text: "Madhya Pradesh's official services provide information relating to land use in approved development plans and proposed road widths.",
    },
    {
      type: 'p',
      text: [
        'This is especially important when evaluating ',
        { text: 'residential property for sale in Indore', b: true },
        ' or considering ',
        { text: 'property investment in Indore', to: '/investors' },
        ' based on future development expectations.',
      ],
    },

    // ------------------------------------------------------------------- 6
    { type: 'h2', text: '6. Check the Approved Layout' },
    { type: 'p', text: 'For a plotted development, never rely only on a marketing layout.' },
    {
      type: 'p',
      text: [
        'Request the ',
        { text: 'approved layout', b: true },
        ' and compare it with what is being offered. Check the plot number, dimensions, roads, open spaces, common areas and other relevant features.',
      ],
    },
    {
      type: 'p',
      text: "Madhya Pradesh's government service system includes processes for colony development permission and layout approval, including internal development permissions.",
    },
    {
      type: 'p',
      text: 'A layout shown in promotional material should therefore be distinguished from a layout actually approved by the competent authority.',
    },

    // ------------------------------------------------------------------- 7
    { type: 'h2', text: '7. Verify Development Permissions' },
    {
      type: 'p',
      text: 'A legally owned piece of land does not automatically mean every proposed development can proceed without additional permissions.',
    },
    {
      type: 'p',
      text: 'Depending on the location and nature of the development, check applicable development permissions, building-related permissions, diversion or land-use approvals, NOCs and other statutory requirements.',
    },
    {
      type: 'p',
      text: "Madhya Pradesh's official service ecosystem includes building permission, occupancy-related services and procedures for development and NOCs.",
    },

    // ------------------------------------------------------------------- 8
    { type: 'h2', text: '8. Check Mutation and Revenue Records' },
    {
      type: 'p',
      text: [
        { text: 'Mutation of property', b: true },
        ' records changes in ownership or other relevant interests in revenue records. It should be checked alongside the registered title documents rather than treated as the only proof of ownership.',
      ],
    },
    {
      type: 'p',
      text: 'The MP government provides services for mutation and certified Khasra, Khatauni and map records.',
    },
    {
      type: 'p',
      text: "The buyer should check whether the current owner's name and property details are reflected consistently across the relevant records.",
    },

    // ------------------------------------------------------------------- 9
    { type: 'h2', text: '9. Check Property Tax and Other Dues' },
    {
      type: 'p',
      text: [
        'Before purchasing developed property, ask whether applicable ',
        { text: 'property tax', b: true },
        ' and other local dues have been paid.',
      ],
    },
    {
      type: 'p',
      text: "Indore's district administration directs residents to the MP eNagar Palika system for online property-tax payment.",
    },
    {
      type: 'p',
      text: 'Obtain available receipts or statements and clarify outstanding amounts before completing the transaction.',
    },

    // ------------------------------------------------------------------ 10
    { type: 'h2', text: '10. Verify Access Road and Physical Boundaries' },
    {
      type: 'p',
      text: 'A document may describe a plot accurately, but the physical situation still needs to be checked.',
    },
    { type: 'p', text: 'Visit the property and verify:' },
    {
      type: 'ul',
      items: [
        'Actual plot location',
        'Boundary points',
        'Survey/khasra identification',
        'Road access',
        'Road width',
        'Surrounding land',
        'Encroachments',
        'Drainage and physical conditions',
        'Whether the site corresponds with the approved plan',
      ],
    },
    {
      type: 'p',
      text: "Madhya Pradesh's official services include applications for legal plot demarcation using site surveys and certified maps.",
    },
    {
      type: 'p',
      text: [
        'A ',
        { text: 'physical survey of land', b: true },
        ' by a qualified surveyor can be particularly useful when boundaries or measurements are unclear.',
      ],
    },

    // ----------------------------------------------------------- checklist
    { type: 'h2', text: 'A Practical Due-Diligence Checklist' },
    { type: 'p', text: 'Before buying a plot, maintain a document file containing:' },
    {
      type: 'ol',
      items: [
        'RERA registration details, where applicable',
        'Title deed and ownership chain',
        'Sale deed and previous transfer documents',
        'Encumbrance search/EC',
        'Khasra and Khatauni records',
        'Certified land map',
        'Mutation records',
        'Land-use classification',
        'Approved layout',
        'Development permissions',
        'Property-tax records',
        'Road/access documentation',
        'Physical survey report',
        'Independent legal opinion',
      ],
    },

    // ---------------------------------------------------------- why it matters
    { type: 'h2', text: 'Why This Matters for Any Property Buyer' },
    {
      type: 'p',
      text: [
        'Whether you are researching ',
        { text: 'luxury residential projects in Indore', b: true },
        ', ',
        { text: 'premium residential projects in Indore', to: '/projects/oscar-palace' },
        ', a plotted community or a conventional ',
        { text: 'residential property for sale in Indore', b: true },
        ', legal verification should come before assumptions about appreciation, amenities or future development.',
      ],
    },
    {
      type: 'p',
      text: [
        'The same principle applies to ',
        { text: 'luxury real estate in Indore', b: true },
        ', ',
        { text: 'premium real estate in Indore', b: true },
        ' and investment-focused purchases: first establish what you are legally buying, then evaluate whether the location and price suit your objectives.',
      ],
    },
    {
      type: 'p',
      text: [
        "Icon Realty's own website positions its business around ",
        { text: 'designing and marketing residential plotted developments', to: '/about' },
        ' in and around Indore, while also publishing ',
        {
          text: 'buyer-oriented material about evaluating plotted land',
          to: '/blog/what-to-check-before-buying-residential-plot-in-indore',
        },
        '.',
      ],
    },
    {
      type: 'p',
      text: 'That makes an educational approach to documentation and due diligence more useful than turning every property discussion into a sales pitch.',
    },

    // -------------------------------------------------------------- final
    { type: 'h2', text: 'Final Verification Before You Pay' },
    {
      type: 'p',
      text: 'A site visit alone cannot establish clear title. A registered document alone cannot establish that the proposed development is permitted. RERA registration alone does not replace independent title due diligence.',
    },
    {
      type: 'p',
      text: [
        'The safer approach is to connect the ',
        { text: 'documents, government records, approvals and physical land', b: true },
        ' and check whether they tell the same story.',
      ],
    },
    {
      type: 'p',
      text: 'For a significant property purchase, have the complete document set reviewed by an independent property lawyer and, where necessary, a qualified surveyor or technical professional before signing or making substantial payment.',
    },
    {
      type: 'p',
      text: [
        'A well-informed buyer does not simply ask, ',
        { text: '“Is this plot available?”', b: true },
        ' The more important question is, ',
        {
          text: '“Can I independently verify that this is the plot I am legally being offered, that the seller has the right to sell it, and that the proposed use and development are properly authorised?”',
          b: true,
        },
      ],
    },
  ],

  // The visible FAQ copy from the brief. FAQPage JSON-LD is built from these
  // same strings (seo/schema.js), so the markup matches what the page shows.
  faqs: [
    {
      q: 'How do I verify a plot before buying it in Indore?',
      a: 'Before buying a plot in Indore, verify the RERA status where applicable, ownership and title documents, sale deed, encumbrance records, land-use classification, approved layout, development permissions, mutation records, property tax status, access road and physical boundaries. Buyers should also compare the documents with official government land and property records and consider independent legal verification.',
    },
    {
      q: 'How do I verify RERA before buying a plot?',
      a: 'Check whether the project is required to be registered under applicable RERA rules and verify its registration details through the official Madhya Pradesh RERA system. Match the registered project information with the documents and details provided by the seller or developer. RERA requirements can vary depending on the nature and status of a project, so buyers should verify the specific project rather than relying only on a general RERA claim.',
    },
    {
      q: 'How do I verify land title in Indore?',
      a: 'Land title verification involves checking the chain of ownership and confirming that the person or entity selling the property has the legal right to transfer it. Buyers should review the title deed, previous sale or transfer documents, revenue records such as Khasra and Khatauni/B-1 records where applicable, mutation entries and other relevant documents. An independent property lawyer can help examine the title history and identify potential disputes or gaps.',
    },
    {
      q: 'What is an encumbrance certificate and why is it important?',
      a: 'An encumbrance certificate or relevant encumbrance record helps identify registered transactions, charges or other recorded interests associated with a property for the applicable period. It is an important part of property due diligence because it can help buyers check whether the property has recorded financial or legal burdens. However, an encumbrance check should not be treated as the only proof of clear title; a broader title search is advisable.',
    },
    {
      q: 'How do I verify the land-use classification of a plot in Indore?',
      a: 'Check the applicable master plan, land-use records and permissions issued by the relevant planning or local authority. The land should be permitted for the intended use, such as residential development, where applicable. Buyers should also verify whether any land-use conversion, development permission or other approval is required before construction or development.',
    },
    {
      q: 'Why should I verify the approved layout before buying a plot?',
      a: 'An approved layout helps establish how the plotted development has been planned and whether the plot, roads, open spaces and other designated areas correspond with the approved plan. Buyers should compare the plot number, dimensions, boundaries and road access shown in the sale documents with the approved layout and available official records before purchasing.',
    },
    {
      q: 'Why is a physical survey important before buying a plot?',
      a: 'A physical survey helps confirm the location, dimensions, boundaries and access of the plot on the ground. It can help identify differences between the documents, approved layout and actual site conditions. For important property transactions, buyers may consider getting the plot measured or demarcated through the appropriate authority or qualified survey professional before completing the purchase.',
    },
  ],
};
