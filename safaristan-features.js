
document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initBackToTop();
  initScrollReveal();
  initStatsCounter();
  initDestinationSearch();
  initInterestFilter();
  initDestinationModal();
  initTestimonialCarousel();
  initGalleryLightbox();
  initContactFormValidation();
  initTripPlanner();
  initImageEffects();
});


/* =========================================================================
   SHARED MODAL HELPER (used by Feature 6, 8, 12)
   ========================================================================= */

function createModal(id) {
  let overlay = document.getElementById(id);
  if (overlay) return overlay._sf;

  overlay = document.createElement('div');
  overlay.id = id;
  overlay.className = 'sf-modal-overlay';

  overlay.innerHTML = `
    <div class="sf-modal-box" role="dialog" aria-modal="true">
      <button class="sf-modal-close" aria-label="Close">&times;</button>
      <div class="sf-modal-body"></div>
    </div>`;

  document.body.appendChild(overlay);

  const box = overlay.querySelector('.sf-modal-box');
  const closeBtn = overlay.querySelector('.sf-modal-close');
  const body = overlay.querySelector('.sf-modal-body');

  const api = {
    overlay,
    box,
    body
  };

  overlay._sf = api;

  closeBtn.addEventListener('click', () => closeModal(api));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(api);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      overlay.classList.contains('sf-modal-open')
    ) {
      closeModal(api);
    }
  });

  return api;
}


function openModal(modal) {
  modal.overlay.classList.add('sf-modal-open');
  document.body.classList.add('sf-modal-lock');
}


function closeModal(modal) {
  modal.overlay.classList.remove('sf-modal-open');
  document.body.classList.remove('sf-modal-lock');
}


/* =========================================================================
   FEATURE 1 — Sticky Navbar Scroll Effect
   ========================================================================= */

function initStickyNavbar() {
  const header = document.getElementById('header');

  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle(
      'sf-scrolled',
      window.scrollY > 40
    );
  });
}


/* =========================================================================
   FEATURE 2 — Back to Top Button
   ========================================================================= */

function initBackToTop() {
  const btn = document.createElement('button');

  btn.id = 'sf-back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&uarr;';

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle(
      'sf-show',
      window.scrollY > 400
    );
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* =========================================================================
   FEATURE 3 — Scroll Reveal Animation
   ========================================================================= */

function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');

  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add('sf-revealed');

        obs.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.15
  });

  items.forEach((el) => {
    obs.observe(el);
  });
}


/* =========================================================================
   FEATURE 4 — Animated Stats Counter
   ========================================================================= */

function initStatsCounter() {

  const stats = document.querySelectorAll(
    '#stats-container .stat-box h2'
  );

  if (!stats.length) return;


  function animate(el) {

    const raw = el.textContent.trim();

    const match = raw.match(/([\d.]+)/);

    if (!match) return;

    const target = parseFloat(match[1]);

    const isDecimal = match[1].includes('.');

    const duration = 1400;

    const start = performance.now();


    function tick(now) {

      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const current = target * progress;

      const value = isDecimal
        ? current.toFixed(1)
        : Math.floor(current);

      el.textContent = raw.replace(
        match[1],
        value
      );

      if (progress < 1) {

        requestAnimationFrame(tick);

      } else {

        el.textContent = raw;

      }
    }


    requestAnimationFrame(tick);
  }


  const obs = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        animate(entry.target);

        obs.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.4
  });


  stats.forEach((el) => {
    obs.observe(el);
  });
}


/* =========================================================================
   FEATURE 5 — Live Destination Search
   ========================================================================= */

function initDestinationSearch() {

  const homeContainer = document.querySelector(
    '.popular-destinations .container'
  );

  const sliderWrapper = document.querySelector(
    '.slider-wrapper'
  );


  if (homeContainer && sliderWrapper) {

    insertSearchBar(
      homeContainer,
      sliderWrapper,
      '.cards-container .card',
      'h3'
    );

  }


  const distImages = document.getElementById('images');


  if (distImages && distImages.parentElement) {

    insertSearchBar(
      distImages.parentElement,
      distImages,
      '#images > div',
      'h3'
    );

  }
}


function insertSearchBar(
  host,
  beforeEl,
  cardsSelector,
  nameSelector
) {

  const wrap = document.createElement('div');

  wrap.className = 'sf-search-wrap';

  wrap.innerHTML = `
    <div class="sf-search-box">
      <i class="fa-solid fa-magnifying-glass"></i>

      <input
        type="text"
        id="sf-destination-search-${cardsSelectorId(cardsSelector)}"
        placeholder="Search destinations (e.g. Bamyan, Herat...)"
      >
    </div>

    <p class="sf-search-empty">
      No destinations match your search.
    </p>
  `;


  host.insertBefore(
    wrap,
    beforeEl
  );


  const input = wrap.querySelector('input');

  const emptyMsg = wrap.querySelector(
    '.sf-search-empty'
  );

  const nextBtn = document.querySelector(
    '.next-btn'
  );

  const prevBtn = document.querySelector(
    '.prev-btn'
  );


  input.addEventListener('input', () => {

    const term = input.value
      .trim()
      .toLowerCase();

    const cards = document.querySelectorAll(
      cardsSelector
    );

    let visible = 0;


    cards.forEach((card) => {

      const nameEl = card.querySelector(
        nameSelector
      );

      const name = nameEl
        ? nameEl.textContent.toLowerCase()
        : '';


      const match =
        term === '' ||
        name.includes(term);


      card.style.display = match
        ? ''
        : 'none';


      if (match) {
        visible++;
      }

    });


    emptyMsg.style.display =
      visible === 0
        ? 'block'
        : 'none';


    if (nextBtn && prevBtn) {

      const searching = term !== '';

      nextBtn.style.visibility =
        searching
          ? 'hidden'
          : 'visible';

      prevBtn.style.visibility =
        searching
          ? 'hidden'
          : 'visible';
    }

  });
}


function cardsSelectorId(sel) {
  return sel.replace(
    /[^a-z0-9]/gi,
    ''
  );
}


/* =========================================================================
   FEATURE 6 — Interest Filter
   ========================================================================= */

function initInterestFilter() {

  const chipsWrap =
    document.getElementById('filterChips');

  const cards =
    document.querySelectorAll(
      '.popular-destinations .card'
    );


  if (!chipsWrap || !cards.length) return;


  const chips =
    chipsWrap.querySelectorAll('.chip');


  chips.forEach((chip) => {

    chip.addEventListener('click', (e) => {

      e.preventDefault();

      e.stopPropagation();


      chips.forEach((c) => {
        c.classList.remove(
          'sf-chip-active'
        );
      });


      chip.classList.add(
        'sf-chip-active'
      );


      const filter =
        chip.dataset.filter;


      cards.forEach((card) => {

        const cardFilter =
          card.dataset.filter ||
          'all';


        card.style.display =
          (
            filter === 'all' ||
            cardFilter === filter
          )
            ? ''
            : 'none';

      });


      const searchInput =
        document.querySelector(
          '.sf-search-box input'
        );


      if (searchInput) {
        searchInput.value = '';
      }

    });

  });
}


/* =========================================================================
   FEATURE 7 — Destination Detail Modal
   ========================================================================= */

function initDestinationModal() {

  const cards =
    document.querySelectorAll(
      '.popular-destinations .card, #images > div'
    );


  if (!cards.length) return;


  const modal =
    createModal(
      'sf-destination-modal'
    );


  cards.forEach((card) => {

    card.style.cursor = 'pointer';


    card.addEventListener(
      'click',
      () => {

        const img =
          card.querySelector('img');

        const title =
          card.querySelector('h3');

        const subtitle =
          card.querySelector('.subtitle');

        const location =
          card.querySelector('.location');

        const desc =
          card.querySelector(
            'p:not(.subtitle):not(.location)'
          );


        modal.body.innerHTML = `
          <img
            src="${img ? img.src : ''}"
            alt="${title ? title.textContent : ''}"
            class="sf-modal-img"
          >

          <h2>
            ${title ? title.textContent : 'Destination'}
          </h2>

          ${
            subtitle
              ? `<p class="sf-modal-subtitle">
                   ${subtitle.textContent}
                 </p>`
              : ''
          }

          ${
            location
              ? `<p class="sf-modal-location">
                   ${location.innerHTML}
                 </p>`
              : ''
          }

          ${
            desc
              ? `<p class="sf-modal-desc">
                   ${desc.textContent}
                 </p>`
              : ''
          }

          <button class="sf-modal-plan-btn">
            Plan a Trip Here
          </button>
        `;


        openModal(modal);


        modal.body
          .querySelector(
            '.sf-modal-plan-btn'
          )
          .addEventListener(
            'click',
            () => {

              closeModal(modal);

              const name =
                title
                  ? title.textContent
                  : '';


              if (window.openTripPlanner) {

                window.openTripPlanner(name);

              }

            }
          );

      }
    );

  });
}


/* =========================================================================
   FEATURE 8 — Testimonial Carousel
   ========================================================================= */

function initTestimonialCarousel() {

  const container =
    document.getElementById(
      'testimonial-container'
    );


  if (!container) return;


  const cardEls =
    Array.from(
      container.querySelectorAll(
        '.testimonial-card'
      )
    );


  const arrows =
    container.querySelectorAll(
      '.arrow'
    );


  if (!cardEls.length) return;


  let data =
    cardEls.map((card) => ({

      text:
        card.querySelector('p')
          .innerHTML
          .trim(),

      img:
        card.querySelector(
          '.user-info img'
        ).getAttribute('src'),

      name:
        card.querySelector(
          '.user-info h4'
        ).textContent,

      country:
        card.querySelector(
          '.user-info span'
        ).textContent,

      stars:
        card.querySelector(
          '.stars'
        ).textContent
        .trim()

    }));


  data = data.concat([

    {
      text:
        'Herat\'s old city left me speechless — the architecture and warmth of its people were unforgettable.',

      img:
        data[0].img,

      name:
        'David Chen',

      country:
        'Australia',

      stars:
        '★★★★★'
    },


    {
      text:
        'Our guide made the Wakhan Valley trek safe and unforgettable. A trip I will never forget.',

      img:
        data[0].img,

      name:
        'Fatima Noor',

      country:
        'UAE',

      stars:
        '★★★★★'
    }

  ]);


  let offset = 0;


  function render() {

    cardEls.forEach((card, i) => {

      const d =
        data[
          (offset + i) %
          data.length
        ];


      card.querySelector('p')
        .innerHTML = d.text;


      card.querySelector(
        '.user-info img'
      ).src = d.img;


      card.querySelector(
        '.user-info h4'
      ).textContent = d.name;


      card.querySelector(
        '.user-info span'
      ).textContent = d.country;


      card.querySelector(
        '.stars'
      ).textContent = d.stars;


      card.classList.remove(
        'sf-fade-in'
      );


      void card.offsetWidth;


      card.classList.add(
        'sf-fade-in'
      );

    });

  }


  function next() {

    offset =
      (offset + 1) %
      data.length;

    render();

  }


  function prev() {

    offset =
      (offset - 1 + data.length) %
      data.length;

    render();

  }


  if (arrows[0]) {

    arrows[0].addEventListener(
      'click',
      prev
    );

  }


  if (arrows[1]) {

    arrows[1].addEventListener(
      'click',
      next
    );

  }


  let timer =
    setInterval(
      next,
      6000
    );


  container.addEventListener(
    'mouseenter',
    () => clearInterval(timer)
  );


  container.addEventListener(
    'mouseleave',
    () => {

      timer =
        setInterval(
          next,
          6000
        );

    }
  );

}


/* =========================================================================
   FEATURE 9 — Interactive Gallery Lightbox
   ========================================================================= */

function initGalleryLightbox() {

  const galleryImgs =
    document.querySelectorAll(
      '#gallery .gallery-card img'
    );


  if (!galleryImgs.length) return;


  const modal =
    createModal(
      'sf-gallery-modal'
    );


  const images =
    Array.from(galleryImgs);


  let current = 0;


  function renderImage() {

    const img =
      images[current];


    modal.body.innerHTML = `
      <button
        class="sf-lightbox-nav sf-lightbox-prev"
        aria-label="Previous image"
      >
        &#10094;
      </button>

      <img
        src="${img.src}"
        alt="${img.alt}"
        class="sf-modal-img sf-lightbox-img"
      >

      <button
        class="sf-lightbox-nav sf-lightbox-next"
        aria-label="Next image"
      >
        &#10095;
      </button>

      <p class="sf-lightbox-caption">
        ${img.alt || ''}
        (${current + 1}/${images.length})
      </p>
    `;


    modal.body
      .querySelector(
        '.sf-lightbox-prev'
      )
      .addEventListener(
        'click',
        (e) => {

          e.stopPropagation();


          current =
            (
              current -
              1 +
              images.length
            ) %
            images.length;


          renderImage();

        }
      );


    modal.body
      .querySelector(
        '.sf-lightbox-next'
      )
      .addEventListener(
        'click',
        (e) => {

          e.stopPropagation();


          current =
            (
              current +
              1
            ) %
            images.length;


          renderImage();

        }
      );

  }


  images.forEach((img, i) => {

    img.style.cursor =
      'zoom-in';


    img.addEventListener(
      'click',
      () => {

        current = i;

        renderImage();

        openModal(modal);

      }
    );

  });

}


/* =========================================================================
   FEATURE 10 — Contact Form Validation
   ========================================================================= */

function initContactFormValidation() {

  const form =
    document.getElementById('form');


  if (!form) return;


  if (
    !form.querySelector(
      'button[type="submit"], input[type="submit"]'
    )
  ) {

    const btn =
      document.createElement(
        'button'
      );


    btn.type = 'submit';

    btn.id =
      'sf-contact-submit';

    btn.textContent =
      'Send Message';


    form.appendChild(btn);

  }


  const fields = {

    name:
      form.querySelector('#name'),

    email:
      form.querySelector('#emil'),

    subject:
      form.querySelector('#subject'),

    message:
      form.querySelector('#text')

  };


  if (
    !fields.name ||
    !fields.email ||
    !fields.subject ||
    !fields.message
  ) {
    return;
  }


  function showError(
    field,
    message
  ) {

    clearError(field);


    field.classList.add(
      'sf-input-error'
    );


    const err =
      document.createElement(
        'span'
      );


    err.className =
      'sf-error-msg';


    err.textContent =
      message;


    field.insertAdjacentElement(
      'afterend',
      err
    );

  }


  function clearError(field) {

    field.classList.remove(
      'sf-input-error'
    );


    const next =
      field.nextElementSibling;


    if (
      next &&
      next.classList.contains(
        'sf-error-msg'
      )
    ) {

      next.remove();

    }

  }


  function validate() {

    let valid = true;


    if (
      !fields.name.value.trim()
    ) {

      showError(
        fields.name,
        'Please enter your name.'
      );

      valid = false;

    } else {

      clearError(fields.name);

    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        fields.email.value.trim()
      )
    ) {

      showError(
        fields.email,
        'Please enter a valid email address.'
      );

      valid = false;

    } else {

      clearError(fields.email);

    }


    if (
      !fields.subject.value.trim()
    ) {

      showError(
        fields.subject,
        'Please enter a subject.'
      );

      valid = false;

    } else {

      clearError(fields.subject);

    }


    if (
      fields.message.value
        .trim()
        .length < 10
    ) {

      showError(
        fields.message,
        'Message should be at least 10 characters.'
      );

      valid = false;

    } else {

      clearError(fields.message);

    }


    return valid;
  }


  Object.values(fields).forEach(
    (field) => {

      field.addEventListener(
        'blur',
        validate
      );

    }
  );


  form.addEventListener(
    'submit',
    (e) => {

      if (!validate()) {

        e.preventDefault();

        return;

      }


      const btn =
        form.querySelector(
          '#sf-contact-submit'
        );


      if (btn) {

        btn.disabled = true;

        btn.textContent =
          'Sending...';

      }

    }
  );

}


/* =========================================================================
   FEATURE 12 — Trip Planner Tool
   ========================================================================= */

function initTripPlanner() {

  const planLinks =
    document.querySelectorAll(
      '#plan'
    );


  const modal =
    createModal(
      'sf-trip-modal'
    );


  planLinks.forEach(
    (link) => {

      link.addEventListener(
        'click',
        (e) => {

          e.preventDefault();

          window.openTripPlanner();

        }
      );

    }
  );


  window.openTripPlanner =
    function (
      prefillDestination
    ) {

      modal.body.innerHTML = `

        <h2>Plan Your Trip</h2>

        <p class="sf-trip-sub">
          Tell us what you're looking for and we'll put together a quick itinerary idea.
        </p>


        <form id="sf-trip-form">

          <label>
            Destination
          </label>


          <select id="sf-trip-destination">

            <option value="select your destination">
              Select your destination
            </option>

            <option value="Band-e-Amir">
              Band-e-Amir
            </option>

            <option value="Bamyan">
              Bamyan
            </option>

            <option value="Herat">
              Herat
            </option>

            <option value="Mazar-e-Sharif">
              Mazar-e-Sharif
            </option>

            <option value="Kabul">
              Kabul
            </option>

            <option value="Wakhan Valley">
              Wakhan Valley
            </option>

          </select>


          <label>
            Trip length (days)
          </label>


          <input
            type="number"
            id="sf-trip-days"
            min="1"
            max="30"
            value="5"
          >


          <label>
            Number of travelers
          </label>


          <input
            type="number"
            id="sf-trip-travelers"
            min="1"
            max="20"
            value="2"
          >


          <label>
            Interests
          </label>


          <div class="sf-trip-interests">

            <label>
              <input
                type="checkbox"
                value="nature"
                checked
              >
              Nature
            </label>


            <label>
              <input
                type="checkbox"
                value="historical"
              >
              Historical
            </label>


            <label>
              <input
                type="checkbox"
                value="religious"
              >
              Religious
            </label>


            <label>
              <input
                type="checkbox"
                value="camping"
              >
              Camping
            </label>

          </div>


          <button type="submit">
            Generate My Itinerary
          </button>

        </form>


        <div id="sf-trip-result"></div>

      `;


      if (prefillDestination) {

        const select =
          modal.body.querySelector(
            '#sf-trip-destination'
          );


        const opt =
          Array.from(
            select.options
          ).find(
            (o) =>
              prefillDestination.includes(
                o.value
              ) ||
              o.value.includes(
                prefillDestination
              )
          );


        if (opt) {

          select.value =
            opt.value;

        }

      }


      openModal(modal);


      modal.body
        .querySelector(
          '#sf-trip-form'
        )
        .addEventListener(
          'submit',
          (e) => {

            e.preventDefault();


            const destination =
              modal.body.querySelector(
                '#sf-trip-destination'
              ).value;


            const days =
              modal.body.querySelector(
                '#sf-trip-days'
              ).value;


            const travelers =
              modal.body.querySelector(
                '#sf-trip-travelers'
              ).value;


            const interests =
              Array.from(
                modal.body.querySelectorAll(
                  '.sf-trip-interests input:checked'
                )
              ).map(
                (cb) => cb.value
              );


            modal.body.querySelector(
              '#sf-trip-result'
            ).innerHTML = `

              <div class="sf-trip-summary">

                <h3>
                  Your ${days}-Day ${destination} Trip
                </h3>


                <p>
                  <strong>
                    Travelers:
                  </strong>
                  ${travelers}
                </p>


                <p>
                  <strong>
                    Focus:
                  </strong>
                  ${
                    interests.length
                      ? interests.join(', ')
                      : 'General sightseeing'
                  }
                </p>


                <ul>

                  <li>
                    Day 1: Arrival in ${destination}
                    and orientation walk.
                  </li>


                  <li>
                    Days 2–${Math.max(
                      2,
                      Number(days) - 1
                    )}:
                    Guided exploration based on your interests.
                  </li>


                  <li>
                    Day ${days}: Departure.
                  </li>

                </ul>


                <p class="sf-trip-note">
                  This is a sample plan for your trip —
                  contact us to customize it further.
                </p>

              </div>

            `;

          }
        );

    };

}


/* =========================================================================
   FEATURE 13 — Image Hover Zoom + Fade-in Load Effect
   ========================================================================= */

function initImageEffects() {

  const imgs =
    document.querySelectorAll(
      '.popular-destinations .card img, #images img, #gallery img'
    );


  imgs.forEach((img) => {

    if (img.complete) {

      img.classList.add(
        'sf-img-loaded'
      );

    } else {

      img.addEventListener(
        'load',
        () => {

          img.classList.add(
            'sf-img-loaded'
          );

        }
      );

    }

  });

}