/* Bailamos site — real device screenshots dropped into phone frames.
   The screenshot already contains the status bar + home indicator, so the
   frame only adds the bezel and the rounded-corner mask (overflow:hidden).
   Float lives on the frame, independent of the image. */
(function(){
  function frame(src, alt, floaty){
    return '<div class="shotframe' + (floaty ? ' floatme' : '') + '">' +
             '<div class="shotscreen"><img src="' + src + '" alt="' + alt + '" loading="lazy"/></div>' +
           '</div>';
  }
  const fills = [
    ['screen-hero',    'assets/app-map.png',     'Bailamos map of tonight\u2019s socials', true],
    ['screen-map',     'assets/app-map.png',     'Map of socials near you', false],
    ['screen-list',    'assets/app-week.png',    'A week of socials as a list', false],
    ['screen-detail',  'assets/app-detail.png',  'Event detail with address, cover and DJ', false],
    ['screen-saved',   'assets/app-saved.png',   'Your saved socials', true]
  ];
  fills.forEach(([id, src, alt, floaty]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = frame(src, alt, floaty);
  });

  // creator pair (two overlapping frames in one container)
  const creator = document.getElementById('screen-creator');
  if (creator) creator.outerHTML = '<div class="shotframe back"><div class="shotscreen"><img src="assets/app-creator.png" alt="Become a creator" loading="lazy"/></div></div>';
  const create = document.getElementById('screen-create');
  if (create) create.outerHTML = '<div class="shotframe front"><div class="shotscreen"><img src="assets/app-create.png" alt="Create a new event" loading="lazy"/></div></div>';
})();
