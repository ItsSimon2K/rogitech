/**
 * Main script file
 * 
 * Author: Bjorn Lu
 * 
 * Notes:
 * - Vanilla JS
 * - No semicolon (ASI)
 * - JSDoc comments
 * - Namespaced
 */
(() => {
  window.addEventListener('load', function () {
    /**
     * Carousel
     * 
     * Description:
     * - Only supports fade transitions
     * - Consists of `view` and `controls`
     * - `view` contains `slides` which will be shown and transitioned
     * - `controls` contains the `forward` and `backward` buttons
     * 
     * Data:
     * - `data-carousel-auto-slide-interval`: Time between auto sliding in milliseconds. Set 0 to disable. (Default: 0)
     * - `data-carousel-auto-slide-direction`: Auto slide direction, `forward` or `backward`. (Default: `forward`)
     * - `data-carousel-disable-auto-on-hover`: Temporarily stops auto sliding when mouse hover. (Default: true)
     */
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      const autoSlideInterval = +carousel.dataset.carouselAutoSlideInterval || 0
      const autoSlideDirection = carousel.dataset.carouselAutoSlideDirection || 'forward'
      const disableAutoOnHover = carousel.dataset.carouselDisableAutoOnHover !== 'false'

      let currentSlideIndex = 0

      const slides = carousel.querySelectorAll('.carousel__view .carousel__view__slide')

      // Go forward
      carousel.querySelectorAll('.carousel__controls .carousel__controls__forward')
        .forEach(btn => btn.addEventListener('click', () => slideTo(currentSlideIndex + 1, 'forward')))

      // Go backward
      carousel.querySelectorAll('.carousel__controls .carousel__controls__backward')
        .forEach(btn => btn.addEventListener('click', () => slideTo(currentSlideIndex - 1, 'backward')))

      // Auto slide
      if (autoSlideInterval) {
        let handler
        const autoIncrement = autoSlideDirection === 'forward' ? 1 : -1

        startAuto()

        if (disableAutoOnHover) {
          carousel.addEventListener('mouseenter', stopAuto)
          carousel.addEventListener('mouseleave', startAuto)
        }

        function startAuto () {
          clearInterval(handler)
          handler = setInterval(() => slideTo(currentSlideIndex + autoIncrement), autoSlideInterval)
        }

        function stopAuto () {
          clearInterval(handler)
        }
      }

      // Init
      slideTo(currentSlideIndex, autoSlideDirection)

      function slideTo (index, direction = 'forward') {
        currentSlideIndex = mod(index, slides.length)

        slides.forEach(function (slide, index) {
          if (index === currentSlideIndex) {
            slide.classList.add(`carousel__view__slide--active-${direction}`)
          } else {
            slide.classList.remove('carousel__view__slide--active-forward', 'carousel__view__slide--active-backward')
          }
        })
      }
    })

    /**
     * Proper math modulus implementation that handles negative `val`
     * @param {number} val
     * @param {number} by
     */
    function mod(val, by) {
      return (val % by + by) % by
    }
  })
})()
