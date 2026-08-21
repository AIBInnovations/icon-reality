// The site's information architecture, in one place.
//
// Header (desktop mega-menu), mobile accordion drawer, footer columns and the
// sitemap all read this — so a new route is added once and appears everywhere,
// and the three navigations can never drift out of sync.

import { projectsByStatus, availableStatuses } from './projects';
import { NRI_TOPICS } from './nri';

/**
 * Children marked `feature` render as the photo panel inside a desktop
 * mega-menu, keeping the dropdowns image-led like the rest of the site rather
 * than a bare column of links.
 */
/**
 * `side` places the item either side of the centred logo in the desktop bar,
 * and decides which edge its mega-menu is anchored to — left-side menus open
 * from their trigger's left edge, right-side menus from its right, so a panel
 * never runs off the screen.
 */
export const NAV = [
  {
    label: 'Projects',
    to: '/projects',
    side: 'left',
    feature: {
      image: '/images/oscar/entrance/entrance-1.jpg',
      title: 'Oscar Palace',
      note: 'Royal-estate plotting on the Indore–Nagpur Highway',
      to: '/projects/oscar-palace',
    },
    children: () => [
      ...availableStatuses().map((s) => ({
        label: s.plural,
        to: `/projects?status=${s.key}`,
        note: `${projectsByStatus(s.key).length} projects`,
      })),
      { label: 'All projects', to: '/projects' },
    ],
  },
  { label: 'About', to: '/about', side: 'left', image: '/images/ruchi-enclave/gallery-2.jpg' },
  { label: 'Why Indore', to: '/why-indore', side: 'left', image: '/images/labham-city/photo-2.jpg' },
  { label: 'Investors', to: '/investors', side: 'right', image: '/images/oscar-billionaire/gallery-1.jpg' },
  {
    label: 'NRI',
    to: '/nri',
    side: 'right',
    feature: {
      image: '/images/oscar/photos/photo-4.jpg',
      title: 'Buying from abroad',
      note: 'Remote inspection, documentation and registration support',
      to: '/nri#buying-process',
    },
    children: () => [
      { label: 'NRI Corner', to: '/nri' },
      // The six topics are sections of the one /nri page, not routes of their
      // own — so these are anchors. RouteTransition does the scrolling, which
      // is what makes them work from any other page too.
      ...NRI_TOPICS.map((t) => ({ label: t.nav, to: `/nri#${t.slug}`, note: t.summary })),
    ],
  },
  {
    label: 'Partners',
    to: '/channel-partners',
    side: 'right',
    feature: {
      image: '/images/oscar-fort/gallery-6.jpg',
      title: 'Become a channel partner',
      note: 'Portfolio, support structure and registration',
      to: '/channel-partners#register',
    },
    children: () => [
      { label: 'Channel Partners', to: '/channel-partners' },
      // Sections of the one /channel-partners page — see the NRI note above.
      { label: 'Why Partner With Icon', to: '/channel-partners#why-icon', note: 'A delivered portfolio, and range across price' },
      { label: 'Commission & Support', to: '/channel-partners#commission-support', note: 'How terms are set, and what support comes with them' },
      { label: 'Register', to: '/channel-partners#register', note: 'Three short steps, one of them required' },
    ],
  },
];

export const navLeft = () => NAV.filter((i) => i.side !== 'right');
export const navRight = () => NAV.filter((i) => i.side === 'right');

/** Resolve the lazily-built children (they read live project counts). */
export const childrenOf = (item) =>
  typeof item.children === 'function' ? item.children() : item.children || [];

/** Flat list of every navigable path — used by the footer and the sitemap. */
export function allNavPaths() {
  const out = [];
  for (const item of NAV) {
    out.push(item.to);
    for (const child of childrenOf(item)) {
      // query-string variants and #section anchors are the same document as
      // their parent — /projects?status=…, /nri#taxation
      if (!child.to.includes('?') && !child.to.includes('#')) out.push(child.to);
    }
  }
  return [...new Set(out)];
}
