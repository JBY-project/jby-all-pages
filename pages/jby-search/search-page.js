/* ======================================================================
   SEARCH RESULTS PAGE
   Drives search.html off the same engine the header panel uses. Vessels
   and events are re-used verbatim — the very cards the home page shows —
   which is why the harvest keeps their markup.
   ====================================================================== */
(function(){
  'use strict';

  var qEl = document.getElementById('sr-q'),
      cEl = document.getElementById('sr-count'),
      body= document.getElementById('sr-body');
  if (!qEl || !body || !window.JBY_SEARCH) return;

  var params = new URLSearchParams(location.search);
  var query  = (params.get('q') || '').trim();
  var brand  = (params.get('brand') || '').trim();

  var BLOCKS = [
    {kind:'yacht',    title:'Yachts for sale', more:'./index.html#yachts'},
    {kind:'brand',    title:'Brands',          more:null},
    {kind:'event',    title:'Events',          more:'https://ywteamyw.github.io/jby-events/'},
    {kind:'article',  title:'Articles',        more:'https://ywteamyw.github.io/jby-news-media/'},
    {kind:'location', title:'Locations',       more:'https://ywteamyw.github.io/jby-locations/'},
    {kind:'team',     title:'Team',            more:'https://ywteamyw.github.io/jby-team/'},
    {kind:'service',  title:'Services',        more:'https://ywteamyw.github.io/jby-all-services/'},
    {kind:'page',     title:'Pages',           more:null}
  ];
  var PER_BLOCK = 3;

  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  // The list is already only relevant hits, so matched words are not marked.
  function mark(text){ return esc(text); }

  // A vessel or event keeps the home page's own card; anything else gets a
  // plain one built here.
  function cardFor(it, qt){
    if (it.html) return it.html;
    if (it.kind === 'article') return articleCard(it, qt);

    var pic = it.logo || it.img;
    var img = pic
      ? '<span class="cimg'+(it.logo ? ' logo' : '')+'" style="background-image:url(\''+esc(pic)+'\')"></span>'
      : '';
    return '<a class="sr-card sr-'+esc(it.kind)+'" href="'+esc(it.u)+'">' + img +
      '<span class="cbody"><span class="ctitle">'+mark(it.t, qt)+'</span>' +
      (it.d ? '<span class="cmeta">'+mark(it.d, qt)+'</span>' : '') + '</span></a>';
  }

  // Articles get their own shape: category over the photo, headline, room for
  // a standfirst, then the date and reading time along the foot.
  function articleCard(it, qt){
    var img = it.img
      ? '<span class="cimg" style="background-image:url(\''+esc(it.img)+'\')"></span>'
      : '';
    var foot = '';
    if (it.date || it.read){
      foot = '<span class="cfoot">' +
        (it.date ? '<span class="fbit">'+esc(it.date)+'</span>' : '') +
        (it.date && it.read ? '<span class="fsep"></span>' : '') +
        (it.read ? '<span class="fbit">'+esc(it.read)+'</span>' : '') +
        '</span>';
    }
    return '<a class="sr-card sr-article" href="'+esc(it.u)+'">' + img +
      '<span class="cbody"><span class="ctitle">'+mark(it.t, qt)+'</span>' +
      (it.excerpt ? '<span class="cexcerpt">'+mark(it.excerpt, qt)+'</span>' : '') +
      foot + '</span></a>';
  }

  function render(hits){
    var qt = window.JBY_SEARCH.terms(query);
    if (brand){
      hits = hits.filter(function(h){
        return h.item.kind === 'brand' || h.item.brand === brand;
      });
    }

    var by = {};
    hits.forEach(function(h){ (by[h.item.kind] = by[h.item.kind] || []).push(h.item); });

    var html = '', any = false;
    BLOCKS.forEach(function(b){
      var list = by[b.kind]; if (!list || !list.length) return;
      any = true;
      var more = b.more || list[0].u;
      html += '<section class="sr-block"><div class="sr-secline"><h2>'+esc(b.title)+'</h2>' +
              '<a class="s-link" href="'+esc(more)+'">See more</a></div>' +
              '<div class="sr-grid">' +
              list.slice(0, PER_BLOCK).map(function(it){ return cardFor(it, qt); }).join('') +
              '</div></section>';
    });

    if (!any){
      html = '<div class="sr-empty"><h2>Nothing found</h2>' +
             '<p>Try a builder, a model, a city or a service.</p>' +
             '<a class="btn-solid" href="./index.html">Back to the home page</a></div>';
    }

    body.innerHTML = html;
    cEl.textContent = hits.length
      ? hits.length + (hits.length === 1 ? ' result' : ' results') + (brand ? ' in ' + brand : '')
      : '';
  }

  qEl.textContent = query ? '\u201c' + query + '\u201d' : (brand || '');
  document.title = (query || brand || 'Search') + ' \u2014 Jeff Brown Yachts';

  // Vessels, events and offices live in the home page's markup, so read them
  // from there rather than keeping a second copy that could drift.
  fetch('./index.html')
    .then(function(r){ return r.text(); })
    .then(function(t){
      var doc = new DOMParser().parseFromString(t, 'text/html');
      window.JBY_SEARCH.setIndex(window.JBY_SEARCH.build(doc));
      render(window.JBY_SEARCH.search(query || brand));
    })
    .catch(function(){
      // Offline or opened straight off disk: still show everything that does
      // not depend on the home page's DOM.
      window.JBY_SEARCH.setIndex(window.JBY_SEARCH.build(document));
      render(window.JBY_SEARCH.search(query || brand));
    });
})();
