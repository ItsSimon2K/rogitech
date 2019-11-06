/**
 * Main script file
 * 
 * Author: Bjorn Lu, Sim Mao Chen
 * 
 * Notes:
 * - Vanilla JS
 * - ES6 syntax
 * - No semicolon (ASI)
 * - JSDoc comments
 * - Namespaced (IIFE)
 */
(() => {
  window.addEventListener('load', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /**
     * Carousel
     * 
     * Usage:
     * - Example carousel structure:
     *   <div class="carousel">
     *     <div class="carousel__controls">
     *       <button class="carousel__controls__backward"></button>
     *       <button class="carousel__controls__forward"></button>
     *     </div>
     *     <div class="carousel__view">
     *       <div class="carousel__view__slide"></div>
     *       <div class="carousel__view__slide"></div>
     *       <div class="carousel__view__slide"></div>
     *     </div>
     *   </div>
     * 
     * Description:
     * - Only supports fade transitions
     * - Consists of `view` and `controls`
     * - `view` contains `slides` which will be shown and transitioned
     * - `controls` contains the `forward` and `backward` buttons
     * 
     * Data:
     * - `data-carousel-auto-slide-interval`: Time between auto sliding in ms. Set 0 to disable. (Default: `0`)
     * - `data-carousel-auto-slide-direction`: Auto slide direction, `forward` or `backward`. (Default: `forward`)
     * - `data-carousel-disable-auto-on-hover`: Temporarily stops auto sliding when mouse hover. (Default: `true`)
     */
    document.querySelectorAll('.carousel').forEach((carousel) => {
      const autoSlideInterval = +carousel.dataset.carouselAutoSlideInterval || 0
      const autoSlideDirection = carousel.dataset.carouselAutoSlideDirection || 'forward'
      const disableAutoOnHover = carousel.dataset.carouselDisableAutoOnHover !== 'false'

      let currentSlideIndex = 0

      const slides = carousel.querySelectorAll('.carousel__view .carousel__view__slide')

      // Go forward
      carousel.querySelectorAll('.carousel__controls .carousel__controls__forward').forEach((btn) => {
        btn.addEventListener('click', () => slideTo(currentSlideIndex + 1, 'forward'))
      })

      // Go backward
      carousel.querySelectorAll('.carousel__controls .carousel__controls__backward').forEach((btn) => {
        btn.addEventListener('click', () => slideTo(currentSlideIndex - 1, 'backward'))
      })

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

        slides.forEach((slide, index) => {
          if (index === currentSlideIndex) {
            slide.classList.add(`carousel__view__slide--active-${direction}`)
          } else {
            slide.classList.remove('carousel__view__slide--active-forward', 'carousel__view__slide--active-backward')
          }
        })
      }
    })

    /**
     * Fader
     * 
     * Usage:
     * - Add `fader` class on target element
     * 
     * Description:
     * - Fades an element in with CSS `transform` and `opacity`
     * - Uses `IntersectionObserver` to check visibility
     * 
     * Data:
     * - `data-fader-move`: Translation distance. (Default: `12px`)
     * - `data-fader-direction`: Translation direction. (Default: `up`)
     * - `data-fader-duration`: Transition duration. (Default: `1s`)
     * - `data-fader-delay`: Transition delay. (Default: `.1s`)
     * - `data-fader-easing`: Transition easing. (Default: `ease`)
     */
    ;(() => {
      const faderObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Check visibility and fade in
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translate3d(0, 0, 0)'
          }
        })
      })

      document.querySelectorAll('.fader').forEach((fader) => {
        // In cases where the page load from the middle, those above should not be animated
        if (fader.getBoundingClientRect().bottom <= 0) { return }
  
        const {
          faderMove: move = '12px',
          faderDirection: direction = 'up',
          faderDuration: duration = '1s',
          faderDelay: delay = '.1s',
          faderEasing: easing = 'ease'
        } = fader.dataset
  
        fader.style.opacity = 0
  
        if (!reducedMotion) {
          switch (direction) {
            case 'up':
              fader.style.transform = `translate3d(0, ${move}, 0)`
              break
            case 'down':
              fader.style.transform = `translate3d(0, -${move}, 0)`
              break
            case 'left':
              fader.style.transform = `translate3d(${move}, 0, 0)`
              break
            case 'right':
              fader.style.transform = `translate3d(-${move}, 0, 0)`
              break
          }
        }
  
        fader.style.transition = `all ${duration} ${delay} ${easing}`
  
        faderObserver.observe(fader)
      })
    })()

    /**
     * Simple Parallax
     * https://simpleparallax.com
     * 
     * Usage:
     * - Add `parallax` class on target img
     */
    if (!reducedMotion && typeof simpleParallax !== 'undefined') {
      new simpleParallax(document.querySelectorAll('.parallax'), {
        scale: 1.1,
        delay: .3
      })
    }

    // Scroll to Top Button     
    document.querySelectorAll('.scroll-top-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? 'auto' : 'smooth'
        })
      })
    })

    /**
     * Fake load
     * 
     * Usage:
     * - Add `fake-load` class on target form
     * 
     * Description:
     * - When submit form, fake loads nothing
     * - When start to load, it adds classes to respective targets, and removes all when done
     * 
     * Data:
     * - `data-fake-load-duration`: Loading duration in ms. (Default: 3000)
     * - `data-fake-load-targets`: Comma-separated targets using query selectors. (Default: self)
     * - `data-fake-load-classes`: Comma-separated classes for respective targets. (Default: 'loading')
     */
    document.querySelectorAll('.fake-load').forEach((el) => {
      const {
        fakeLoadDuration: duration = 3000,
        fakeLoadTargets: targets = el,
        fakeLoadClasses: loadClasses = 'loading'
      } = el.dataset

      const targetList = typeof targets !== 'string' ? [targets] : targets.split(',').map(v => document.querySelectorAll(v.trim()))
      const loadClassList = loadClasses.split(',').map(v => v.trim())

      const minListLength = Math.min(targetList.length, loadClassList.length)

      el.addEventListener('submit', (evt) => {
        evt.preventDefault()

        // Add loading classes
        for (let i = 0; i < minListLength; i++) {
          targetList[i].forEach(v => v.classList.add(loadClassList[i]))
        }

        setTimeout(() => {
          // Remove loading classes
          for (let i = 0; i < minListLength; i++) {
            targetList[i].forEach(v => v.classList.remove(loadClassList[i]))
          }
        }, +duration)
      })
    })

    /**
     * Product card animation
     * 
     * Description:
     * - Smooth product card view with details slide down
     */
    document.querySelectorAll('.product-card').forEach((card) => {
      const details = card.querySelector('.product-card__details')
      const btnIcon = card.querySelector('.product-card__hero__content__details > i.fas')

      // Set details height to original height (Height change for animation)
      const setDetailsHeight = () => {
        // Remove set height to retrieve original height
        details.style.height = ''
        details.style.height = details.getBoundingClientRect().height + 'px'
      }

      // Open product details
      const open = () => {
        card.classList.add('product-card--active')
        setDetailsHeight()
        btnIcon.classList.add('fa-minus-circle')
        btnIcon.classList.remove('fa-plus-circle')
      }

      // Close product details
      const close = () => {
        card.classList.remove('product-card--active')
        details.style.height = '0'
        btnIcon.classList.add('fa-plus-circle')
        btnIcon.classList.remove('fa-minus-circle')
      }

      // Default close
      close()

      // If resizing and card is active, update details height (throttled)
      const updateHeight = () => card.classList.contains('product-card--active') && setDetailsHeight()
      window.addEventListener('resize', throttle(updateHeight, 300))

      // Check if hash equal this card, and open
      const checkHash = () => (window.location.hash === '#' + card.id) && open()

      // Check hash and listen changes
      checkHash()
      window.addEventListener('hashchange', debounce(checkHash, 300))

      // Stop button event propagation so it doesn't trigger hero click
      const btnStop = evt => evt.stopPropagation()
      card.querySelectorAll('.product-card__hero button').forEach(btn => btn.addEventListener('click', btnStop))

      // Toggle card
      const toggleCard = () => card.classList.contains('product-card--active') ? close() : open()
      card.querySelector('.product-card__hero').addEventListener('click', toggleCard)
    })

    /**
     * Img view
     * 
     * Usage:
     * - Add `img-view` class on target img
     * 
     * Description:
     * - Show fullscreen image on click
     */
    ;(() => {
      const imgViews = document.querySelectorAll('.img-view')
      let showImg

      if (imgViews.length > 0) {
        // Create img-viewer div
        const viewer = document.createElement('div')
        viewer.classList.add('img-viewer')
        viewer.addEventListener('click', () => viewer.classList.remove('img-viewer--show'))
  
        // Create img-viewer img 
        const img = document.createElement('img')
        img.classList.add('img-viewer__img')
        viewer.appendChild(img)
  
        // Hook showImg function 
        showImg = (src, alt) => {
          img.setAttribute('src', src)
          img.setAttribute('alt', alt)
          viewer.classList.add('img-viewer--show')
        }
  
        document.body.appendChild(viewer)
      }

      imgViews.forEach((view) => {
        view.addEventListener('click', () => {
          showImg(view.getAttribute('src'), view.getAttribute('alt'))
        })
      })
    })()

    /**
     * Proper math modulus implementation that handles negative `val`
     * @param {number} val
     * @param {number} by
     */
    function mod (val, by) {
      return (val % by + by) % by
    }

    /**
     * Debounces a function
     * @param {Function} fn Function to be debounced
     * @param {number} wait Debounce time in ms
     */
    function debounce (fn, wait) {
      let h
      return function () {
        clearTimeout(h)
        h = setTimeout(() => fn.apply(this, arguments), wait)
      }
    }

    /**
     * Throttles a function
     * @param {Function} fn Function to be throttled
     * @param {number} wait Throttle time in ms
     */
    function throttle (fn, wait) {
      let h
      return function () {
        if (!h) {
          h = setTimeout(() => {
            h = null
            fn.call(this, arguments)
          }, wait)
        }
      }
    }
  })
})()
