/* Jeff Brown Yachts — shared site chrome.
   Injected into every page of the assembled site. Each page keeps its own markup and assets
   (resolved through <base> to the repo it was built in); this file only adds the global
   navigation, fixes in-page anchors under <base>, and points placeholder links at real pages. */
(function () {
  var ROOT = '/jby-site/';

  var MENU = [
    { title: 'Yachts', links: [
      { href: 'listing/',              label: 'Vessel listing',  note: 'Riva 112 detail page' },
      { href: 'models/riva-112/',      label: 'Riva 112 Dolcevita Super' },
      { href: 'brands/axopar/',        label: 'Axopar' }
    ]},
    { title: 'Services', links: [
      { href: 'services/',                     label: 'All services' },
      { href: 'services/maintenance/',         label: 'Service & Maintenance' },
      { href: 'services/yacht-management/',    label: 'Yacht Management' },
      { href: 'services/sell-your-yacht/',     label: 'Sell Your Yacht' }
    ]},
    { title: 'Company', links: [
      { href: 'about/',                 label: 'About us' },
      { href: 'team/',                  label: 'Our team' },
      { href: 'team/will-de-jong/',     label: 'Team member' },
      { href: 'locations/',             label: 'Locations' },
      { href: 'locations/san-diego/',   label: 'San Diego marina' },
      { href: 'events/',                label: 'Events' },
      { href: 'contact/',               label: 'Contact us' },
      { href: 'faq/',                   label: 'FAQ' }
    ]},
    { title: 'News & media', links: [
      { href: 'news/',          label: 'News hub' },
      { href: 'news/article/',  label: 'Article' },
      { href: 'news/video/',    label: 'Video' },
      { href: 'news/event/',    label: 'Event' },
      { href: 'news/search/',   label: 'Search results' },
      { href: 'all-pages/',     label: 'All prototypes', note: 'every version we built' }
    ]}
  ];

  var FOOT = [
    { href: 'privacy-policy/',            label: 'Privacy Policy' },
    { href: 'terms/',                     label: 'Terms & Conditions' },
    { href: 'statement-of-information/',  label: 'Statement of Information' }
  ];

  /* label -> page, used to repoint placeholder links inside the pages */
  var BY_TEXT = {
    'home': '', 'about jby': 'about/', 'about us': 'about/', 'about': 'about/',
    'services': 'services/', 'all services': 'services/', 'experiences': 'events/',
    'events': 'events/', 'view all events': 'events/', 'request to attend': 'contact/',
    'portfolio': 'listing/', 'inventory': 'listing/', 'see all': 'listing/',
    'view all': 'listing/', 'explore inventory': 'listing/',
    'brands': 'brands/axopar/', 'our team': 'team/', 'team': 'team/',
    'locations': 'locations/', 'our locations': 'locations/',
    'contact': 'contact/', 'contact us': 'contact/', 'contact an expert': 'contact/',
    'privacy policy': 'privacy-policy/', 'terms & conditions': 'terms/',
    'terms and conditions': 'terms/', 'statement of information': 'statement-of-information/',
    'faq': 'faq/', 'frequently asked questions': 'faq/',
    'san diego': 'locations/san-diego/', 'newport harbor': 'locations/', 'marina del rey': 'locations/',
    'sausalito': 'locations/', 'seattle': 'locations/', 'kona': 'locations/',
    'wrightsville beach': 'locations/', 'charleston': 'locations/', 'san diego marina & boatyard': 'locations/san-diego/'
  };


  /* pages as they live in their own repos -> where they sit on this site,
     so any link that points at a source repo stays inside the site */
  var ORIGIN = 'https://ywteamyw.github.io/';
  var SRC = {
    'jby-homepage.github.io/': '', 'jby-about/': 'about/', 'jby-all-services/': 'services/',
    'jby-service-maintenance-2/': 'services/maintenance/', 'jby-service-maintenance/': 'services/maintenance/',
    'jby-yacht-management/': 'services/yacht-management/',
    'jby-sell-your-yacht-v2/': 'services/sell-your-yacht/', 'jby-sell-your-yacht/': 'services/sell-your-yacht/',
    'jby-team/': 'team/', 'jby-team-member/': 'team/will-de-jong/',
    'jby-locations/': 'locations/', 'jby-office/': 'locations/san-diego/',
    'jby-contact/': 'contact/', 'jby-events/': 'events/', 'jby-listing/': 'listing/',
    'model-page/': 'models/riva-112/', 'jby-axopar/': 'brands/axopar/',
    'jby-knowledge-center-v4/': 'news/', 'jby-knowledge-center-v4/article.html': 'news/article/',
    'jby-knowledge-center-v4/video.html': 'news/video/', 'jby-knowledge-center-v4/event.html': 'news/event/',
    'jby-knowledge-center-v4/search.html': 'news/search/',
    'jby-knowledge-center/': 'news/', 'jby-knowledge-center/article.html': 'news/article/',
    'jby-knowledge-center/video.html': 'news/video/', 'jby-knowledge-center/event.html': 'news/event/', 'jby-knowledge-center/search.html': 'news/search/',
    'jby-privacy-policy/': 'privacy-policy/', 'jby-terms-and-conditions/': 'terms/',
    'jby-statement-of-information/': 'statement-of-information/',
    'jby-faq/': 'faq/', 'jby-404/': '404/'
  };

  function mapped(href) {
    if (!href || href.indexOf(ORIGIN) !== 0) return null;
    var rest = href.slice(ORIGIN.length);
    var tail = '';
    var cut = rest.search(/[#?]/);
    if (cut > -1) { tail = rest.slice(cut); rest = rest.slice(0, cut); }
    var key = SRC.hasOwnProperty(rest) ? rest : rest.replace(/index\.html$/, '');
    if (!SRC.hasOwnProperty(key)) return null;
    return ROOT + SRC[key] + tail;
  }

  var here = location.pathname.replace(/index\.html$/, '');

  /* 1. keep in-page anchors on this page (they would otherwise follow <base>) */
  function fixAnchors(scope) {
    (scope || document).querySelectorAll('a[href^="#"]').forEach(function (a) {
      var raw = a.getAttribute('href');
      if (!raw || raw === '#') return;
      a.setAttribute('href', here + raw);
    });
  }

  /* 2. build the global menu */
  function col(group) {
    var links = group.links.map(function (l) {
      var href = ROOT + l.href;
      var cur = (here === href) ? ' class="is-current"' : '';
      return '<a href="' + href + '"' + cur + '>' + l.label +
             (l.note ? '<small>' + l.note + '</small>' : '') + '</a>';
    }).join('');
    return '<div class="jbys-col"><h4>' + group.title + '</h4>' + links + '</div>';
  }

  var menu = document.createElement('nav');
  menu.className = 'jbys-menu';
  menu.setAttribute('aria-label', 'Site menu');
  menu.setAttribute('aria-hidden', 'true');
  menu.innerHTML =
    '<div class="jbys-menu-top">' +
      '<a class="jbys-home" href="' + ROOT + '">Jeff Brown Yachts</a>' +
      '<button class="jbys-close" aria-label="Close menu">&#10005;</button>' +
    '</div>' +
    '<div class="jbys-menu-body">' + MENU.map(col).join('') + '</div>' +
    '<div class="jbys-menu-foot">' +
      '<a href="tel:+18886938099">(888) 693-8099</a>' +
      '<a href="mailto:info@jeffbrownyachts.com">info@jeffbrownyachts.com</a>' +
      FOOT.map(function (l) { return '<a href="' + ROOT + l.href + '">' + l.label + '</a>'; }).join('') +
    '</div>';

  function open() { menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('jbys-open'); }
  function close() { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('jbys-open'); }

  function init() {
    document.body.appendChild(menu);
    menu.querySelector('.jbys-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    /* bind every burger the page already has */
    var burgers = document.querySelectorAll('.burger, .nav-burger, [data-menu-toggle], [aria-label="Menu"], [aria-label="Open menu"]');
    burgers.forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(); }, true);
    });

    /* pages without a burger get a floating button */
    if (!burgers.length) {
      var fab = document.createElement('button');
      fab.className = 'jbys-fab';
      fab.type = 'button';
      fab.textContent = 'Menu';
      fab.addEventListener('click', open);
      document.body.appendChild(fab);
    }

    /* logo always returns to the home page of this site */
    document.querySelectorAll('.nav .logo, .logo, .foot-logo a, a.brand').forEach(function (a) {
      if (a.tagName === 'A') a.setAttribute('href', ROOT);
    });

    /* repoint placeholder links by their label */
    document.querySelectorAll('a').forEach(function (a) {
      var raw = a.getAttribute('href');
      if (raw && raw !== '#' && raw.charAt(0) !== '#') return;      /* real link, leave it */
      if (a.closest('.jbys-menu')) return;
      if (a.querySelector('svg')) return;                            /* social icons */
      var t = (a.textContent || '').trim().toLowerCase();
      if (BY_TEXT.hasOwnProperty(t)) a.setAttribute('href', ROOT + BY_TEXT[t]);
    });

    /* "Contact an expert" buttons that are not links */
    document.querySelectorAll('button').forEach(function (b) {
      var t = (b.textContent || '').trim().toLowerCase();
      if (t === 'contact an expert' && !b.hasAttribute('data-target') && !b.hasAttribute('data-open-expert')) {
        b.addEventListener('click', function () { location.href = ROOT + 'contact/'; });
      }
    });

    /* links that point back at a source repo are pulled into the site */
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.closest('.jbys-menu')) return;
      var to = mapped(a.href);
      if (to) a.setAttribute('href', to);
    });

    fixAnchors(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
