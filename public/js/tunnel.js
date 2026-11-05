// Matrix Salon — tunnel.js — service tunnel carousel (self-contained)
// Split from js/main.js (original single-file build). Keep load order:
// vendor-three.js -> core.js -> tour.js -> scene.js -> showcase.js -> tunnel.js
(function(){
  "use strict";
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mathematical range wrap / modulo helper */
  function wrap(val, min, max){
    var range = max - min;
    if(range <= 0) return min;
    return ((((val - min) % range) + range) % range) + min;
  }
  var tourProgress = (typeof window !== 'undefined' && typeof window.tourProgress === 'number') ? window.tourProgress : 0;

  var RITUALS = [
    { name:'Balayage & Ombre', em:'Ombre', dept:'Hair Studio', key:'hair',
      img:'assets/img-02.jpg', alt:'Balayage hair styling with soft blonde waves',
      price:'₹4,499', desc:'Hand-painted, sun-kissed dimension — the transformation our colour studio is loved for.', book:'Balayage / Global Colour' },
    { name:'HydraFacial', em:'HydraFacial', dept:'Skin Lounge', key:'skin',
      img:'assets/img-03.jpg', alt:'Relaxing facial treatment at the skin lounge',
      price:'₹1,999', desc:'Deep cleanse, exfoliation and a hydration boost for lit-from-within skin.', book:'HydraFacial' },
    { name:'Bridal Makeup — Airbrush', em:'Airbrush', dept:'Bridal Suite', key:'makeup',
      img:'assets/img-04.jpg', alt:'Indian bride in full bridal makeup and jewellery',
      price:'₹19,999', desc:'Featherlight, waterproof and flawless all day — with hairstyling and draping.', book:'Bridal Makeup' },
    { name:'Full Body Massage', em:'Massage', dept:'Body & Spa', key:'body',
      img:'assets/img-01.jpg', alt:'Calm luxury salon lounge where spa rituals take place',
      price:'₹1,499', desc:'Swedish and Balinese relaxation rituals that melt the city off your shoulders.', book:'Body Spa & Massage' },
    { name:'Gel Nail Extensions', em:'Extensions', dept:'Nail Studio', key:'nails',
      img:'assets/img-05.jpg', alt:'Manicure with polished nails at the nail studio',
      price:'₹1,499', desc:'Length and shape built to your style, finished with chip-free shine.', book:'Nail Extensions' },
    { name:'Luxury Hot-Towel Shave', em:'Hot-Towel', dept:"Men's Grooming", key:'men',
      img:'assets/img-06.jpg', alt:'Barber giving a precision haircut at the grooming bar',
      price:'₹149', desc:'Hot towel, rich lather, cooling finish — the classic ritual, done the slow way.', book:'Beard & Shave' }
  ];

  var stage = document.getElementById('tunnelStage');
  var panelsBox = document.getElementById('tunnelPanels');
  var detail = document.getElementById('tunnelDetail');
  var elDept = document.getElementById('tdDept');
  var elName = document.getElementById('tdName');
  var elDesc = document.getElementById('tdDesc');
  var elPrice = document.getElementById('tdPrice');
  var elNow = document.getElementById('tunnelNow');
  var dotsBox = document.getElementById('tdDots');
  if(!stage || !panelsBox) return;
  document.getElementById('tunnelTotal').textContent = ('0' + RITUALS.length).slice(-2);

  var idx = 0;
  var panelEls = [];
  var dotEls = [];
  var swipedAt = 0;

  RITUALS.forEach(function(r, i){
    var p = document.createElement('article');
    p.className = 'tpanel';
    p.setAttribute('role', 'button');
    p.setAttribute('aria-label', r.name + ' — from ' + r.price);

    var img = document.createElement('img');
    img.src = r.img; img.alt = r.alt; img.loading = 'lazy';
    p.appendChild(img);

    var price = document.createElement('span');
    price.className = 'tpanel-price';
    var sm = document.createElement('small'); sm.textContent = 'From';
    price.appendChild(sm);
    price.appendChild(document.createTextNode(r.price));
    p.appendChild(price);

    var body = document.createElement('div');
    body.className = 'tpanel-body';
    var dept = document.createElement('span');
    dept.className = 'tpanel-dept'; dept.textContent = r.dept;
    var name = document.createElement('span');
    name.className = 'tpanel-name'; name.textContent = r.name;
    body.appendChild(dept); body.appendChild(name);
    p.appendChild(body);

    p.addEventListener('click', function(){
      if(Date.now() - swipedAt < 250) return; /* it was a swipe, not a tap */
      if(i === idx){ bookCurrent(); } else { go(i); }
    });
    panelsBox.appendChild(p);
    panelEls.push(p);

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Show ' + r.name);
    dot.addEventListener('click', function(){ go(i); });
    dotsBox.appendChild(dot);
    dotEls.push(dot);
  });

  function offsetFor(i){
    var n = RITUALS.length;
    var o = ((i - idx) % n + n) % n;
    if(o > n / 2) o -= n;
    return o;
  }

  function render(){
    panelEls.forEach(function(p, i){
      var o = offsetFor(i);
      var ao = Math.abs(o);
      var t, z, filt, op;
      if(o === 0){
        t = 'translate(-50%,-50%) translateZ(70px) rotateY(0deg)';
        z = 12; filt = 'brightness(1)'; op = 1;
      } else if(ao === 1){
        t = 'translate(-50%,-50%) translateX(' + (o * 60) + '%) translateZ(-180px) rotateY(' + (-o * 27) + 'deg)';
        z = 9; filt = 'brightness(.55) saturate(.85)'; op = 1;
      } else if(ao === 2){
        t = 'translate(-50%,-50%) translateX(' + (o * 102) + '%) translateZ(-380px) rotateY(' + (-o * 38) + 'deg)';
        z = 7; filt = 'brightness(.32) saturate(.7)'; op = 0.9;
      } else {
        t = 'translate(-50%,-50%) translateX(' + (o * 132) + '%) translateZ(-540px) rotateY(' + (-o * 46) + 'deg)';
        z = 5; filt = 'brightness(.2)'; op = 0;
      }
      p.style.transform = t;
      p.style.zIndex = String(z);
      p.style.filter = filt;
      p.style.opacity = String(op);
      p.style.pointerEvents = (ao === 3) ? 'none' : 'auto';
    });
    var r = RITUALS[idx];
    elDept.textContent = r.dept;
    elName.innerHTML = '';
    /* service name with its signature word in italic gold */
    var parts = r.name.split(r.em);
    if(parts.length === 2 && r.em){
      elName.appendChild(document.createTextNode(parts[0]));
      var em = document.createElement('em'); em.textContent = r.em;
      elName.appendChild(em);
      elName.appendChild(document.createTextNode(parts[1]));
    } else {
      elName.textContent = r.name;
    }
    elDesc.textContent = r.desc;
    elPrice.textContent = r.price;
    elNow.textContent = ('0' + (idx + 1)).slice(-2);
    dotEls.forEach(function(d, i){
      d.classList.toggle('on', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    if(!reduced){
      detail.classList.remove('swap');
      void detail.offsetWidth; /* restart the fade-in */
      detail.classList.add('swap');
    }
  }

  function go(i){
    var n = RITUALS.length;
    idx = ((i % n) + n) % n;
    render();
  }
  function next(){ go(idx + 1); }
  function prev(){ go(idx - 1); }

  document.getElementById('tunnelNext').addEventListener('click', next);
  document.getElementById('tunnelPrev').addEventListener('click', prev);

  stage.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight'){ e.preventDefault(); next(); }
    if(e.key === 'ArrowLeft'){ e.preventDefault(); prev(); }
  });

  /* swipe through the tunnel */
  var downX = null;
  stage.addEventListener('pointerdown', function(e){ downX = e.clientX; }, { passive: true });
  stage.addEventListener('pointerup', function(e){
    if(downX === null) return;
    var dx = e.clientX - downX;
    downX = null;
    if(Math.abs(dx) > 42){
      swipedAt = Date.now();
      if(dx < 0) next(); else prev();
    }
  }, { passive: true });

  function bookCurrent(){
    var r = RITUALS[idx];
    var sel = document.getElementById('f-service');
    if(sel){
      for(var i = 0; i < sel.options.length; i++){
        if(sel.options[i].text.replace(/\s+/g, ' ').trim() === r.book){ sel.selectedIndex = i; break; }
      }
    }
    var book = document.getElementById('book');
    if(book) book.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.getElementById('tdBook').addEventListener('click', bookCurrent);
  document.getElementById('tdMenu').addEventListener('click', function(){
    var r = RITUALS[idx];
    var tab = document.querySelector('.tab[data-panel="' + r.key + '"]');
    if(tab) tab.click();
    var svc = document.getElementById('services');
    if(svc) svc.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  /* Force-Hide Hero Ring Mesh in Salon View if scroll progress >= 0.65 */
  if(typeof window !== 'undefined'){
    window.addEventListener('scroll', function(){
      if(typeof window.tourProgress === 'number' && window.tourProgress >= 0.65){
        if(window.heroRingMesh) window.heroRingMesh.visible = false;
        if(window.portalHeroGroup) window.portalHeroGroup.visible = false;
      }
    }, { passive: true });
  }

  render();
})();
