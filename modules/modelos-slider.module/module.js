(function () {
  'use strict';

  function initModelosSlider(sliderEl) {
    var track    = sliderEl.querySelector('[data-ms-track]');
    var slides   = Array.from(sliderEl.querySelectorAll('[data-ms-slide]'));
    var prevBtn  = sliderEl.querySelector('[data-ms-prev]');
    var nextBtn  = sliderEl.querySelector('[data-ms-next]');

    if (!track || !slides.length) return;

    var total        = slides.length;
    var currentIndex = 0;
    var isLoop       = sliderEl.dataset.loop !== 'false';
    var doAutoplay   = sliderEl.dataset.autoplay === 'true';
    var autoDelay    = parseInt(sliderEl.dataset.autoplayDelay, 10) || 4000;
    var autoTimer    = null;

    function goTo(index) {
      if (isLoop) {
        index = ((index % total) + total) % total;
      } else {
        index = Math.max(0, Math.min(index, total - 1));
      }
      currentIndex = index;

      // Update Slides
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === currentIndex);
      });

      // Transform Track
      var offset = currentIndex * 100;
      track.style.transform = 'translateX(-' + offset + '%)';

      // Update Buttons if no loop
      if (!isLoop) {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
      }
    }

    function startAutoplay() {
      if (!doAutoplay) return;
      autoTimer = setInterval(function () { goTo(currentIndex + 1); }, autoDelay);
    }
    function stopAutoplay()  { clearInterval(autoTimer); }
    function resetAutoplay() { stopAutoplay(); startAutoplay(); }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); resetAutoplay(); });

    // Swipe
    var touchStartX = 0;
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        resetAutoplay();
      }
    }, { passive: true });

    sliderEl.addEventListener('mouseenter', stopAutoplay);
    sliderEl.addEventListener('mouseleave', startAutoplay);

    goTo(0);
    startAutoplay();
  }

  function init() {
    document.querySelectorAll('[data-modelos-slider]').forEach(initModelosSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
