/* =====================================================================
   Jeff Brown Yachts — JBY Journal — shared behavior + chrome
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
      '<a class="logo" href="index.html" aria-label="Jeff Brown Yachts — JBY Journal"><img src="'+LOGO+'" alt="Jeff Brown Yachts"/></a>'+
      '<div class="right">'+
        '<a class="icon" href="search.html" aria-label="Search JBY Journal">'+I.search+'</a>'+
        '<a class="cta" href="https://www.jeffbrownyachts.com" target="_blank" rel="noopener">Contact an expert</a>'+
      '</div>'+
    '</nav>';
  }

  /* ---------- KC sub-navigation ---------- */
  function kcnavHTML(){
    var cur = document.body.dataset.kc || "";
    var items = [
      ["videos","Videos"],["events","Past Events"],["insights","Insights & News"]
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
      ["JBY Journal","index.html"],
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

  /* ---------- Closing band (shared) ----------
     The site's band, verbatim from tools/site-blocks/band.html with this hub's
     own title, line and button. The other 54 pages have it laid over their
     markup by tools/apply-site-blocks.py, which cannot reach a band that is
     built here at runtime — so the block is carried by hand and kept identical.
     The button is a link rather than the block's inert <button>: it goes where
     the two buttons this band used to have went. */
  function ctaHTML(){
    return `
    <!-- ============================ HOW CAN WE HELP ============================
         The band the home page carries: the bow at sunset, a flat black over it,
         and the button as a veil the photograph shows through. The drift and the
         rise are in the script at the end of the page. -->
    <section class="jby-band" id="contact">
      <div class="jb-bg" aria-hidden="true">
        <div class="jb-bg-inner" style="background-image:url('./assets/expert_bow_sunset.jpg')"></div>
      </div>
      <div class="jb-veil" aria-hidden="true"></div>
      <div class="jb-body">
        <h2 data-rise="0">Still have questions?</h2>
        <p data-rise="1">Our specialists are here to help, from choosing the right yacht to caring for it.</p>
        <a class="jb-btn" href="https://www.jeffbrownyachts.com" target="_blank" rel="noopener" data-rise="2">Contact an expert</a>
      </div>
    </section>
`;
  }

  /* ---------- Footer (shared) ----------
     The blue footer, verbatim from tools/site-blocks/footer.html. Its back-to-top
     button keeps id="to-top", which the delegated handler below reaches for. */
  function footerHTML(){
    return `
    <footer class="jby-footer">
      <div class="jf-inner">
        <div class="jf-logo" aria-label="JBY"><img src="${LOGO}" alt=""/></div>

        <div class="jf-cols">
          <div class="jf-lists">
            <h5 class="jf-h">Locations</h5>
            <!-- Every JBY office, each city linking to its Location Detail page. Site-wide. -->
            <nav class="jf-row" aria-label="Locations">
              <a href="#">San Diego</a>
              <span class="jf-sep">/</span>
              <a href="#">Newport Harbor</a>
              <span class="jf-sep">/</span>
              <a href="#">Marina del Rey</a>
              <span class="jf-sep">/</span>
              <a href="#">Sausalito</a>
              <span class="jf-sep">/</span>
              <a href="#">Seattle</a>
              <span class="jf-sep">/</span>
              <a href="#">Kona</a>
              <span class="jf-sep">/</span>
              <a href="#">Charleston</a>
              <span class="jf-sep">/</span>
              <a href="#">Wrightsville Beach</a>
            </nav>
            <h5 class="jf-h">Pages</h5>
            <nav class="jf-row" aria-label="Pages">
              <a href="#">Portfolio</a>
              <span class="jf-sep">/</span>
              <a href="#">Brands</a>
              <span class="jf-sep">/</span>
              <a href="#">Sell your yacht</a>
              <span class="jf-sep">/</span>
              <a href="#">Locations</a>
              <span class="jf-sep">/</span>
              <a href="#">Services</a>
              <span class="jf-sep">/</span>
              <a href="#">Events</a>
              <span class="jf-sep">/</span>
              <a href="#">About JBY</a>
            </nav>
          </div>

          <div class="jf-contact">
            <h5 class="jf-h">Contact</h5>
            <a href="mailto:info@jeffbrownyachts.com">info@jeffbrownyachts.com</a>
            <!-- The toll-free line, not one of the offices' own numbers -->
            <a href="tel:+18886938099">(888) 693 - 8099</a>
            <div class="jf-social">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.63985 3.13281H16.3198C18.9708 3.13281 21.1198 5.33895 21.1198 8.06035V15.9444C21.1198 18.6658 18.9708 20.8719 16.3198 20.8719H8.63985C5.98888 20.8719 3.83984 18.6658 3.83984 15.9444V8.06035C3.83984 5.33895 5.98888 3.13281 8.63985 3.13281ZM17.0442 8.30519C17.5743 8.30519 18.0041 7.86396 18.0041 7.31967C18.0041 6.7754 17.5743 6.33417 17.0442 6.33417C16.5139 6.33417 16.0841 6.7754 16.0841 7.31967C16.0841 7.86396 16.5139 8.30519 17.0442 8.30519ZM12.4809 7.56761C10.095 7.56761 8.16083 9.55312 8.16083 12.0024C8.16083 14.4517 10.095 16.4372 12.4809 16.4372C14.8667 16.4372 16.8009 14.4517 16.8009 12.0024C16.8034 10.8254 16.3491 9.69588 15.5384 8.86363C14.7276 8.03138 13.6274 7.56498 12.4809 7.56761ZM9.84073 12.0008C9.84073 13.4977 11.0227 14.711 12.4808 14.711C13.9387 14.711 15.1207 13.4977 15.1207 12.0008C15.1207 10.5041 13.9387 9.29069 12.4808 9.29069C11.0227 9.29069 9.84073 10.5041 9.84073 12.0008Z"/></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 23" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M21 4.88889V18.1111C21 19.1543 20.1543 20 19.1111 20H15.5694C15.3086 20 15.0973 19.7886 15.0973 19.5277V13.8611H17.3073C17.5317 13.8612 17.7251 13.7032 17.77 13.4833L18.11 11.7833C18.1241 11.7147 18.1068 11.6433 18.0631 11.5885C18.0192 11.5339 17.9534 11.5014 17.8833 11.5H15.0973V8.43056C15.0973 8.30016 15.203 8.19444 15.3333 8.19444H17.6944C17.9553 8.19444 18.1667 7.98303 18.1667 7.72223V6.30556C18.1667 6.04476 17.9553 5.83333 17.6944 5.83333H15.3333C13.7685 5.83333 12.5 7.10186 12.5 8.66667V11.5H11.3383C11.0775 11.5 10.8661 11.7114 10.8661 11.9723V13.3889C10.8661 13.6497 11.0775 13.8611 11.3383 13.8611H12.5V19.5277C12.5 19.7886 12.2886 20 12.0277 20H5.88889C4.84568 20 4 19.1543 4 18.1111V4.88889C4 3.84568 4.84568 3 5.88889 3H19.1111C20.1543 3 21 3.84568 21 4.88889Z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 23" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.7425 4.31649L19.1361 4.45716C20.7859 4.64038 22.0248 6.02396 21.9996 7.65505V15.345C22.0248 16.9761 20.7859 18.3596 19.1361 18.5429L17.7997 18.6836C13.6301 19.1055 9.42722 19.1055 5.25749 18.6836L3.86391 18.5429C2.21405 18.3596 0.975134 16.9761 1.00038 15.345V7.65505C0.975134 6.02396 2.21405 4.64038 3.86391 4.45716L5.20022 4.31649C9.36995 3.8945 13.5728 3.8945 17.7425 4.31649ZM10.6505 14.5197L14.3635 12.0815H14.4208C14.6209 11.9534 14.7416 11.7346 14.7416 11.5C14.7416 11.2654 14.6209 11.0466 14.4208 10.9186L10.7078 8.48029C10.4885 8.3347 10.2055 8.31979 9.97165 8.44152C9.73785 8.56325 9.59145 8.80175 9.59097 9.06172V13.9383C9.60329 14.1802 9.74154 14.399 9.95686 14.5172C10.1722 14.6353 10.4343 14.6364 10.6505 14.5197Z"/></svg></a>
              <!-- The mockup's fourth mark is a chain link with no service named on
                   it. Drawn as a link until we are told whose it is. -->
              <a href="#" aria-label="Website"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M9.5 13.5a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.1 1.1"/><path d="M14.5 10.5a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.1-1.1"/></svg></a>
            </div>
          </div>
        </div>

        <div class="jf-legal">
          <p>&copy; Jeff Brown Yachts, Inc. All Rights Reserved</p>
          <nav class="jf-legal-links" aria-label="Legal">
            <a href="#">Privacy Policy</a>
            <span class="jf-sep">|</span>
            <a href="#">Terms and Conditions</a>
            <span class="jf-sep">|</span>
            <a href="#">Statement of Information</a>
          </nav>
        </div>
      </div>
      <!-- id="to-top" as well as the class: a dozen pages carry a script that
           reaches for document.getElementById('to-top'), and that id lived on the
      button in the footer this block replaced. Without it those scripts threw and
      everything after the throw never ran — on the model page that was the reveal
      observer, the cascade and the map, which is why half the page stayed
      invisible. Those call sites are guarded now as well, so neither half alone
      can do it again. The inline handler stays for the pages that have no such
      script; where both are present they do the same thing. -->
      <button class="jf-top" id="to-top" type="button" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:'smooth'})"><svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M13.9842 10.6509L7.7342 16.9009C7.67613 16.9589 7.60719 17.005 7.53132 17.0364C7.45545 17.0679 7.37414 17.084 7.29201 17.084C7.20989 17.084 7.12857 17.0679 7.0527 17.0364C6.97683 17.005 6.9079 16.9589 6.84983 16.9009C6.79176 16.8428 6.74569 16.7739 6.71427 16.698C6.68284 16.6221 6.66667 16.5408 6.66667 16.4587C6.66667 16.3766 6.68284 16.2952 6.71427 16.2194C6.74569 16.1435 6.79176 16.0746 6.84983 16.0165L12.6584 10.2087L6.84983 4.40087C6.73255 4.28359 6.66667 4.12453 6.66667 3.95868C6.66667 3.79283 6.73255 3.63377 6.84983 3.51649C6.9671 3.39922 7.12616 3.33333 7.29201 3.33333C7.45787 3.33333 7.61693 3.39922 7.7342 3.51649L13.9842 9.76649C14.0423 9.82454 14.0884 9.89347 14.1199 9.96934C14.1513 10.0452 14.1675 10.1265 14.1675 10.2087C14.1675 10.2908 14.1513 10.3721 14.1199 10.448C14.0884 10.5239 14.0423 10.5928 13.9842 10.6509Z"/></svg></button>
    </footer>
`;
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

  /* The photograph band's drift and the rise of the three lines in it.
     Self-contained on purpose: this section appears on pages that carry no
     parallax and no reveal engine of their own, and one small handler
     travelling with it beats thirty-odd pages each growing a copy.

     The drift: the image is centred when the band is centred in the window, and
     0.24 of the distance from there — panning down through the picture as the
     band rises, rather than lagging behind the page the way a background does.

     The rise only ever hides anything once the class below is on <html>, so a
     page whose script never runs shows the band rather than three blank lines. */
  (function(){
    var band = document.querySelector('.jby-band');
    if (!band) return;
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

    var rise = band.querySelectorAll('[data-rise]');
    if (rise.length && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('jb-rise-ready');
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          e.target.classList.add('jb-in');
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -12% 0px' });
      for (var i = 0; i < rise.length; i++) io.observe(rise[i]);
    }

    var bg = band.querySelector('.jb-bg');
    if (!bg || still) return;
    var ticking = false;
    function place(){
      ticking = false;
      var r = band.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      var centre = r.top + r.height / 2 - innerHeight / 2;
      bg.style.transform = 'translate3d(0,' + (centre * 0.24).toFixed(1) + 'px,0)';
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(place); } }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    place();
  })();

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
      if(!ok){name="videos";panels.forEach(function(p){p.classList.toggle("active",p.id==="panel-videos");});}
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
      var _hp = document.querySelector(".hub-panels");
      if(_hp){ var _y = _hp.getBoundingClientRect().top + window.scrollY - 142; window.scrollTo({top: _y<0?0:_y, behavior:"smooth"}); }
    });
    window.addEventListener("hashchange", function(){ show((location.hash||"").replace("#","")||"videos"); });
    show((location.hash||"").replace("#","")||"videos");
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
      /* current photo in white, the "/ total" quieter, so the position reads at a glance */
      if(count) count.innerHTML = '<b>' + (idx + 1) + '</b><span class="lb-of"> / ' + items.length + '</span>';
    }
    function go(d){ idx = (idx + d + items.length) % items.length; render(); }
    function close(){ lb.classList.remove("open"); lb.setAttribute("aria-hidden","true"); media.innerHTML = ""; document.body.style.overflow = ""; }
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function(){ go(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function(){ go(1); });
    /* a tap anywhere on the dark surround closes the viewer, not only on the very edge */
    lb.addEventListener("click", function(e){
      var t = e.target;
      if(t === lb || t === media || (t.classList && t.classList.contains("lb-stage"))) close();
    });
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
    var heroEmbed = g.querySelector(".eg-hero iframe.eg-embed");
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
      if(hero){ hero.src = t.getAttribute("data-full") || (t.querySelector("img")||{}).src; }
      if(heroEmbed && t.getAttribute("data-vid")){ heroEmbed.src = "https://www.youtube.com/embed/"+t.getAttribute("data-vid")+"?autoplay=1&mute=1&loop=1&playlist="+t.getAttribute("data-vid")+"&controls=0&modestbranding=1&rel=0&playsinline=1"; }
      thumbs.forEach(function(x,j){ x.classList.toggle("active", j===cur); });
    }
    thumbs.forEach(function(t,i){ t.addEventListener("click", function(){
      set(i);
      /* on phones and tablets the hero is hidden, so a tap on a tile opens the viewer */
      if(window.matchMedia("(max-width:1024px)").matches){ openLightbox(items, i); }
    }); });
    var p = g.querySelector(".eg-arrow.prev"), n = g.querySelector(".eg-arrow.next");
    if(p){ p.addEventListener("click", function(){ set(cur-1); }); }
    if(n){ n.addEventListener("click", function(){ set(cur+1); }); }
    if(heroBox){ heroBox.addEventListener("click", function(){ openLightbox(items, cur); }); }
    if(play){ play.addEventListener("click", function(e){ e.preventDefault(); openLightbox(items, cur); }); }
    function coverEmbed(){
      if(!heroEmbed || !heroBox) return;
      var w = heroBox.clientWidth, h = heroBox.clientHeight; if(!w || !h) return;
      var sc = Math.max(w/16, h/9);
      heroEmbed.style.width = Math.ceil(16*sc)+"px"; heroEmbed.style.height = Math.ceil(9*sc)+"px";
    }
    if(heroEmbed){
      if(window.ResizeObserver){ new ResizeObserver(coverEmbed).observe(heroBox); }
      else { coverEmbed(); window.addEventListener("resize", coverEmbed); }
    }
  });

  /* ---------- Edge fade only while the row can scroll (chips + tab bar) ---------- */
  (function(){
    function shade(el){
      var atStart = el.scrollLeft <= 1;
      var atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if(atStart && atEnd){ el.style.webkitMaskImage = el.style.maskImage = "none"; return; }
      var L = atStart ? "#000 0" : "transparent 0, #000 22px";
      var R = atEnd ? "#000 100%" : "#000 calc(100% - 22px), transparent 100%";
      var m = "linear-gradient(90deg, "+L+", "+R+")";
      el.style.webkitMaskImage = el.style.maskImage = m;
    }
    document.querySelectorAll(".kcnav-inner, .chips").forEach(function(el){
      var f = function(){ shade(el); };
      el.addEventListener("scroll", f, {passive:true});
      window.addEventListener("resize", f);
      f();
    });
  })();

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
      wrap.innerHTML = '<div class="sr-empty"><h2>Search the JBY Journal</h2>'+
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
          '</div><div class="media-grid cols-3">'+grid+'</div></div>';
      });
      var head = '<div class="sr-head"><div class="sr-title">'+
        '<h1>Results for <span>&ldquo;'+esc(q)+'&rdquo;</span></h1></div>'+
        '<p class="sr-count">'+total+' result'+(total===1?"":"s")+'</p></div>';
      wrap.innerHTML = total ? head + blocks
        : '<div class="sr-empty"><h2>No results for <span>&ldquo;'+esc(q)+'&rdquo;</span></h2>'+
          '<p>Try a different search, or browse everything in the JBY Journal.</p>'+
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
          '<a class="btn btn-md btn-solid" href="index.html#all"><span>Browse the JBY Journal</span></a></div>';
      });
    }

    var q0 = param("query").trim();
    if(inp) inp.value = q0;
    search(q0);

    /* when results are showing, the Search button becomes a Clear (X) button */
    var sbtn = document.querySelector("form.searchbar button");
    if(sbtn && q0){
      sbtn.type = "button";
      sbtn.classList.add("sr-clearbtn");
      sbtn.setAttribute("aria-label", "Clear search");
      sbtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6 6 18"/></svg>';
      sbtn.addEventListener("click", function(){ window.location.href = "index.html"; });
    }

    /* clearing the field (native X) returns to the JBY Journal home */
    if(inp){
      inp.addEventListener("search", function(){
        if(!inp.value.trim()){ window.location.href = "index.html"; }
      });
    }
  })();
})();
