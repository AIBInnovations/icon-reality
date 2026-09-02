// JSON-LD builders. Each returns a plain object ready to hand to <Seo jsonLd>.
import { SITE_URL, SITE_NAME, ORGANISATION, absoluteUrl } from './site.js';

const ORG_ID = `${SITE_URL}/#organisation`;
const SITE_ID = `${SITE_URL}/#website`;

export const organisationRef = { '@id': ORG_ID };

/**
 * Organization + WebSite. Site-wide and identical on every page, so these are
 * injected statically into index.html at build time rather than rendered by
 * React — they are then present for crawlers that don't execute JavaScript.
 *
 * No SearchAction: Google only honours a sitelinks searchbox when the site has
 * a real, crawlable search results URL. Icon Realty has no search page, so
 * declaring one would be markup for a feature that doesn't exist. Add a
 * /search?q= route first, then a SearchAction here.
 */
export function organisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: ORGANISATION.legalName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(ORGANISATION.logo),
    },
    email: ORGANISATION.email,
    telephone: ORGANISATION.telephone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORGANISATION.address.locality,
      addressRegion: ORGANISATION.address.region,
      postalCode: ORGANISATION.address.postalCode,
      addressCountry: ORGANISATION.address.country,
    },
    sameAs: ORGANISATION.sameAs,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-IN',
    publisher: organisationRef,
  };
}

/** BreadcrumbList from [{ name, path }] — path omitted on the current page. */
export function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

/** RealEstateAgent — the richest business type for a plotting developer. */
export function realEstateAgentSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#realestateagent`,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl(ORGANISATION.logo),
    logo: absoluteUrl(ORGANISATION.logo),
    email: ORGANISATION.email,
    telephone: ORGANISATION.telephone,
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORGANISATION.address.locality,
      addressRegion: ORGANISATION.address.region,
      postalCode: ORGANISATION.address.postalCode,
      addressCountry: ORGANISATION.address.country,
    },
    areaServed: { '@type': 'City', name: 'Indore' },
    sameAs: ORGANISATION.sameAs,
    parentOrganization: organisationRef,
  };
}

/** ImageObject for a single image path. */
export function imageObjectSchema(path, caption) {
  if (!path) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: absoluteUrl(path),
    url: absoluteUrl(path),
    ...(caption ? { caption, name: caption } : {}),
  };
}

/** VideoObject — only emitted for projects that actually have a walkthrough. */
export function videoObjectSchema(project) {
  if (!project?.video_url) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${project.name}, walkthrough`,
    description: project.tagline || project.description || `${project.name} video walkthrough.`,
    thumbnailUrl: [absoluteUrl(project.video_poster || project.hero_image)],
    contentUrl: absoluteUrl(project.video_url),
    // schema.org requires uploadDate; the project data has no per-video date,
    // so this is the site's publish date rather than a fabricated one.
    uploadDate: '2026-01-01',
    publisher: organisationRef,
  };
}

/** A plotted development, described as a Residence offered by Icon Realty. */
export function projectSchema(project) {
  if (!project) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    '@id': `${SITE_URL}/projects/${project.slug}#residence`,
    name: project.name,
    description: project.description || project.tagline,
    url: absoluteUrl(`/projects/${project.slug}`),
    ...(project.hero_image ? { image: absoluteUrl(project.hero_image) } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.location,
      addressLocality: ORGANISATION.address.locality,
      addressRegion: ORGANISATION.address.region,
      addressCountry: ORGANISATION.address.country,
    },
    ...(project.amenities?.length
      ? {
          amenityFeature: project.amenities.map((a) => ({
            '@type': 'LocationFeatureSpecification',
            name: a,
            value: true,
          })),
        }
      : {}),
    ...(project.plot_sizes ? { floorSize: { '@type': 'QuantitativeValue', name: project.plot_sizes } } : {}),
  };
}

/** ItemList for the projects index — helps Google understand the collection. */
export function projectListSchema(projects) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Icon Realty projects',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/projects/${p.slug}`),
      name: p.name,
    })),
  };
}

/** FAQPage from [{ q, a }]. */
export function faqSchema(items) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** ContactPage / AboutPage wrappers. */
export function webPageSchema(type, { name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: organisationRef,
  };
}

/* ------------------------------------------------------------------ blog -- */

/**
 * BlogPosting for one post.
 *
 * `mainEntityOfPage` is the post's real canonical URL, which is also what the
 * <Seo> canonical link and the sitemap emit: three places, one value, so a
 * crawler is never told the page is two different documents.
 *
 * Author and publisher are the organisation, not a person — these are Icon
 * Realty's own editorial pages and no named byline exists to attribute them to.
 */
export function blogPostingSchema(post) {
  if (!post) return null;
  const url = absoluteUrl(post.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: organisationRef,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    inLanguage: 'en-IN',
    ...(post.keywords?.length ? { keywords: post.keywords } : {}),
    ...(post.readingMinutes ? { timeRequired: `PT${post.readingMinutes}M` } : {}),
    articleSection: post.category,
    isPartOf: { '@id': `${SITE_URL}/blog#blog` },
  };
}

/** The /blog index itself, with its posts as blogPost entries. */
export function blogSchema(posts = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: `${SITE_NAME} blog`,
    description:
      'Guides to buying residential plots in Indore: legal checks, location comparisons, gated plotted developments and Icon Realty projects.',
    url: absoluteUrl('/blog'),
    inLanguage: 'en-IN',
    publisher: organisationRef,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': `${absoluteUrl(post.path)}#blogposting`,
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(post.path),
      datePublished: post.datePublished,
      dateModified: post.dateModified || post.datePublished,
      ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: organisationRef,
    })),
  };
}
