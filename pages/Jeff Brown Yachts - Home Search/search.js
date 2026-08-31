
/* ======================================================================
   JBY SITE SEARCH
   Full-screen, keyboard-driven search across the whole Jeff Brown Yachts
   site. The index is built from two sources:
     1. STATIC — pages, brands and services that live on other URLs
     2. HARVEST — vessels, events, offices and sections read out of this
        page's own DOM at load, so the index never drifts from the markup
   ====================================================================== */
(function(){
  'use strict';

  var SITE = 'https://ywteamyw.github.io/';

  /* ---------- 1. STATIC INDEX ----------------------------------------- */

  var PAGES = [
    {t:'Home',                  d:'Bespoke yacht sales and brokerage',                    u:SITE+'jby-homepage.github.io/',  i:'ti-home',        k:'homepage main start'},
    {t:'About Us',              d:'Our story, our people, and how we work',               u:SITE+'jby-homepage.github.io/about.html', i:'ti-info-circle', k:'about company history story who we are'},
    {t:'Our Team',              d:'Meet the brokers, service crew and management',        u:SITE+'jby-team/',                i:'ti-users',       k:'team people staff crew brokers employees'},
    {t:'Our Locations',         d:'Nine offices, marinas and boatyards coast to coast',   u:SITE+'jby-locations/',           i:'ti-map-2',       k:'locations offices marinas boatyards where find us map'},
    {t:'Events & Experiences',  d:'Boat shows, open houses and private sea trials',       u:SITE+'jby-events/',              i:'ti-calendar',    k:'events boat show open house sea trial calendar experiences'},
    {t:'News & Media',          d:'Stories, videos and owner guides',                     u:SITE+'jby-news-media/',          i:'ti-news',        k:'news media press blog articles videos guides stories'},
    {t:'Contact Us',            d:'Talk to a specialist, request a valuation',            u:SITE+'jby-contact/',             i:'ti-mail',        k:'contact email phone reach enquiry inquiry get in touch expert'}
  ];

  var SERVICES = [
    {t:'All Services', img:'./JBY-V3.3-assets/clean_bento_sm.jpg',          d:'Every way we support you, from purchase to resale',    u:SITE+'jby-all-services/',        i:'ti-layout-grid', k:'services support overview all everything'},
    {t:'Service & Maintenance', img:'./JBY-V3.3-assets/service_maintenance.jpg', d:'Refit, repair and rigging at our own boatyard',        u:SITE+'jby-service-maintenance/', i:'ti-tool',        k:'service maintenance repair refit rigging haul out boatyard mechanic engine warranty'},
    {t:'Yacht Management', img:'./JBY-V3.3-assets/service_yacht_management.jpg',      d:'The art of effortless ownership',                      u:SITE+'jby-yacht-management/',    i:'ti-clipboard-check', k:'management managed care crew captain ownership program'},
    {t:'Sell Your Yacht', img:'./JBY-V3.3-assets/clean_bento_sell.jpg',       d:'Valuation, marketing and a global buyer network',      u:SITE+'jby-sell-your-yacht/',     i:'ti-tag',         k:'sell selling listing broker brokerage valuation appraisal value trade consign'},
    {t:'Co-ownership', img:'./JBY-V3.3-assets/bento_coownership_riva.png',          d:'Share the ownership, keep the experience',             u:SITE+'jby-all-services/',        i:'ti-users-group', k:'co-ownership shared fractional partnership syndicate'},
    {t:'Financing', img:'./JBY-V3.3-assets/clean_bento_financing.jpg',             d:'Marine lending through trusted partners',              u:SITE+'jby-all-services/',        i:'ti-credit-card', k:'financing finance loan lending payment credit mortgage'},
    {t:'Insurance', img:'./JBY-V3.3-assets/bento_insurance_riva.png',             d:'Cover arranged for the way you actually cruise',       u:SITE+'jby-all-services/',        i:'ti-shield-check', k:'insurance cover policy underwriting claim protect'}
  ];

  var BRANDS = [
    {t:'Riva',           d:'Where the history of yachting lives', img:'./JBY-V3.3-assets/brand_riva.webp', logo:'./JBY-V3.3-assets/riva_real_dark.png',      u:SITE+'model-page/',  k:'riva italian classic dolcevita 112 aquariva'},
    {t:'Axopar',         d:'Built for adventure on every coast', img:'./JBY-V3.3-assets/brand_axopar.jpeg', logo:'./JBY-V3.3-assets/brand_axopar_raw_dark.png',       u:SITE+'jby-axopar/',  k:'axopar 25 28 29 37 45 ccx xc cross cabin adventure scandinavian'},
    {t:'Brabus',         d:'Performance, engineered on the water', img:'./JBY-V3.3-assets/brand_brabus.webp', logo:'./JBY-V3.3-assets/brand_brabus_raw_dark.png',     u:SITE+'jby-axopar/',  k:'brabus shadow 500 700 900 performance german'},
    {t:'Pershing',       d:'Italian speed, unmistakable presence', img:'./JBY-V3.3-assets/brand_pershing.jpg', logo:'./JBY-V3.3-assets/brand_pershing_raw_dark.png',     u:SITE+'model-page/',  k:'pershing 5x 6x 7x gt55 sport yacht italian speed'},
    {t:'Wally',          d:'Form follows the horizon', img:'./JBY-V3.3-assets/brand_wally.jpg', logo:'./JBY-V3.3-assets/brand_wally_logo_dark.svg',                 u:SITE+'model-page/',  k:'wally wallytender wallypower design italian'},
    {t:'Sirena Yachts',  d:'Refined long-range cruising', img:'./JBY-V3.3-assets/brand_sirena.jpeg', logo:'./JBY-V3.3-assets/brand_sirena_logo_dark.svg',              u:SITE+'model-page/',  k:'sirena 58 68 88 long range trawler cruising'},
    {t:'Everglades',     d:'Offshore capability, built to last', img:'./JBY-V3.3-assets/brand_everglades.jpg', logo:'./JBY-V3.3-assets/brand_everglades_logo_dark.png',       u:SITE+'model-page/',  k:'everglades offshore fishing center console sportfish'}
  ];

  // Lifted from the live News & Media page. Re-scrape from there when the
  // hub gains new pieces; the per-article URLs are still the shared stub.
  var ARTICLES = [
    {t:"Riva Names Jeff Brown Yachts Exclusive West Coast Dealer", cat:"Brands", d:"Sep 16, 2024  \u00b7  3 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/ev_riva.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"Jeff Brown Yachts Opens a New Office in Charleston", cat:"Company", d:"Oct 1, 2024  \u00b7  2 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/marina-newport.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"Showcasing the BRABUS Shadow 500 on the West Coast", cat:"Brands", d:"Jun 29, 2024  \u00b7  3 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/vessel-brabus.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"Deniz Ozcakir Named Head of Sales & Marketing", cat:"Company", d:"Apr 7, 2025  \u00b7  2 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/consult-overlook.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"Join Us at the Newport Beach International Boat Show", cat:"Boat Shows", d:"Sep 12, 2024  \u00b7  2 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/vessel-pershing.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"Jeff Brown: Modern Luxury \"Power Players\" Spotlight", cat:"Press", d:"May 27, 2022  \u00b7  4 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/lifestyle-expertise.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"Jeff Brown at the Fort Lauderdale International Boat Show", cat:"Boat Shows", d:"Oct 25, 2023  \u00b7  2 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/event_flibs.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"},
    {t:"New Owner for the Swan 60 \"THOR\"", cat:"Brands", d:"Nov 30, 2023  \u00b7  3 min read", img:"https://ywteamyw.github.io/jby-news-media/assets/img/vessel-pershing2.jpg", u:"https://ywteamyw.github.io/jby-news-media/article.html"}
  ];

  // Vessels with their own detail page. The home page carousel only carries
  // four boats, so these would otherwise be invisible to search.
  var LISTINGS = [
    {t:'2023 Riva 110\u2019 \u201cDolcevita\u201d', brand:'Riva',
     price:'$2,500,000 \u2013 $6,000,000', loc:'San Diego, CA',
     u:SITE+'jby-listing/', img:SITE+'jby-listing/assets/yacht_aerial_dock.jpg'},
    {t:'Riva 112 Dolcevita Super', brand:'Riva',
     price:'Price on request', loc:'',
     u:SITE+'model-page/', img:SITE+'model-page/assets/hero-poster.jpg'}
  ];

  var TEAM_PAGE = SITE+'jby-team/';
  var TEAM_IMG  = SITE+'jby-team/assets/';      // where the headshots live
  var TEAM_OWN_PAGE = {'Will De Jong': SITE+'jby-team-member/'};
  var TEAM = [
    {n:"Jeff Brown", r:"Owner", o:"San Diego", img:"r_jeff_brown.jpg"},
    {n:"Karen Brown", r:"Cruise Director", o:"San Diego", img:"r_karen_brown.jpg"},
    {n:"Adam Aronson", r:"Accounting Manager", o:"San Diego", img:"r_adam_aronson.jpg"},
    {n:"Robin Briscoe", r:"Bookkeeper", o:"San Diego", img:"r_robin_briscoe.jpg"},
    {n:"Justin Puccio", r:"Accounting Analyst", o:"San Diego", img:"r_justin_puccio.jpg"},
    {n:"Audrey Benner", r:"Office Manager", o:"San Diego", img:"r_audrey_benner.jpg"},
    {n:"Rachelle Deal", r:"Personal Assistant", o:"San Diego", img:"r_rachelle_deal.jpg"},
    {n:"Melina Monninger", r:"Marketing Manager", o:"San Diego", img:"r_melina_monninger.jpg"},
    {n:"Alessandro Carboni", r:"Marketing Intern", o:"San Diego", img:"r_alessandro_carboni.jpg"},
    {n:"Wayne Racuya", r:"Sales Professional", o:"San Diego", img:"r_wayne_racuya.jpg"},
    {n:"Ryan Anderson", r:"Sales Professional", o:"San Diego", img:"r_ryan_anderson.jpg"},
    {n:"Colton Dykes", r:"Sales Professional", o:"San Diego", img:"r_colton_dykes.jpg"},
    {n:"Lola Brown", r:"Chief Happiness Officer", o:"San Diego", img:"r_lola_brown.jpg"},
    {n:"Chris Thompson", r:"Service Manager", o:"San Diego Marina & Boatyard", img:"r_chris_thompson.jpg"},
    {n:"Annie Snyder", r:"Lead Service Technician", o:"San Diego Marina & Boatyard", img:"r_annie_snyder.jpg"},
    {n:"Ryan Heffernan-Anderson", r:"Service Technician", o:"San Diego Marina & Boatyard", img:"r_ryan_heffernan.jpg"},
    {n:"Hailey Jones", r:"Service Technician", o:"San Diego Marina & Boatyard", img:"r_hailey_jones.jpg"},
    {n:"Brock Passarella", r:"Service Coordinator", o:"San Diego Marina & Boatyard", img:"r_brock_passarella.jpg"},
    {n:"Esmeralda Rivera", r:"Chief Detailing Specialist", o:"San Diego Marina & Boatyard", img:"r_esmeralda_rivera.jpg"},
    {n:"Gabriela Pacheco", r:"Detailing Specialist", o:"San Diego Marina & Boatyard", img:"r_gabriela_pacheco.jpg"},
    {n:"Brad Butler", r:"In Memoriam", o:"San Diego Marina & Boatyard", img:"r_brad_butler.jpg"},
    {n:"Allen Jones", r:"Sales Professional &amp; Mari-Time Manager", o:"Newport Harbor", img:"r_allen_jones.jpg"},
    {n:"Will De Jong", r:"Sales Professional", o:"Newport Harbor", img:"r_will_de_jong.jpg"},
    {n:"Sailor Slonaker", r:"Administrative Assistant", o:"Newport Harbor", img:"r_sailor_slonaker.jpg"},
    {n:"Jim Ewing", r:"Sales Professional", o:"Marina del Rey", img:"r_jim_ewing.jpg"},
    {n:"Pete McCormick", r:"Sales Professional", o:"Sausalito", img:"r_pete_mccormick.jpg"},
    {n:"Max Haning", r:"Sales Professional", o:"Sausalito", img:"r_max_haning.jpg"},
    {n:"Nico Colomb", r:"Service Manager", o:"Sausalito", img:"r_nico_colomb.jpg"},
    {n:"Jacques Guegau", r:"Service Operations Coordinator", o:"Sausalito", img:"r_jacques_guegau.jpg"},
    {n:"Tommy Casias", r:"Sales Manager", o:"Seattle", img:"r_tommy_casias.jpg"},
    {n:"Darik Swenson", r:"Service Technician", o:"Seattle", img:"r_darik_swenson.jpg"},
    {n:"Andy Witherspoon", r:"Sales Professional", o:"Kona", img:"r_andy_witherspoon.jpg"},
    {n:"Konner Brown", r:"Sales Professional", o:"Wrightsville Beach", img:"r_konner_brown.jpg"},
    {n:"Matt Owens", r:"Sales Professional", o:"Wrightsville Beach", img:"r_matt_owens.jpg"},
    {n:"Paul Fecteau", r:"National Service Manager", o:"Wrightsville Beach", img:"r_paul_fecteau.jpg"},
    {n:"Matt Burtzel", r:"Detail Specialist/Yard Technician", o:"Wrightsville Beach", img:"r_matt_burtzel.jpg"},
    {n:"Nate Evans", r:"Sales Professional", o:"Charleston", img:"r_nate_evans.jpg"}
  ];

  var SECTIONS = [
    {id:'story',   t:'Bespoke yacht sales and brokerage', k:'intro story about what we do'},
    {id:'yachts',  t:'The builders we represent',         k:'brands builders manufacturers portfolio yachts vessels inventory'},
    {id:'events',  t:'Upcoming events & private experiences', k:'events calendar boat show'},
    {id:'craft',   t:'How we work',                       k:'craft process approach how we work'},
    {id:'voices',  t:'Client stories',                    k:'testimonials reviews clients voices owners stories'},
    {id:'services',t:'Support for every stage',           k:'services aftercare support ownership'},
    {id:'visit',   t:'Visit us',                          k:'locations offices visit marina boatyard map'},
    {id:'contact', t:'Contact an expert',                 k:'contact expert talk enquiry'}
  ];

  /* ---------- 2. HARVEST FROM THIS PAGE'S DOM -------------------------- */

  function txt(el,sel){ var n=el.querySelector(sel); return n ? n.textContent.trim().replace(/\s+/g,' ') : ''; }
  function bgUrl(el,sel){
    var n = sel ? el.querySelector(sel) : el; if(!n) return '';
    var m = /url\((['"]?)(.*?)\1\)/.exec(n.style.backgroundImage||''); return m ? m[2] : '';
  }

  // Which builder does a card belong to? Vessels carry a brand logo whose
  // filename names it; events only say it in the title.
  function brandOf(text, logoSrc){
    var hay = ((logoSrc||'') + ' ' + (text||'')).toLowerCase();
    for (var i=0;i<BRANDS.length;i++){
      var slug = BRANDS[i].t.toLowerCase().split(' ')[0];
      if (hay.indexOf(slug) > -1) return BRANDS[i].t;
    }
    return '';
  }

  function harvest(doc){
    doc = doc || document;
    var out = [];

    // Vessels — the "Our vessels" carousel
    doc.querySelectorAll('.vessel-card').forEach(function(c){
      var name = txt(c,'.name'); if(!name) return;
      var price = txt(c,'.price'), loc = txt(c,'.chip-loc');
      var logo = c.querySelector('.brand img');
      out.push({kind:'yacht', t:name, price:price, html:c.outerHTML,
        d:[price,loc].filter(Boolean).join('  \u00b7  '),
        img:bgUrl(c,'.v-img'), brand:brandOf(name, logo && logo.getAttribute('src')),
        u:'#yachts', k:name+' '+loc+' yacht vessel for sale inventory boat'});
    });

    // Events — the "Upcoming events" strip
    doc.querySelectorAll('.event-card').forEach(function(c){
      var name = txt(c,'h4'); if(!name) return;
      var rows = c.querySelectorAll('.body .row'), loc='', date='';
      rows.forEach(function(r){
        var l = txt(r,'.l').toLowerCase(), v = txt(r,'.r');
        if(l.indexOf('location')>-1) loc=v; else if(l.indexOf('date')>-1) date=v;
      });
      out.push({kind:'event', t:name, html:c.outerHTML,
        d:[date,loc].filter(Boolean).join('  \u00b7  '),
        img:bgUrl(c,'.img'), brand:brandOf(name, ''),
        u:'#events', k:name+' '+loc+' '+date+' event boat show open house'});
    });

    // Offices — the "Visit us" list carries everything in data attributes
    doc.querySelectorAll('.visit-item').forEach(function(c){
      var name = txt(c,'h5'); if(!name) return;
      var city = c.getAttribute('data-city')||'', type = c.getAttribute('data-type')||'',
          svc  = (c.getAttribute('data-services')||'').replace(/,/g,' '),
          addr = c.getAttribute('data-address')||'', ph = c.getAttribute('data-phone')||'';
      var photo = c.getAttribute('data-photo') || '';
      out.push({kind:'location', t:name,
        d:[type.toLowerCase().replace(/^./,function(x){return x.toUpperCase();}), city, ph].filter(Boolean).join('  \u00b7  '),
        img: photo ? './JBY-V3.3-assets/'+photo : '', u:SITE+'jby-locations/',
        k:name+' '+city+' '+type+' '+svc+' '+addr+' office location marina boatyard'});
    });

    return out;
  }

  /* ---------- 3. BUILD THE INDEX --------------------------------------- */

  var INDEX = null;

  function buildIndex(doc){
    var ix = [];
    BRANDS.forEach(function(b){ ix.push({kind:'brand', t:b.t, d:b.d, u:b.u, img:b.img, logo:b.logo, brand:b.t, k:b.k}); });
    SERVICES.forEach(function(s){ ix.push({kind:'service', t:s.t, d:s.d, u:s.u, img:s.img, k:s.k}); });
    TEAM.forEach(function(p){
      ix.push({kind:'team', t:p.n, d:p.r+'  \u00b7  '+p.o, img:p.img ? TEAM_IMG+p.img : '',
        u:TEAM_OWN_PAGE[p.n]||TEAM_PAGE, k:p.n+' '+p.r+' '+p.o+' team broker sales professional'});
    });
    LISTINGS.forEach(function(v){
      ix.push({kind:'yacht', t:v.t, price:v.price, brand:v.brand, img:v.img, u:v.u,
        d:[v.price,v.loc].filter(Boolean).join('  \u00b7  '),
        k:v.t+' '+v.brand+' '+v.loc+' yacht vessel for sale listing boat'});
    });
    ARTICLES.forEach(function(a){
      var bits = (a.d||'').split('\u00b7').map(function(x){ return x.trim(); });
      ix.push({kind:'article', t:a.t, d:a.d, cat:a.cat,
        date:bits[0]||'', read:bits[1]||'', excerpt:a.excerpt||'',
        u:a.u, img:a.img, brand:brandOf(a.t,''),
        k:a.t+' '+a.cat+' article news story press read'});
    });
    PAGES.forEach(function(p){ ix.push({kind:'page', t:p.t, d:p.d, u:p.u, icon:p.i, k:p.k}); });
    ix = ix.concat(harvest(doc));
    ix.forEach(function(it){
      it.hay = (it.t+' '+(it.d||'')+' '+(it.k||'')).toLowerCase()
                 .replace(/[\u2018\u2019\u201c\u201d]/g,"'").replace(/&amp;/g,'&');
    });
    return ix;
  }

  /* ---------- 4. MATCHING ---------------------------------------------- */

  var GROUPS = [
    {kind:'yacht',    label:'Yachts'},
    {kind:'brand',    label:'Brands'},
    {kind:'service',  label:'Services'},
    {kind:'event',    label:'Events'},
    {kind:'article',  label:'Articles'},
    {kind:'location', label:'Locations'},
    {kind:'team',     label:'Team'},
    {kind:'page',     label:'Pages'},
    {kind:'section',  label:'On this page'}
  ];
  // Events outrank articles: they carry a date and stop being useful once it
// passes, so they deserve the higher slot when scores are level.
  var KIND_WEIGHT = {yacht:6, brand:6, event:5, service:5, article:4, location:4, page:4, team:3, section:1};

  function norm(s){
    return (s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d]/g,"'")
      .replace(/[^a-z0-9'&\s-]/g,' ').replace(/\s+/g,' ').trim();
  }

  // Filler words people type but we never index ("sell MY yacht", "boats FOR sale")
  var STOP = {'a':1,'an':1,'the':1,'my':1,'our':1,'your':1,'his':1,'her':1,'their':1,'its':1,
              'me':1,'i':1,'we':1,'us':1,'you':1,'of':1,'for':1,'to':1,'in':1,'on':1,'at':1,
              'and':1,'or':1,'is':1,'are':1,'was':1,'be':1,'been':1,'do':1,'does':1,'did':1,
              'can':1,'could':1,'will':1,'would':1,'should':1,'with':1,'near':1,'about':1,
              'where':1,'what':1,'when':1,'who':1,'how':1,'why':1,'which':1,
              'find':1,'show':1,'looking':1,'want':1,'need':1,'get':1,'please':1};

  function terms(query){
    var all = norm(query).split(' ').filter(Boolean);
    var kept = all.filter(function(t){ return !STOP[t]; });
    return kept.length ? kept : all;   // an all-stopword query still searches literally
  }

  function score(item, terms){
    var hay = item.hay, title = item.t.toLowerCase(), total = 0;
    for (var i=0;i<terms.length;i++){
      var q = terms[i], s = 0;
      if (title === q)                       s = 120;
      else if (title.indexOf(q) === 0)       s = 90;
      else if (new RegExp('\\b'+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(title)) s = 70;
      else if (title.indexOf(q) > -1)        s = 45;
      else if (new RegExp('\\b'+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(hay)) s = 28;
      // No bare substring match on the keywords — that is what made "riva"
      // hit "private". A word start is required there; titles still allow it
      // so model names like "Aquariva" stay findable.

      // Plural tolerance, but only for actual plurals and only at a word start.
      // Chopping the last letter off any query made "riva" match "Drive" in an
      // office address and "Rivera" in a surname.
      else if (q.length >= 5 && /s$/.test(q) &&
               new RegExp('\\b'+q.slice(0,-1).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(hay)) s = 8;
      if (!s) return 0;                                                   // every term must land
      total += s;
    }
    // If the query IS the thing's name, it leads — otherwise a person or an
    // office loses by a point to an article that merely starts with the name.
    if (title === terms.join(' ')) total += 50;
    return total + (KIND_WEIGHT[item.kind]||0);
  }

  // When the query names a builder, the answer has a natural running order:
  // the brand itself, then its boats, then what is happening, then the
  // reading. Left to raw relevance an event whose title starts with the
  // brand name outranks the listings, which is not what you want.
  var BRAND_LED = {brand:0, yacht:1, event:2, article:3, location:4, team:5, service:6, page:7};

  function matchedBrand(qt){
    var q = qt.join(' ');
    for (var i=0;i<BRANDS.length;i++){
      var t = BRANDS[i].t.toLowerCase();
      if (t === q || t.indexOf(q) === 0 || q.indexOf(t) === 0) return BRANDS[i];
    }
    return null;
  }
  function namesABrand(qt){ return !!matchedBrand(qt); }

  function search(query){
    var qt = terms(query);
    if (!qt.length) return [];

    var hits = [], i, s;
    for (i=0;i<INDEX.length;i++){
      s = score(INDEX[i], qt);
      if (s) hits.push({item:INDEX[i], s:s});
    }

    // Nothing matched every word — fall back to "any word", scaled down so a
    // partial match never outranks a full one had there been any.
    if (!hits.length && qt.length > 1){
      for (i=0;i<INDEX.length;i++){
        var sum = 0, got = 0;
        for (var j=0;j<qt.length;j++){
          var one = score(INDEX[i], [qt[j]]);
          if (one){ sum += one; got++; }
        }
        if (got) hits.push({item:INDEX[i], s:(sum/qt.length) * (got/qt.length)});
      }
    }

    if (namesABrand(qt)){
      hits.sort(function(a,b){
        var ra = BRAND_LED[a.item.kind], rb = BRAND_LED[b.item.kind];
        if (ra !== rb) return ra - rb;
        return b.s - a.s || a.item.t.localeCompare(b.item.t);
      });
    } else {
      hits.sort(function(a,b){ return b.s - a.s || a.item.t.localeCompare(b.item.t); });
    }
    return hits;
  }


  // Everything above is the engine; everything below drives the header panel.
  // The results page reaches the engine through this handle.
  window.JBY_SEARCH = {
    build: buildIndex,
    setIndex: function(ix){ INDEX = ix; },
    search: function(q){ return search(q); },
    terms: terms,
    kinds: function(){ return KIND_WEIGHT; }
  };

  /* ---------- 5. RENDERING --------------------------------------------- */

  var root  = document.getElementById('jbs'),
      input = document.getElementById('jbs-input'),
      drop  = document.getElementById('jbs-drop'),
      closeB= document.getElementById('jbs-close'),
      countE= document.getElementById('jbs-count'),
      openB = document.getElementById('nav-search-btn');
  if (!root || !input || !openB) return;   // no header panel on this page

  // The four shortcuts that sit under the empty field, YachtWay-style
  var QUICK = [
    {t:'Yachts for sale', u:'#yachts'},
    {t:'Our locations',   u:SITE+'jby-locations/'},
    {t:'Knowledge Center',u:SITE+'jby-knowledge-center/'},
    {t:'Contact us',      u:SITE+'jby-contact/'}
  ];
  var RECENT_KEY = 'jby_recent_searches';

  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // The list is already only relevant hits, so matched words are not marked.
  function mark(text){ return esc(text); }

  function getRecent(){
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]').slice(0,6); }
    catch(e){ return []; }
  }
  function pushRecent(q){
    q = (q||'').trim(); if (q.length < 2) return;
    try {
      var r = getRecent().filter(function(x){ return x.toLowerCase() !== q.toLowerCase(); });
      r.unshift(q);
      localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0,6)));
    } catch(e){}
  }
  function dropRecent(q){
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter(function(x){ return x !== q; })));
    } catch(e){}
  }

  function chips(list, removable){
    return '<div class="jbs-chips">' + list.map(function(q){
      return '<button class="jbs-chip" data-q="'+esc(q)+'">' + esc(q) +
             (removable ? '<span class="x" data-drop="'+esc(q)+'" role="button" aria-label="Remove">&times;</span>' : '') +
             '</button>';
    }).join('') + '</div>';
  }

  function quickLinks(){
    return '<section class="jbs-sec"><h2 class="jbs-lbl">Quick links</h2><div class="jbs-quick">' +
      QUICK.map(function(q){
        return '<a href="'+esc(q.u)+'"><span class="t">'+esc(q.t)+'</span>' +
               '<span class="ar"><i class="ti ti-chevron-right"></i></span></a>';
      }).join('') + '</div></section>';
  }

  // Empty field: what you searched before, then somewhere to go. Nothing is
  // invented here — a hand-written "suggested" list would only go stale.
  function renderIdle(){
    var recent = getRecent();
    var html = '';
    if (recent.length){
      html += '<section class="jbs-sec"><h2 class="jbs-lbl">Recent searches</h2>' +
              chips(recent, true) + '</section>';
    }
    html += quickLinks();
    drop.innerHTML = html;
    countE.textContent = '';
    rows = []; sel = -1;
  }

  // What lands in the main list, and what drops to the links underneath.
  var LIST_KINDS = {yacht:1, brand:1, article:1, event:1, location:1, team:1, service:1, page:1};
  var TYPE_LABEL = {yacht:'Yachts for sale', brand:'Brand', article:'Article', event:'Event',
                    location:'Location', team:'Team member', page:'Page', service:'Service'};

  var picked = [];                       // brands the user has toggled on

  function isPicked(n){ return picked.indexOf(n) > -1; }
  // One builder at a time — nobody shops Axopar and Brabus in the same breath.
  function togglePick(n){
    picked = isPicked(n) ? [] : [n];
    render();
  }

  // Every row reads the same way: the thing, then plainly what it is, so it
  // is always clear where the click goes.
  function subLine(it){ return TYPE_LABEL[it.kind] || ''; }

  function resultRow(it, qt){
    var pic   = it.logo || it.img;
    // Always render the column so titles line up; without a picture it is
    // just empty space, not an empty box.
    var thumb = pic
      ? '<span class="thumb'+(it.logo ? ' logo' : '')+'" style="background-image:url(\''+esc(pic)+'\')"></span>'
      : '<span class="thumb"></span>';
    var sub   = subLine(it);
    var isBrand = it.kind === 'brand';
    var on      = isBrand && isPicked(it.t);

    // A picked builder shows it right on its own row, with the x that drops
    // it, rather than as a chip somewhere else in the panel.
    var tail = on ? '<span class="tail" aria-hidden="true">&times;</span>' : '';

    return '<a class="jbs-res' + (pic ? '' : ' bare') + (on ? ' pick has-tail' : '') + '" ' +
      'href="'+esc(it.u)+'"' + (isBrand ? ' data-pick="'+esc(it.t)+'"' : '') +
      (on ? ' aria-pressed="true"' : '') + '>' + thumb +
      '<span class="txt"><span class="t">'+mark(it.t, qt)+'</span>' +
      (sub ? '<span class="d">'+mark(sub, qt)+'</span>' : '') + '</span>' + tail + '</a>';
  }

  function pinnedRows(qt){
    return picked.map(function(n){
      var it = INDEX.filter(function(x){ return x.kind === 'brand' && x.t === n; })[0];
      return it ? resultRow(it, qt || []) : '';
    }).join('');
  }

  var LIST_CAP = 6, PER_KIND_CAP = 3;


  function renderResults(q){
    var qt   = terms(q);
    var hits;

    if (!qt.length && picked.length){
      // Picked a builder and cleared the box: browse everything of theirs.
      hits = INDEX.filter(function(it){ return it.brand && isPicked(it.brand); })
                  .sort(function(a,b){ return (KIND_WEIGHT[b.kind]||0) - (KIND_WEIGHT[a.kind]||0); })
                  .map(function(it){ return {item:it, s:1}; });
    } else {
      hits = search(q);
      // A picked builder narrows everything that belongs to one. Brand rows
      // stay so a second can be added or the first dropped.
      if (picked.length){
        hits = hits.filter(function(h){
          return h.item.kind === 'brand' || (h.item.brand && isPicked(h.item.brand));
        });
      }
    }

    if (!hits.length){
      drop.innerHTML =
        pinnedRows(qt) +
        '<div class="jbs-none"><h3>' +
        (q.trim() ? 'No matches for &ldquo;'+esc(q)+'&rdquo;' : 'Nothing to show yet') + '</h3>' +
        '<p>Try a builder, a model, a city or a service.</p></div>' +
        quickLinks();
      countE.textContent = 'No results';
      rows = []; sel = -1;
      return;
    }

    var list  = hits.filter(function(h){ return LIST_KINDS[h.item.kind]; });

    // Picked builders ride at the top of the list wherever the query goes, so
    // the choice stays visible and one click undoes it.
    var pins = picked.map(function(n){
      return INDEX.filter(function(it){ return it.kind === 'brand' && it.t === n; })[0];
    }).filter(Boolean);
    // Cap any one kind so a broad word like "service" cannot fill the list
    // with eight offices and bury everything else.
    var perKind = {};
    list = list.filter(function(h){
      if (picked.indexOf(h.item.t) > -1) return false;
      var n = (perKind[h.item.kind] = (perKind[h.item.kind] || 0) + 1);
      return n <= PER_KIND_CAP;
    }).slice(0, LIST_CAP);

    var html = pins.map(function(it){ return resultRow(it, qt); }).join('') +
      list.map(function(h){ return resultRow(h.item, qt); }).join('');

    html += '<button class="jbs-seeall" data-seeall>See all results' +
            '<i class="ti ti-chevron-right"></i></button>';

    drop.innerHTML = html;
    countE.textContent = hits.length + (hits.length === 1 ? ' result' : ' results');
    drop.scrollTop = 0;
    rows = Array.prototype.slice.call(drop.querySelectorAll('.jbs-res'));
    sel = -1;              // nothing preselected: Enter goes to the full results
  }

  function render(){
    var q = input.value;
    if (!q.trim() && !picked.length) renderIdle();
    else renderResults(q);
  }

  /* ---------- 6. KEYBOARD SELECTION ------------------------------------ */

  var rows = [], sel = -1;

  function setSel(i, noScroll){
    if (!rows.length) return;
    if (sel > -1 && rows[sel]) rows[sel].classList.remove('sel');
    sel = (i + rows.length) % rows.length;
    var r = rows[sel];
    r.classList.add('sel');
    if (noScroll) return;                 // the first row is pre-selected, not scrolled to
    var rb = r.getBoundingClientRect(), db = drop.getBoundingClientRect();
    if (rb.top < db.top + 8)        drop.scrollTop += rb.top - db.top - 8;
    else if (rb.bottom > db.bottom) drop.scrollTop += rb.bottom - db.bottom + 8;
  }

  /* ---------- 7. OPEN / CLOSE / QUERY ---------------------------------- */

  var lastFocus = null, debounce = null;

  function isOpen(){ return root.classList.contains('open'); }

  function open(seed){
    if (isOpen()) { input.focus(); return; }
    if (!INDEX) INDEX = buildIndex();
    lastFocus = document.activeElement;
    root.hidden = false;
    // Start at the icon's own distance from the top of the page. Measured
    // live rather than fixed, because the nav shrinks once the page scrolls.
    root.style.setProperty('--jbs-top', openB.getBoundingClientRect().top+'px');
    void root.offsetHeight;               // force a reflow so the bar animates
    root.classList.add('open');
    document.body.classList.add('jbs-lock');
    document.getElementById('site-nav').classList.add('jbs-away');
    picked = [];
    input.value = seed || '';
    render();
    syncCloseLabel();
    setTimeout(function(){ input.focus(); input.select(); }, 60);
  }

  function close(){
    if (!isOpen()) return;
    pushRecent(input.value);               // a query worth typing is worth remembering
    root.classList.remove('open');
    document.body.classList.remove('jbs-lock');
    document.getElementById('site-nav').classList.remove('jbs-away');
    setTimeout(function(){ if (!isOpen()) root.hidden = true; }, 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function run(){ render(); }

  // The full results live on their own page, not inside this panel.
  function goResultsPage(){
    pushRecent(input.value);
    var qs = 'q=' + encodeURIComponent(input.value.trim());
    if (picked.length) qs += '&brand=' + encodeURIComponent(picked[0]);
    window.location.href = './search.html?' + qs;
  }

  function go(a){
    if (a.hasAttribute('data-pick')){ togglePick(a.getAttribute('data-pick')); return; }
    var href = a.getAttribute('href');
    pushRecent(input.value);
    if (href.charAt(0) === '#'){
      close();
      var target = document.querySelector(href);
      if (target) setTimeout(function(){
        // same offset + motion rule the section-index nav uses, so the fixed
        // header never covers the section title
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({top: top, behavior: reduce ? 'auto' : 'smooth'});
      }, 300);
    } else {
      window.location.href = href;
    }
  }

  /* ---------- 8. WIRING -------------------------------------------------- */

  openB.addEventListener('click', function(e){ e.preventDefault(); open(''); });

  // The x empties the field first; only on an already-empty field does it
  // close the panel.
  closeB.addEventListener('click', function(){
    if (input.value || picked.length){
      input.value = '';
      picked = [];
      render();
      input.focus();
      syncCloseLabel();
    } else {
      close();
    }
  });

  function syncCloseLabel(){
    var clearing = !!(input.value || picked.length);
    closeB.setAttribute('aria-label', clearing ? 'Clear search' : 'Close search');
  }
  root.querySelector('[data-jbs-close]').addEventListener('click', close);

  input.addEventListener('input', function(){
    syncCloseLabel();
    clearTimeout(debounce);
    debounce = setTimeout(run, 90);
  });

  input.addEventListener('keydown', function(e){
    if (e.key === 'ArrowDown'){ e.preventDefault(); setSel(sel + 1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); setSel(sel - 1); }
    else if (e.key === 'Enter'){
      e.preventDefault();
      if (sel > -1 && rows[sel]) go(rows[sel]);          // a row was arrowed to
      else if (input.value.trim() || picked.length) goResultsPage();
    }
  });

  drop.addEventListener('click', function(e){
    var d = e.target.closest('[data-drop]');
    if (d){ e.preventDefault(); e.stopPropagation(); dropRecent(d.getAttribute('data-drop')); renderIdle(); return; }

    if (e.target.closest('[data-seeall]')){ e.preventDefault(); goResultsPage(); return; }
    if (e.target.closest('[data-clear]')){ e.preventDefault(); picked = []; render(); return; }

    var pk = e.target.closest('[data-pick]');
    if (pk){ e.preventDefault(); togglePick(pk.getAttribute('data-pick')); return; }

    var c = e.target.closest('[data-q]');
    if (c){ e.preventDefault(); input.value = c.getAttribute('data-q'); run(); input.focus(); return; }

    var r = e.target.closest('.jbs-res, .jbs-quick a');
    if (r){ e.preventDefault(); go(r); }
  });

  drop.addEventListener('mousemove', function(e){
    var r = e.target.closest('.jbs-res');
    if (r){ var i = rows.indexOf(r); if (i > -1 && i !== sel) setSel(i, true); }
  });

  // Global shortcuts: Cmd/Ctrl+K or "/" to open, Esc to close
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && isOpen()){ e.preventDefault(); close(); return; }
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')){
      e.preventDefault(); if (isOpen()) close(); else open(''); return;
    }
    if (e.key === '/' && !isOpen() && !e.metaKey && !e.ctrlKey && !e.altKey){
      var t = e.target, tag = (t.tagName||'').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable) return;
      e.preventDefault(); open('');
    }
  });

  // Keep focus inside the panel while it is open
  root.addEventListener('keydown', function(e){
    if (e.key !== 'Tab') return;
    var f = root.querySelectorAll('input, button, a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });

  // Deep link: ?q=axopar or #search opens the panel pre-filled. Not on the
  // results page — there the query already is the page.
  (function(){
    if (document.getElementById('sr-body')) return;
    var qs = new URLSearchParams(location.search).get('q');
    if (qs) setTimeout(function(){ open(qs); }, 400);
    else if (location.hash === '#search') setTimeout(function(){ open(''); }, 400);
  })();

})();
