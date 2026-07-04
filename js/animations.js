// ============================================
// animations.js — Оживление Nike Air Mag лендинга
// ============================================

// ============================================
// 1. PRELOADER — экран загрузки
// ============================================
function initPreloader() {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = '<div class="preloader__spinner"></div>';
  document.body.prepend(preloader);

  let minDelayDone = false;
  let imagesLoaded = false;

  const hidePreloader = () => {
    if (minDelayDone && imagesLoaded) {
      preloader.classList.add('preloader--hidden');
      setTimeout(() => preloader.remove(), 500);
    }
  };

  // Минимальная задержка 1.5s для плавности
  setTimeout(() => {
    minDelayDone = true;
    hidePreloader();
  }, 1500);

  // Ждём загрузки всех изображений
  const images = document.querySelectorAll('img');
  let loadedCount = 0;
  const totalImages = images.length;

  if (totalImages === 0) {
    imagesLoaded = true;
    hidePreloader();
  } else {
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount >= totalImages) {
          imagesLoaded = true;
          hidePreloader();
        }
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount >= totalImages) {
            imagesLoaded = true;
            hidePreloader();
          }
        });
        img.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount >= totalImages) {
            imagesLoaded = true;
            hidePreloader();
          }
        });
      }
    });
  }
}

// ============================================
// 2. SMOOTH SCROLL — плавный скролл к секциям
// ============================================
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// ============================================
// 3. SCROLL REVEAL — появление элементов при скролле
// ============================================
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Задержка для каскадного эффекта у карточек
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('reveal--visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// ============================================
// 4. HEADER SCROLL BEHAVIOR — умный хедер
// ============================================
function initHeaderBehavior() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = 0;
  let ticking = false;

  const updateHeader = () => {
    const scrollY = window.scrollY;

    // Не скрываем хедер при открытом бургер-меню
    const menuOpen = document.querySelector('.header__menu--open');
    if (menuOpen) {
      header.classList.remove('header--hidden');
      lastScrollY = scrollY;
      ticking = false;
      return;
    }

    // Скрываем при скролле вниз (порог 100px)
    if (scrollY > 100 && scrollY > lastScrollY) {
      header.classList.add('header--hidden');
    }
    // Показываем при скролле вверх
    else if (scrollY < lastScrollY) {
      header.classList.remove('header--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

// ============================================
// 5. PARALLAX HERO — параллакс-эффект на hero
// ============================================
function initParallax() {
  // Только для десктопа
  if (window.innerWidth <= 768) return;

  const heroImg = document.querySelector('.hero__img');
  if (!heroImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroSection = document.querySelector('.hero');
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        // Параллакс работает только пока hero видна
        if (scrollY < heroBottom) {
          const offset = scrollY * 0.3;
          heroImg.style.transform = `translateX(-50%) translateY(${offset}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================================
// 6. SCROLL-TO-TOP — кнопка "наверх"
// ============================================
function initScrollToTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Наверх');
  btn.setAttribute('title', 'Наверх');
  btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  document.body.appendChild(btn);

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 500) {
          btn.classList.add('scroll-top--visible');
        } else {
          btn.classList.remove('scroll-top--visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// 7. FORM VALIDATION — валидация формы заказа
// ============================================
function initFormValidation() {
  const form = document.querySelector('.modal-buy__form');
  if (!form) return;

  const fields = {
    name: {
      el: form.querySelector('[name="name"]'),
      validate: (v) => v.trim().length >= 2,
      message: 'Введите минимум 2 символа',
    },
    phone: {
      el: form.querySelector('[name="phone"]'),
      validate: (v) => /^(\+7|8)[0-9]{10}$/.test(v.replace(/[\s\-\(\)]/g, '')),
      message: 'Введите корректный номер телефона',
    },
    email: {
      el: form.querySelector('[name="email"]'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Введите корректный e-mail',
    },
  };

  // Убираем ошибку при вводе
  Object.values(fields).forEach((field) => {
    field.el.addEventListener('input', () => {
      clearFieldError(field.el);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    Object.values(fields).forEach((field) => {
      clearFieldError(field.el);
      if (!field.validate(field.el.value)) {
        showFieldError(field.el, field.message);
        isValid = false;
      }
    });

    if (isValid) {
      // Показываем сообщение об успехе
      const content = form.closest('.modal-buy__content');
      const successMsg = document.createElement('div');
      successMsg.className = 'modal-buy__success';
      successMsg.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#ffea00" stroke-width="2"/>
          <polyline points="20,34 28,42 44,24" stroke="#ffea00" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="modal-buy__success-text">Заявка отправлена!</p>
        <p class="modal-buy__success-sub">Мы свяжемся с вами в ближайшее время</p>
      `;

      form.style.display = 'none';
      content.appendChild(successMsg);

      // Автозакрытие через 2s
      setTimeout(() => {
        const closeBtn = document.querySelector('[data-modal-close]');
        if (closeBtn) closeBtn.click();

        // Сброс формы через 500ms после закрытия
        setTimeout(() => {
          form.reset();
          form.style.display = '';
          successMsg.remove();
        }, 500);
      }, 2000);
    }
  });

  function showFieldError(input, message) {
    input.classList.add('input-error');
    const errorEl = document.createElement('div');
    errorEl.className = 'input-error-message';
    errorEl.textContent = message;
    input.parentElement.appendChild(errorEl);
  }

  function clearFieldError(input) {
    input.classList.remove('input-error');
    const errorEl = input.parentElement.querySelector('.input-error-message');
    if (errorEl) errorEl.remove();
  }
}

// ============================================
// 8. CART COUNTER — счётчик корзины
// ============================================
function initCartCounter() {
  const cartButton = document.querySelector('.product__cart-button');
  const headerActions = document.querySelector('.header__actions');
  if (!cartButton || !headerActions) return;

  // Создаём бейдж на иконке корзины в хедере
  const cartHeaderBtn = headerActions.querySelectorAll('.header__actions-button')[1]; // вторая кнопка = корзина
  if (!cartHeaderBtn) return;

  cartHeaderBtn.style.position = 'relative';
  const badge = document.createElement('span');
  badge.className = 'cart-badge';
  badge.textContent = '0';
  badge.style.display = 'none';
  cartHeaderBtn.appendChild(badge);

  let count = 0;

  cartButton.addEventListener('click', () => {
    count++;
    badge.textContent = count;
    badge.style.display = 'flex';

    // Анимация пульсации
    badge.classList.remove('cart-badge--pulse');
    void badge.offsetWidth; // reflow для перезапуска анимации
    badge.classList.add('cart-badge--pulse');
  });
}

// ============================================
// 9. BUTTON RIPPLE — эффект ripple на кнопках
// ============================================
function initRipple() {
  const buttons = document.querySelectorAll(
    '.product__sizes-button, .product__buy-button, .product__cart-button, .modal-buy__submit'
  );

  buttons.forEach((btn) => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
      ripple.style.marginLeft = `-${Math.max(rect.width, rect.height) / 2}px`;
      ripple.style.marginTop = `-${Math.max(rect.width, rect.height) / 2}px`;

      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ============================================
// 10. STATS COUNTER — анимация счётчиков (заготовка)
// ============================================
function animateCounter(element, target, duration = 2000) {
  let start = null;
  const initial = 0;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    element.textContent = Math.floor(eased * (target - initial) + initial);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function initStatsCounter() {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter, 10);
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

// ============================================
// ГЛАВНАЯ ФУНКЦИЯ — экспорт для index.js
// ============================================
export function initAnimations() {
  try {
    initPreloader();
    initSmoothScroll();
    initScrollReveal();
    initHeaderBehavior();
    initParallax();
    initScrollToTop();
    initFormValidation();
    initCartCounter();
    initRipple();
    initStatsCounter();
  } catch (error) {
    console.error('Animations init error:', error);
  }
}
