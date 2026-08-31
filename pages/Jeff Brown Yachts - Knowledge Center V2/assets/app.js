/* =====================================================================
   Jeff Brown Yachts — Knowledge Center — shared behavior + chrome
   Header, KC sub-nav, slide-in menu and footer are injected here so
   every page shares one source of truth. Set on <body>:
     data-kc="home|news|videos|events"  (active nav item)
     data-hero="1"   -> transparent header over a hero (home + detail)
   ===================================================================== */
(function(){
  "use strict";
  var LOGO = "assets/jby_logo.svg";

  /* ---------- Icons ---------- */
  var I = {
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 6 6 6-6 6"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m18 15-6-6-6 6"/></svg>'
  };

  /* ---------- Header ---------- */
  function headerHTML(){
    var solid = document.body.dataset.hero ? "" : " solid";
    return ''+
    '<nav class="nav'+solid+'" id="site-nav" aria-label="Primary">'+
      '<div class="left"><button class="burger" id="burger" aria-label="Open menu"><span></span><span></span><span></span></button></div>'+
      '<a class="logo" href="index.html" aria-label="Jeff Brown Yachts — Knowledge Center"><img src="'+LOGO+'" alt="Jeff Brown Yachts"/></a>'+
      '<div class="right">'+
        '<a class="icon" href="search.html" aria-label="Search the Knowledge Center">'+I.search+'</a>'+
        '<a class="cta" href="https://www.jeffbrownyachts.com" target="_blank" rel="noopener">Contact an expert</a>'+
      '</div>'+
    '</nav>';
  }

  /* ---------- KC sub-navigation ---------- */
  function kcnavHTML(){
    var cur = document.body.dataset.kc || "";
    var items = [
      ["all","All"],["videos","Videos"],["events","Past Events"],["insights","Insights & News"]
    ];
    var links = items.map(function(it){
      return '<a href="index.html#'+it[0]+'" data-tab="'+it[0]+'"'+(cur===it[0]?' class="active"':'')+'>'+it[1]+'</a>';
    }).join("");
    return '<div class="kcnav"><div class="kcnav-inner">'+links+'</div></div>';
  }

  /* ---------- Slide-in menu ---------- */
  function menuHTML(){
    var main = [
      ["Boats for Sale","https://www.jeffbrownyachts.com"],
      ["Brands","https://www.jeffbrownyachts.com"],
      ["Services","https://www.jeffbrownyachts.com"],
      ["Knowledge Center","index.html"],
      ["Events","https://www.jeffbrownyachts.com"],
      ["About JBY","https://www.jeffbrownyachts.com"],
      ["Contact","https://www.jeffbrownyachts.com"]
    ];
    var links = main.map(function(m){return '<a href="'+m[1]+'">'+m[0]+'</a>';}).join("");
    return ''+
    '<div class="menu-scrim" id="menuScrim"></div>'+
    '<aside class="menu-panel" id="menuPanel" aria-label="Site menu" aria-hidden="true">'+
      '<div class="m-top">'+
        '<a class="m-logo" href="index.html"><img src="'+LOGO+'" alt="Jeff Brown Yachts"/></a>'+
        '<button class="m-close" id="menuClose" aria-label="Close menu">'+I.close+'</button>'+
      '</div>'+
      '<nav>'+links+'</nav>'+
      '<div class="m-foot">Jeff Brown Yachts<br/>2330 Shelter Island Drive, Suite 105, San Diego, CA 92106<br/><a href="tel:+18886938099">+1 (888) 693-8099</a></div>'+
    '</aside>';
  }

  /* ---------- FAQ (shared) ---------- */
  var FAQS = [
    ["How do I start the yacht-buying process with Jeff Brown Yachts?","Reach out for a no-obligation consultation. A dedicated sales professional learns how you plan to use the yacht, your preferred size and budget, then curates listings and arranges viewings and sea trials, guiding you through offer, survey, closing, and delivery."],
    ["Can Jeff Brown Yachts help me sell my current yacht?","Yes. Our brokerage prepares, prices, and markets your yacht with professional photography, drone footage, MLS and international exposure, and hands-on coordination from listing to closing."],
    ["Do you assist with financing and insurance?","We connect you with trusted marine lenders and insurers and help you understand loan terms, down payments, valuations, and the coverage you actually need for how you cruise."],
    ["What is a sea trial, and do I need a survey?","A sea trial is an on-water test of the yacht's systems and handling. An independent survey documents condition and value. We recommend both for used purchases and coordinate them on your behalf."],
    ["Which yacht brands do you represent?","Jeff Brown Yachts represents premium builders including Riva, Pershing, Wally, Sirena, and Axopar, with new models and quality brokerage listings."],
    ["Do you offer service, maintenance, and yacht management?","Yes. Beyond sales, our team supports refit, warranty, delivery, berthing, crew, and full yacht management so ownership stays effortless."]
  ];
  function faqHTML(){
    var items = FAQS.map(function(f){
      return '<div class="faq-item"><button class="faq-q">'+f[0]+'<span class="ic"></span></button>'+
             '<div class="faq-a"><div class="inner">'+f[1]+'</div></div></div>';
    }).join("");
    return ''+
    '<section class="faq" id="faq"><div class="faq-inner">'+
      '<h2 class="reveal">Frequently asked questions</h2>'+
      '<p class="faq-sub reveal d1">Answers to the questions we hear most from buyers and owners.</p>'+
      '<div class="faq-list reveal d1">'+items+'</div>'+
    '</div></section>';
  }

  /* ---------- Still-have-questions CTA (shared) ---------- */
  function ctaHTML(){
    return ''+
    '<section class="cta-band"><div class="cb-inner">'+
      '<h2 class="reveal">Still have questions?</h2>'+
      '<p class="reveal d1">Our specialists are here to help, from choosing the right yacht to caring for it.</p>'+
      '<div class="actions reveal d1">'+
        '<a class="btn btn-md btn-white" href="https://www.jeffbrownyachts.com" target="_blank" rel="noopener">Contact an expert</a>'+
        '<a class="btn btn-md btn-ghost-light" href="https://www.jeffbrownyachts.com" target="_blank" rel="noopener">Browse boats for sale</a>'+
      '</div>'+
    '</div></section>';
  }

  /* ---------- Footer ---------- */
  function footerHTML(){
    return ''+
    '<footer class="site">'+
      '<div class="foot-grid">'+
        '<div class="reveal">'+
          '<div class="foot-logo"><img src="'+LOGO+'" alt="Jeff Brown Yachts"/></div>'+
          '<nav class="foot-nav">'+
            '<a href="https://www.jeffbrownyachts.com">Home</a><span class="sep">/</span>'+
            '<a href="https://www.jeffbrownyachts.com">Portfolio</a><span class="sep">/</span>'+
            '<a href="https://www.jeffbrownyachts.com">Brands</a><span class="sep">/</span>'+
            '<a href="https://www.jeffbrownyachts.com">Services</a><span class="sep">/</span>'+
            '<a href="https://www.jeffbrownyachts.com">Experiences</a><span class="sep">/</span>'+
            '<a href="https://www.jeffbrownyachts.com">About JBY</a>'+
          '</nav>'+
        '</div>'+
        '<div class="foot-col reveal d1">'+
          '<h6>Contact us</h6><p>+1 (888) 693-8099</p>'+
          '<h6>Email</h6><p>info@jeffbrownyachts.com</p>'+
          '<h6>Social media</h6>'+
          '<div class="foot-social">'+
            '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>'+
            '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"/></svg></a>'+
            '<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2c-.2-1.4-.8-2.1-2.2-2.3C17.9 5.5 12 5.5 12 5.5s-5.9 0-7.8.4C2.8 6.1 2.2 6.8 2 8.2 1.7 10 1.7 12 1.7 12s0 2 .3 3.8c.2 1.4.8 2.1 2.2 2.3 1.9.4 7.8.4 7.8.4s5.9 0 7.8-.4c1.4-.2 2-.9 2.2-2.3.3-1.8.3-3.8.3-3.8s0-2-.3-3.8zM10 15V9l5 3-5 3z"/></svg></a>'+
          '</div>'+
        '</div>'+
        '<div class="foot-col reveal d2">'+
          '<h6>Locations</h6>'+
          '<nav class="foot-locs">'+
            '<a href="#">San Diego</a><a href="#">Newport Harbor</a><a href="#">Marina del Rey</a><a href="#">Sausalito</a>'+
            '<a href="#">Seattle</a><a href="#">Kona</a><a href="#">Wrightsville Beach</a><a href="#">Charleston</a>'+
          '</nav>'+
        '</div>'+
        '<button class="to-top" id="to-top" aria-label="Back to top">'+I.up+'</button>'+
      '</div>'+
    '</footer>';
  }

  /* ---------- Inject chrome ---------- */
  var headEl = document.querySelector("[data-site-header]");
  if(headEl){ headEl.innerHTML = headerHTML() + menuHTML(); }
  var kcEl = document.querySelector("[data-site-kcnav]");
  if(kcEl){ kcEl.outerHTML = kcnavHTML(); }
  var faqEl = document.querySelector("[data-site-faq]");
  if(faqEl){ faqEl.outerHTML = faqHTML(); }
  var ctaEl = document.querySelector("[data-site-cta]");
  if(ctaEl){ ctaEl.outerHTML = ctaHTML(); }
  var footEl = document.querySelector("[data-site-footer]");
  if(footEl){ footEl.innerHTML = footerHTML(); }

  /* ---------- Header scroll state (home only; inner pages are solid) ---------- */
  var hdr = document.getElementById("site-nav");
  if(hdr && document.body.dataset.hero){
    var onScroll = function(){ hdr.classList.toggle("scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  }

  /* ---------- Slide-in menu ---------- */
  (function(){
    var burger = document.getElementById("burger"),
        panel = document.getElementById("menuPanel"),
        scrim = document.getElementById("menuScrim"),
        close = document.getElementById("menuClose");
    if(!burger || !panel) return;
    function open(){ panel.classList.add("open"); scrim.classList.add("open"); panel.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
    function shut(){ panel.classList.remove("open"); scrim.classList.remove("open"); panel.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
    burger.addEventListener("click", open);
    close.addEventListener("click", shut);
    scrim.addEventListener("click", shut);
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") shut(); });
  })();

  /* ---------- FAQ accordion ---------- */
  (function(){
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function(it){
      var q = it.querySelector(".faq-q"), a = it.querySelector(".faq-a");
      if(!q||!a) return;
      q.addEventListener("click", function(){
        var isOpen = it.classList.contains("open");
        items.forEach(function(o){ o.classList.remove("open"); var oa=o.querySelector(".faq-a"); if(oa) oa.style.maxHeight=null; });
        if(!isOpen){ it.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
      });
    });
  })();

  /* ---------- Reveal ---------- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.14});
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  /* ---------- Cascade (cards unveil one by one) ---------- */
  (function(){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var el=en.target, i=parseFloat(el.dataset.lxi)||0;
        el.style.transitionDelay=(i*0.08)+"s"; el.classList.add("lx-in"); obs.unobserve(el);
      });
    }, {threshold:0.1, rootMargin:"0px 0px -6% 0px"});
    function scan(){
      document.querySelectorAll(".casc").forEach(function(parent){
        var n=0;
        [].forEach.call(parent.children, function(k){
          if(k.dataset.lxseen) return; k.dataset.lxseen="1"; k.dataset.lxi=n++; obs.observe(k);
        });
      });
    }
    scan(); setTimeout(scan,300); setTimeout(scan,900);
  })();

  /* ---------- Back to top ---------- */
  document.addEventListener("click", function(e){
    var t = e.target.closest && e.target.closest("#to-top");
    if(t){ window.scrollTo({top:0, behavior:"smooth"}); }
  });

  /* ---------- Hub tab panels — switch in place, no reload, no scroll jump ---------- */
  var hubShow = null;
  (function(){
    var panels = document.querySelectorAll(".hub-panel");
    if(!panels.length) return;               /* only on the hub page (index) */
    var navLinks = document.querySelectorAll(".kcnav a[data-tab]");
    function show(name){
      var ok=false;
      panels.forEach(function(p){var on=(p.id==="panel-"+name);p.classList.toggle("active",on);if(on)ok=true;});
      if(!ok){name="all";panels.forEach(function(p){p.classList.toggle("active",p.id==="panel-all");});}
      navLinks.forEach(function(a){a.classList.toggle("active",a.dataset.tab===name);});
      return name;
    }
    hubShow = show;
    /* intercept any element carrying data-tab (nav tabs + "All … ->" links) */
    document.addEventListener("click", function(e){
      var el = e.target.closest && e.target.closest("[data-tab]");
      if(!el || !el.dataset.tab) return;
      e.preventDefault();
      var name = show(el.dataset.tab);
      if(history.replaceState) history.replaceState(null,"",location.pathname+"#"+name);
    });
    window.addEventListener("hashchange", function(){ show((location.hash||"").replace("#","")||"all"); });
    show((location.hash||"").replace("#","")||"all");
  })();

  /* ---------- Video cards — autoplay preview on hover ---------- */
  function bindHover(root){
    (root || document).querySelectorAll(".vcard").forEach(function(card){
      if(card.dataset.hoverbound) return;
      var v = card.querySelector("video");
      if(!v) return;
      card.dataset.hoverbound = "1";
      card.addEventListener("mouseenter", function(){ try{ v.currentTime=0; var p=v.play(); if(p&&p.catch)p.catch(function(){}); }catch(e){} });
      card.addEventListener("mouseleave", function(){ try{ v.pause(); }catch(e){} });
    });
  }
  bindHover(document);

  /* ---------- Insights & News category filter ---------- */
  document.querySelectorAll("[data-insights-filter]").forEach(function(bar){
    var scope = bar.closest("section") || document;
    var grid = scope.querySelector("[data-insights-grid]");
    if(!grid) return;
    bar.querySelectorAll("[data-cat]").forEach(function(chip){
      chip.addEventListener("click", function(){
        var cat = chip.dataset.cat;
        bar.querySelectorAll("[data-cat]").forEach(function(c){ c.classList.toggle("solid", c===chip); });
        grid.querySelectorAll("[data-cat]").forEach(function(card){
          card.style.display = (cat==="all" || card.dataset.cat===cat) ? "" : "none";
        });
      });
    });
  });

  /* ---------- Archive panels: sidebar filters + working pagination ----------
     One controller per .list-wrap. It tracks the filter state AND the current
     page, then shows only the current page's slice of the filter-matching
     cards. The pager is rebuilt from the real page count and its clicks page
     in place (they never touch the URL hash, so the tab never changes).      */
  var CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m15 6-6 6 6 6"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 6 6 6-6 6"/></svg>';
  document.querySelectorAll(".list-wrap").forEach(function(wrap){
    var grid = wrap.querySelector(".media-grid,.egrid");
    if(!grid) return;
    var pager = wrap.querySelector(".pager");
    var groups = wrap.querySelectorAll(".sub-list[data-filter]");
    var perPage = parseInt(wrap.dataset.perPage, 10) || 6;
    var cards = [].filter.call(grid.children, function(c){
      return c.nodeName === "A" || c.classList.contains("card") || c.classList.contains("ecard");
    });
    var state = {}; groups.forEach(function(g){ state[g.dataset.filter] = "all"; });
    var page = 1;

    function matches(card){
      for(var k in state){ if(state[k] !== "all" && (card.dataset[k] || "") !== state[k]) return false; }
      return true;
    }
    function renderPager(pages){
      if(!pager) return;
      if(pages <= 1){ pager.style.display = "none"; pager.innerHTML = ""; return; }
      pager.style.display = "";
      var nums = "";
      for(var i = 1; i <= pages; i++){
        nums += '<a class="pg-num'+(i===page?' is-current':'')+'" href="#" data-page="'+i+'">'+i+'</a>';
      }
      pager.innerHTML =
        '<a class="pg-prev" href="#" data-page="'+(page-1)+'"'+(page===1?' aria-disabled="true"':'')+'>'+CHEV_L+'<span>Back</span></a>'+
        '<span class="pg-nums">'+nums+'</span>'+
        '<a class="pg-next" href="#" data-page="'+(page+1)+'"'+(page===pages?' aria-disabled="true"':'')+'><span>Next</span>'+CHEV_R+'</a>';
    }
    function apply(){
      var vis = cards.filter(matches);
      var pages = Math.max(1, Math.ceil(vis.length / perPage));
      if(page > pages) page = pages;
      var start = (page - 1) * perPage, end = start + perPage;
      cards.forEach(function(c){ c.style.display = "none"; });
      vis.forEach(function(c, i){ if(i >= start && i < end) c.style.display = ""; });
      renderPager(pages);
    }

    if(pager){
      pager.addEventListener("click", function(e){
        var a = e.target.closest && e.target.closest("[data-page]");
        if(!a) return;
        e.preventDefault();
        if(a.getAttribute("aria-disabled") === "true") return;
        var p = parseInt(a.dataset.page, 10);
        if(isNaN(p) || p < 1) return;
        page = p; apply();
        var top = grid.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: top < 0 ? 0 : top, behavior: "smooth" });
      });
    }
    groups.forEach(function(g){
      var key = g.dataset.filter;
      g.querySelectorAll("a[data-val]").forEach(function(a){
        a.addEventListener("click", function(e){
          e.preventDefault();
          state[key] = a.dataset.val; page = 1;
          g.querySelectorAll("a").forEach(function(x){ x.classList.remove("active"); });
          a.classList.add("active");
          apply();
        });
      });
    });

    apply();
  });

  /* ---------- Lightbox (photo / video viewer) ---------- */
  var openLightbox = (function(){
    var lb = document.getElementById("lightbox");
    if(!lb) return function(){};
    var media = lb.querySelector(".lb-media"), count = lb.querySelector(".lb-count");
    var items = [], idx = 0;
    function render(){
      var it = items[idx]; if(!it) return;
      if(it.type === "video"){
        media.innerHTML = '<div class="lb-frame"><iframe src="https://www.youtube.com/embed/'+it.id+'?rel=0&autoplay=1" title="Jeff Brown Yachts video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
      } else {
        media.innerHTML = '<img src="'+it.src+'" alt="" />';
      }
      if(count) count.textContent = (idx + 1) + " / " + items.length;
    }
    function go(d){ idx = (idx + d + items.length) % items.length; render(); }
    function close(){ lb.classList.remove("open"); lb.setAttribute("aria-hidden","true"); media.innerHTML = ""; document.body.style.overflow = ""; }
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function(){ go(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function(){ go(1); });
    lb.addEventListener("click", function(e){ if(e.target === lb) close(); });
    document.addEventListener("keydown", function(e){
      if(!lb.classList.contains("open")) return;
      if(e.key === "Escape") close();
      else if(e.key === "ArrowLeft") go(-1);
      else if(e.key === "ArrowRight") go(1);
    });
    return function(list, i){ items = list; idx = i || 0; render(); lb.classList.add("open"); lb.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden"; };
  })();

  /* ---------- Gallery (Photos / Videos): thumb switch, arrows, open lightbox ---------- */
  document.querySelectorAll(".evgal").forEach(function(g){
    var hero = g.querySelector(".eg-hero img");
    var heroBox = g.querySelector(".eg-hero");
    var play = g.querySelector(".eg-play");
    var thumbs = [].slice.call(g.querySelectorAll(".eg-thumb"));
    if(!thumbs.length){ return; }
    var cur = 0;
    var items = thumbs.map(function(t){
      var vid = t.getAttribute("data-vid");
      return vid ? {type:"video", id:vid} : {type:"img", src:t.getAttribute("data-full") || (t.querySelector("img")||{}).src};
    });
    function set(i){
      cur = (i + thumbs.length) % thumbs.length;
      var t = thumbs[cur];
      if(hero){ hero.src = t.getAttribute("data-full") || t.querySelector("img").src; }
      thumbs.forEach(function(x,j){ x.classList.toggle("active", j===cur); });
    }
    thumbs.forEach(function(t,i){ t.addEventListener("click", function(){ set(i); }); });
    var p = g.querySelector(".eg-arrow.prev"), n = g.querySelector(".eg-arrow.next");
    if(p){ p.addEventListener("click", function(){ set(cur-1); }); }
    if(n){ n.addEventListener("click", function(){ set(cur+1); }); }
    if(heroBox){ heroBox.addEventListener("click", function(){ openLightbox(items, cur); }); }
    if(play){ play.addEventListener("click", function(e){ e.preventDefault(); openLightbox(items, cur); }); }
  });

  /* ---------- Search forms: never submit an empty query ---------- */
  document.querySelectorAll("form.searchbar").forEach(function(f){
    f.addEventListener("submit", function(e){
      var q = f.querySelector('input[name="query"]');
      if(!q || !q.value.trim()){ e.preventDefault(); if(q) q.focus(); }
    });
  });

  /* ---------- Search page (search.html?query=…) ------------------------------
     A dedicated results page. It fetches the hub and harvests its own cards
     (so the index never drifts from the markup), matches on all query tokens,
     and renders results grouped by type. An empty query shows only a prompt;
     clearing the field (native ✕) removes the results.                        */
  (function(){
    var wrap = document.getElementById("sr-wrap");
    if(!wrap || document.body.dataset.kc !== "search") return;   /* search.html only */

    var SECTIONS = [
      {sel:"#panel-videos .vcard",   label:"Videos",           tab:"videos"},
      {sel:"#panel-events .ecard",   label:"Past Events",      tab:"events"},
      {sel:"#panel-insights .acard", label:"Insights & News",  tab:"insights"}
    ];
    function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
    function cardText(c){
      var d = ""; for(var k in c.dataset){ if(k!=="hoverbound") d += " " + c.dataset[k]; }
      return (c.textContent + " " + (c.getAttribute("href")||"") + d).toLowerCase();
    }
    function param(n){ var m=new RegExp("[?&]"+n+"=([^&]+)").exec(location.search); return m?decodeURIComponent(m[1].replace(/\+/g," ")):""; }

    var inp = document.getElementById("sr-input");
    var cachedDoc = null;

    function showPrompt(){
      wrap.innerHTML = '<div class="sr-empty"><h2>Search the Knowledge Center</h2>'+
        '<p>Search for a brand, model, event, or story to find matching videos, past events, and insights.</p></div>';
    }
    function renderResults(doc, q){
      var tokens = q.toLowerCase().split(/\s+/).filter(Boolean), total = 0, blocks = "";
      SECTIONS.forEach(function(sec){
        var seen = {}, hits = [];
        [].forEach.call(doc.querySelectorAll(sec.sel), function(c){
          var href = c.getAttribute("href") || ""; if(seen[href]) return;
          if(tokens.every(function(t){ return cardText(c).indexOf(t) >= 0; })){ seen[href]=1; hits.push(c); }
        });
        if(!hits.length) return;
        total += hits.length;
        var grid = hits.map(function(c){ return c.outerHTML; }).join("");
        blocks += '<div class="sr-block"><div class="sr-secline">'+
          '<h2>'+sec.label+'<span class="sr-n">('+hits.length+')</span></h2>'+
          '<a class="link-arrow" href="index.html#'+sec.tab+'">See all '+I.arrow+'</a>'+
          '</div><div class="media-grid cols-3">'+grid+'</div></div>';
      });
      var head = '<div class="sr-head"><div class="sr-title">'+
        '<h1>Results for <span>&ldquo;'+esc(q)+'&rdquo;</span></h1></div>'+
        '<p class="sr-count">'+total+' result'+(total===1?"":"s")+'</p></div>';
      wrap.innerHTML = total ? head + blocks
        : head + '<div class="sr-empty"><h2>No results for <span>&ldquo;'+esc(q)+'&rdquo;</span></h2>'+
          '<p>Try a different search, or browse everything in the Knowledge Center.</p>'+
          '<a class="btn btn-md btn-solid" href="index.html#all"><span>Browse all</span></a></div>';
      bindHover(wrap);
    }
    function search(q){
      q = (q||"").trim();
      if(!q){ showPrompt(); document.title = "Search — Jeff Brown Yachts"; return; }
      document.title = "Search: " + q + " — Jeff Brown Yachts";
      if(cachedDoc){ renderResults(cachedDoc, q); return; }
      wrap.innerHTML = '<p class="sr-count">Searching…</p>';
      fetch("index.html").then(function(r){ return r.text(); }).then(function(html){
        cachedDoc = new DOMParser().parseFromString(html, "text/html");
        renderResults(cachedDoc, q);
      }).catch(function(){
        wrap.innerHTML = '<div class="sr-empty"><p>Unable to load results right now.</p>'+
          '<a class="btn btn-md btn-solid" href="index.html#all"><span>Browse the Knowledge Center</span></a></div>';
      });
    }

    var q0 = param("query").trim();
    if(inp) inp.value = q0;
    search(q0);

    /* clearing the field (native X) returns to the Knowledge Center home */
    if(inp){
      inp.addEventListener("search", function(){
        if(!inp.value.trim()){ window.location.href = "index.html"; }
      });
    }
  })();
})();
