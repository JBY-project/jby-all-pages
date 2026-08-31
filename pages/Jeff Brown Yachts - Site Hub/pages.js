/* Jeff Brown Yachts — catalogue of every page we have built.
   base = GitHub Pages path under https://ywteamyw.github.io/  */
window.JBY_BASE = 'https://ywteamyw.github.io/';

window.JBY_GROUPS = [
  {
    id: 'core',
    title: 'Main pages',
    note: 'The backbone of the site.',
    pages: [
      { id: 'home',        name: 'Home',                 path: 'jby-homepage.github.io/',        desc: 'Home page V3.31 — the master layout every other page is built on.' , site: '' },
      { id: 'about',       name: 'About Us',             path: 'jby-about/',                     desc: 'Story, numbers, team and service teasers.' , site: 'about/' },
      { id: 'services',    name: 'All Services',         path: 'jby-all-services/',              desc: 'Overview hub for the three service pages.' , site: 'services/' },
      { id: 'locations',   name: 'Our Locations',        path: 'jby-locations/',                 desc: 'Nine offices, cards on the left, live map on the right.' , site: 'locations/' },
      { id: 'office',      name: 'Office — San Diego',   path: 'jby-office/',                    desc: 'Single location page: marina & boatyard, vessels, local team.' , site: 'locations/san-diego/' },
      { id: 'team',        name: 'Our Team',             path: 'jby-team/',                      desc: '16 people, filter by location.' , site: 'team/' },
      { id: 'member',      name: 'Team Member',          path: 'jby-team-member/',               desc: 'Sales professional profile (Will De Jong).' , site: 'team/will-de-jong/' },
      { id: 'contact',     name: 'Contact Us',           path: 'jby-contact/',                   desc: 'Contact form with the custom interest dropdown.' , site: 'contact/' },
      { id: 'faq',         name: 'FAQ',                  path: 'jby-faq/',                       desc: '17 questions in 4 categories, live search and facet tabs.' , site: 'faq/' },
      { id: 'e404',        name: '404 Page not found',   path: 'jby-404/',                       desc: 'Navy hero, popular destinations, standard footer.' , site: '404/' },
      { id: 'events',      name: 'Events',               path: 'jby-events/',                    desc: 'Boat shows and owner events with the drive-up scroll animation.' , site: 'events/' }
    ]
  },
  {
    id: 'services',
    title: 'Service pages',
    note: 'Three services, plus the reworked variants.',
    pages: [
      { id: 'sm',      name: 'Service & Maintenance',        path: 'jby-service-maintenance/',   desc: 'Cinematic service page, version 1.' },
      { id: 'sm2',     name: 'Service & Maintenance V2',     path: 'jby-service-maintenance-2/', desc: 'Heavy revision: new map with wrench markers and yard modal.', tag: 'variant' , site: 'services/maintenance/' },
      { id: 'ym',      name: 'Yacht Management',             path: 'jby-yacht-management/',      desc: 'The Art of Effortless Ownership — full-bleed scenes.' , site: 'services/yacht-management/' },
      { id: 'sell',    name: 'Sell Your Yacht',              path: 'jby-sell-your-yacht/',       desc: 'Valuation form, stat strip, recently represented carousel.' },
      { id: 'sell2',   name: 'Sell Your Yacht V2',           path: 'jby-sell-your-yacht-v2/',    desc: 'Reworked: hero metrics, gallery showcase, social reach, testimonials.', tag: 'variant' , site: 'services/sell-your-yacht/' }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory & brands',
    note: 'Everything around a vessel.',
    pages: [
      { id: 'listing', name: 'Vessel Listing',       path: 'jby-listing/',      desc: 'Detail page: gallery, range map, spec tabs, loan calculator.' , site: 'listing/' },
      { id: 'model',   name: 'Model — Riva 112',     path: 'model-page/',       desc: 'Riva 112 Dolcevita Super: video hero, deck plans, tabbed gallery.' , site: 'models/riva-112/' },
      { id: 'axopar',  name: 'Brand — Axopar',       path: 'jby-axopar/',       desc: 'Brand page with prefilled contact modal and model range.' , site: 'brands/axopar/' }
    ]
  },
  {
    id: 'content',
    title: 'News & media',
    note: 'Three takes on the content hub, the newest one is on the site.',
    pages: [
      { id: 'kc4',       name: 'Knowledge Center V4',   path: 'jby-knowledge-center-v4/',          desc: 'Newest version of the hub. This is the one wired into the site.' , site: 'news/' },
      { id: 'kc4-art',   name: '— Article',             path: 'jby-knowledge-center-v4/article.html', desc: 'Article detail template.', sub: true , site: 'news/article/' },
      { id: 'kc4-vid',   name: '— Video',               path: 'jby-knowledge-center-v4/video.html',   desc: 'Video detail template.', sub: true , site: 'news/video/' },
      { id: 'kc4-evt',   name: '— Event',               path: 'jby-knowledge-center-v4/event.html',   desc: 'Event detail template.', sub: true , site: 'news/event/' },
      { id: 'kc4-search', name: '— Search',            path: 'jby-knowledge-center-v4/search.html',  desc: 'Search results inside the hub.', sub: true , site: 'news/search/' },
      { id: 'kc2',       name: 'Knowledge Center V2',   path: 'jby-knowledge-center/',             desc: 'The previous version of the hub.', tag: 'variant' },
      { id: 'news',      name: 'News & Media (V1)',     path: 'jby-news-media/',                desc: 'The lean 3-pillar first version.', tag: 'variant' }
    ]
  },
  {
    id: 'legal',
    title: 'Legal',
    note: 'One shared chassis for all three.',
    pages: [
      { id: 'privacy', name: 'Privacy Policy',           path: 'jby-privacy-policy/',           desc: 'Contents rail, black labels, standard footer.' , site: 'privacy-policy/' },
      { id: 'terms',   name: 'Terms & Conditions',       path: 'jby-terms-and-conditions/',     desc: 'Built on the Privacy Policy chassis.' , site: 'terms/' },
      { id: 'soi',     name: 'Statement of Information', path: 'jby-statement-of-information/', desc: 'The master legal page — verified data only.' , site: 'statement-of-information/' }
    ]
  },
  {
    id: 'concepts',
    title: 'Home page concepts',
    note: 'Same home page, different ideas on top.',
    pages: [
      { id: 'search',   name: 'Site Search',            path: 'jby-search/',                       desc: 'Header search panel in the YachtWay pattern.', tag: 'concept' },
      { id: 'results',  name: '— Search results',       path: 'jby-search/search.html',            desc: 'Full results page.', sub: true },
      { id: 'chat',     name: 'Chat plate',             path: 'jby-home-chat/',                    desc: 'Explore inventory plate with the fully rebuilt chat.', tag: 'concept' },
      { id: 'chat2',    name: 'Chat — stock Crisp',     path: 'jby-home-chat-v2/',                 desc: 'Stock Crisp widget in JBY navy, the cheap option.', tag: 'concept' },
      { id: 'intro',    name: 'Intro animation',        path: 'jby-home-intro/',                   desc: 'Aston Martin style loader, wordmark converges into the header.', tag: 'concept' },
      { id: 'intro2',   name: 'Intro animation V2',     path: 'jby-home-intro-v2/',                desc: 'Logo-only version of the loader.', tag: 'concept' },
      { id: 'menu',     name: 'Mega menu',              path: 'jby-mega-menu/',                    desc: 'Side-opening menu — start here, three variants inside.', tag: 'concept' },
      { id: 'menu1',    name: '— V1 light',             path: 'jby-mega-menu/JBY-Menu-V1-Light.html',    desc: 'Porsche style, light.', sub: true },
      { id: 'menu2',    name: '— V2 dark',              path: 'jby-mega-menu/JBY-Menu-V2-Dark.html',     desc: 'Aston Martin style, dark with photo.', sub: true },
      { id: 'menu3',    name: '— V3 dark, no photo',    path: 'jby-mega-menu/JBY-Menu-V3-Dark-NoPhoto.html', desc: 'Dark, frosted, no photography.', sub: true }
    ]
  },
  {
    id: 'libraries',
    title: 'Section libraries',
    note: 'Blocks to drop into any page.',
    pages: [
      { id: 'testi2',   name: 'Testimonials V2',        path: 'jby-testimonials-v2/',      desc: '10 premium layouts for quotes.', tag: 'library' },
      { id: 'testi1',   name: 'Testimonials V1',        path: 'jby-testimonial-variants/', desc: 'The first shortlist of layouts.', tag: 'library' },
      { id: 'mkt',      name: 'Marketing section',      path: 'jby-marketing-variants/',   desc: '10 layouts for the listing marketing block.', tag: 'library' }
    ]
  }
];

window.JBY_FLAT = window.JBY_GROUPS.flatMap(g => g.pages.map(p => ({ ...p, group: g.title })));
