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
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
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
        '<a class="icon" href="index.html#news" aria-label="Search news">'+I.search+'</a>'+
        '<a class="cta" href="https://www.jeffbrownyachts.com" target="_blank" rel="noopener">Contact an expert</a>'+
      '</div>'+
    '</nav>';
  }

  /* ---------- KC sub-navigation ---------- */
  function kcnavHTML(){
    var cur = document.body.dataset.kc || "";
    var items = [
      ["all","All"],["news","News"],["videos","Videos"],["events","Events"]
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
      ["News & Media","index.html"],
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
      '<p class="reveal d1">Our specialists are here to help you choose, finance, and care for the right yacht. Reach out and a Jeff Brown Yachts expert will get back to you within one business day.</p>'+
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
            '<a href="index.html#all">News &amp; Media</a><span class="sep">/</span>'+
            '<a href="index.html#news">News</a><span class="sep">/</span>'+
            '<a href="index.html#videos">Videos</a><span class="sep">/</span>'+
            '<a href="index.html#events">Events</a><span class="sep">/</span>'+
            '<a href="https://www.jeffbrownyachts.com">Boats for Sale</a><span class="sep">/</span>'+
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
    /* intercept any element carrying data-tab (nav tabs + "All … ->" links) */
    document.addEventListener("click", function(e){
      var el = e.target.closest && e.target.closest("[data-tab]");
      if(!el || !el.dataset.tab) return;
      e.preventDefault();
      var name = show(el.dataset.tab);
      if(history.replaceState) history.replaceState(null,"","#"+name);
    });
    window.addEventListener("hashchange", function(){ show((location.hash||"").replace("#","")||"all"); });
    show((location.hash||"").replace("#","")||"all");
  })();

  /* ---------- Demo search (no backend) — jump to the News tab ---------- */
  document.querySelectorAll("form[data-search]").forEach(function(f){
    f.addEventListener("submit", function(e){ e.preventDefault();
      var t=document.querySelector('.kcnav a[data-tab="news"]');
      if(t){ t.click(); } else { window.location.href="index.html#news"; }
    });
  });
})();
