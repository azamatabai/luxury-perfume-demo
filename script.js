// =========================================
// НАСТРОЙКИ МАГАЗИНА
// Меняйте значения здесь
// =========================================

// Название магазина — подставится в шапку и подвал
const SHOP_NAME = 'Luxury Perfume';

// ДЕМО-ВЕРСИЯ ДЛЯ ПОРТФОЛИО: номера телефона нет, заказы не отправляются.
// Кнопки заказа и WhatsApp показывают уведомление «Это демонстрационный сайт».

// Список товаров. Чтобы добавить товар — скопируйте блок { ... } и измените данные.
// id — уникальное имя товара латиницей (по нему корзина узнаёт товар, не повторяйте!)
// photo — номер фотографии на Unsplash (бесплатная лицензия: unsplash.com/license)
const products = [
  {
    id: 'oud-royal',
    brand: 'Maison Noir',
    name: 'Oud Royal',
    notes: 'Уд, шафран, роза, амбра',
    volume: '100 мл',
    price: 89000,
    photo: '1693960794603-d24c61146757',
    badge: 'Хит'
  },
  {
    id: 'golden-night',
    brand: 'Aurum',
    name: 'Golden Night',
    notes: 'Ваниль, бергамот, сандал',
    volume: '75 мл',
    price: 64500,
    photo: '1588405748880-12d1d2a59f75',
    badge: ''
  },
  {
    id: 'black-orchid',
    brand: 'Velours',
    name: 'Black Orchid',
    notes: 'Чёрная орхидея, трюфель, пачули',
    volume: '100 мл',
    price: 72000,
    photo: '1586858249274-7922b9e404ac',
    badge: 'Новинка'
  },
  {
    id: 'rose-elixir',
    brand: 'Lumière',
    name: 'Rose Élixir',
    notes: 'Болгарская роза, личи, мускус',
    volume: '50 мл',
    price: 48900,
    photo: '1615160460366-2c9a41771b51',
    badge: ''
  },
  {
    id: 'silk-road',
    brand: 'Steppe',
    name: 'Silk Road',
    notes: 'Кожа, табак, кардамон, кедр',
    volume: '100 мл',
    price: 95000,
    photo: '1617661338085-d1ec6a89a6d8',
    badge: 'Эксклюзив'
  },
  {
    id: 'ocean-pearl',
    brand: 'Azure',
    name: 'Ocean Pearl',
    notes: 'Морская соль, нероли, белый мускус',
    volume: '75 мл',
    price: 56000,
    photo: '1608721279136-cd41b752fa41',
    badge: ''
  }
];

// =========================================
// ДАЛЬШЕ — КОД, КОТОРЫЙ ВСЁ ЗАПУСКАЕТ
// =========================================

// Превращает 89000 в «89 000»
function formatPrice(price) {
  return price.toLocaleString('ru-RU');
}

// Адрес фото нужного размера. Unsplash сам уменьшает картинку и отдаёт
// лёгкий формат (WebP/AVIF), поэтому страница грузится быстрее.
function photoUrl(id, width) {
  return 'https://images.unsplash.com/photo-' + id +
    '?auto=format&fit=crop&w=' + width + '&h=' + Math.round(width * 1.15) + '&q=70';
}

// 1. Подставляем название магазина везде, где стоит класс shop-name
document.querySelectorAll('.shop-name').forEach(function (el) {
  el.textContent = SHOP_NAME;
});
document.title = SHOP_NAME + ' — демо-проект магазина парфюмерии';

// 2. Рисуем карточки товаров
const productsContainer = document.getElementById('products');

products.forEach(function (product) {
  const badge = product.badge
    ? '<span class="card__badge">' + product.badge + '</span>'
    : '';

  const card = document.createElement('article');
  card.className = 'card reveal';
  card.innerHTML =
    badge +
    '<div class="card__image">' +
      // loading="lazy" — фото грузится, только когда до него докрутили
      '<img loading="lazy" decoding="async" width="400" height="460"' +
        // Браузер сам выберет размер под экран: телефону — поменьше, большому экрану — побольше
        ' src="' + photoUrl(product.photo, 480) + '"' +
        ' srcset="' + [320, 480, 640, 800].map(function (w) {
          return photoUrl(product.photo, w) + ' ' + w + 'w';
        }).join(', ') + '"' +
        ' sizes="(max-width: 600px) min(90vw, 420px), (max-width: 992px) 45vw, 380px"' +
        ' alt="Флакон аромата ' + product.name + '">' +
    '</div>' +
    '<div class="card__body">' +
      '<p class="card__brand">' + product.brand + '</p>' +
      '<h3 class="card__title">' + product.name + '</h3>' +
      '<p class="card__notes">' + product.notes + '</p>' +
      '<p class="card__price">' + formatPrice(product.price) + ' ₸ <small>/ ' + product.volume + '</small></p>' +
      // Один путь заказа: «В корзину» → корзина → «Оформить заказ» → WhatsApp
      '<div class="card__actions">' +
        // data-id — «наклейка» с id товара: по ней скрипт поймёт, что класть в корзину
        '<button type="button" class="btn btn--gold js-add-to-cart" data-id="' + product.id + '">' +
          'В корзину' +
        '</button>' +
      '</div>' +
    '</div>';

  productsContainer.appendChild(card);
});

// Если фото не загрузилось (нет интернета) — показываем красивый золотой фон
document.querySelectorAll('img').forEach(function (img) {
  img.addEventListener('error', function () {
    img.parentElement.classList.add('img-fallback');
    img.remove();
  });
  // Плавное проявление фото после загрузки
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', function () { img.classList.add('loaded'); });
  }
});

// 4. Шапка становится тёмной при прокрутке + полоса прогресса сверху.
// requestAnimationFrame — чтобы прокрутка не тормозила на слабых телефонах.
const header = document.getElementById('header');
const progress = document.getElementById('progress');
const glow = document.querySelector('.hero__glow');
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('scrolled', y > 50);
  progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  // Лёгкий эффект параллакса: свечение уходит медленнее, чем страница
  if (glow && y < window.innerHeight) {
    glow.style.translate = '0 ' + y * 0.3 + 'px';
  }
  ticking = false;
}

window.addEventListener('scroll', function () {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });
onScroll();

// 5. Мобильное меню (бургер)
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('overlay');

function setMenu(open) {
  burger.classList.toggle('open', open);
  nav.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open); // страница не прокручивается под меню
  burger.setAttribute('aria-expanded', open);
}

burger.addEventListener('click', function () {
  setMenu(!nav.classList.contains('open'));
});

// Закрываем меню: по пункту меню, по тёмному фону, по клавише Esc
document.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});
overlay.addEventListener('click', function () { setMenu(false); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') setMenu(false);
});

// 6. Плавное появление элементов при прокрутке
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add('visible');
      observer.unobserve(el);
      // Убираем задержку после появления, чтобы эффекты при наведении срабатывали сразу
      setTimeout(function () { el.style.transitionDelay = '0s'; }, 1400);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach(function (el, index) {
  // Небольшая задержка, чтобы соседние элементы появлялись по очереди
  el.style.transitionDelay = (index % 3) * 0.12 + 's';
  observer.observe(el);
});

// =========================================
// 7. КОРЗИНА
// =========================================

// Под этим именем корзина хранится в localStorage браузера
const CART_KEY = 'luxuryPerfumeCart';
const MAX_QTY = 99;

// Найти товар в каталоге по его id
function findProduct(id) {
  return products.find(function (p) { return p.id === id; });
}

// Корзина — это список вида: [{ id: 'oud-royal', qty: 2 }, { id: 'silk-road', qty: 1 }]
// Цены и названия в корзине не храним — берём их из каталога, так они всегда актуальны.
let cart = loadCart();

// Достаём корзину из localStorage (если её там нет — начинаем с пустой)
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(saved)) return [];
    // Отбрасываем товары, которых больше нет в каталоге, и неправильное количество.
    // Если один товар записан дважды — объединяем в одну строку.
    const result = [];
    saved.forEach(function (item) {
      if (!item || !findProduct(item.id) || !Number.isInteger(item.qty) || item.qty <= 0) return;
      const same = result.find(function (i) { return i.id === item.id; });
      if (same) {
        same.qty = Math.min(same.qty + item.qty, MAX_QTY);
      } else {
        result.push({ id: item.id, qty: Math.min(item.qty, MAX_QTY) });
      }
    });
    return result;
  } catch (e) {
    return []; // localStorage недоступен или данные испорчены
  }
}

// Кладём корзину в localStorage (JSON.stringify превращает список в текст)
function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    // Например, в режиме инкогнито с запретом хранилища — корзина просто не запомнится
  }
}

// id товара, который только что появился в корзине (только его показываем с анимацией)
let newItemId = null;

// Возвращает false, если добавить нельзя (уже максимум)
function addToCart(id) {
  const item = cart.find(function (i) { return i.id === id; });
  if (item) {
    if (item.qty >= MAX_QTY) return false;
    item.qty += 1;                  // товар уже есть — увеличиваем количество
  } else {
    cart.push({ id: id, qty: 1 });  // товара нет — добавляем
    newItemId = id;
  }
  updateCart();
  return true;
}

// delta = +1 или -1
function changeQty(id, delta) {
  const item = cart.find(function (i) { return i.id === id; });
  if (!item) return;
  item.qty = Math.min(item.qty + delta, MAX_QTY);
  if (item.qty <= 0) {
    removeFromCart(id); // уменьшили до нуля — убираем товар
    return;
  }
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (i) { return i.id !== id; });
  updateCart();
}

// Общая сумма: цена × количество для каждого товара, всё складываем
function getTotal() {
  return cart.reduce(function (sum, item) {
    return sum + findProduct(item.id).price * item.qty;
  }, 0);
}

// Сколько всего штук в корзине (для значка на кнопке)
function getCount() {
  return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
}

// Каждый раз после изменения: сохраняем и перерисовываем
function updateCart() {
  saveCart();
  renderCart();
}

const cartEl = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Рисуем содержимое корзины заново по списку cart
function renderCart() {
  // Запоминаем, на какой кнопке стоял фокус: после перерисовки вернём его на место,
  // иначе с клавиатуры после каждого «+» приходилось бы снова искать кнопку
  const focused = document.activeElement;
  const focusAction = cartList.contains(focused) ? focused.dataset.action : null;
  const focusId = focusAction ? focused.dataset.id : null;

  cartList.innerHTML = '';

  cart.forEach(function (item) {
    const product = findProduct(item.id);
    const li = document.createElement('li');
    // Анимация «въезда» — только у нового товара, а не у всех при каждом «+»
    li.className = 'cart-item' + (item.id === newItemId ? ' cart-item--new' : '');
    li.innerHTML =
      '<img class="cart-item__img" src="' + photoUrl(product.photo, 120) + '" width="64" height="74" alt="" loading="lazy">' +
      '<div class="cart-item__info">' +
        '<p class="cart-item__name">' + product.name + '</p>' +
        '<p class="cart-item__price">' + formatPrice(product.price) + ' ₸ · ' + product.volume + '</p>' +
        '<div class="qty">' +
          '<button type="button" class="qty__btn" data-action="minus" data-id="' + product.id + '" aria-label="Уменьшить количество">−</button>' +
          '<span class="qty__value">' + item.qty + '</span>' +
          '<button type="button" class="qty__btn" data-action="plus" data-id="' + product.id + '" aria-label="Увеличить количество"' +
            (item.qty >= MAX_QTY ? ' disabled' : '') + '>+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-item__side">' +
        '<button type="button" class="cart-item__remove" data-action="remove" data-id="' + product.id + '" aria-label="Удалить ' + product.name + '">✕</button>' +
        '<p class="cart-item__sum">' + formatPrice(product.price * item.qty) + ' ₸</p>' +
      '</div>';
    cartList.appendChild(li);
  });
  newItemId = null;

  // Возвращаем фокус: на ту же кнопку, а если товар удалён — на кнопку закрытия
  if (focusAction) {
    const same = cartList.querySelector('[data-action="' + focusAction + '"][data-id="' + focusId + '"]');
    if (same && !same.disabled) {
      same.focus();
    } else {
      document.getElementById('cartClose').focus();
    }
  }

  const isEmpty = cart.length === 0;
  cartEmpty.hidden = !isEmpty;
  cartFooter.hidden = isEmpty;
  checkoutBtn.disabled = isEmpty;
  cartTotal.textContent = formatPrice(getTotal()) + ' ₸';

  const count = getCount();
  cartCount.textContent = count;
  cartCount.classList.toggle('show', count > 0);
}

// Один обработчик на весь список: смотрим, какую кнопку нажали (data-action)
cartList.addEventListener('click', function (e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'plus') changeQty(id, 1);
  if (btn.dataset.action === 'minus') changeQty(id, -1);
  if (btn.dataset.action === 'remove') removeFromCart(id);
});

// Кнопки «В корзину» на карточках
document.querySelectorAll('.js-add-to-cart').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const added = addToCart(btn.dataset.id);

    // Короткая подсказка на кнопке: добавлено или уже максимум
    btn.textContent = added ? 'Добавлено ✓' : 'Максимум ' + MAX_QTY + ' шт.';
    btn.classList.toggle('added', added);
    clearTimeout(btn._timer);
    btn._timer = setTimeout(function () {
      btn.textContent = 'В корзину';
      btn.classList.remove('added');
    }, 1300);

    // Значок корзины «подпрыгивает»
    cartCount.classList.remove('bump');
    void cartCount.offsetWidth; // перезапуск анимации
    cartCount.classList.add('bump');
  });
});

// Окна появляются плавно и в первый момент ещё невидимы, а в невидимый элемент
// браузер фокус не отдаёт. Поэтому передаём фокус с небольшой задержкой.
function focusSoon(el) {
  setTimeout(function () { el.focus(); }, 80);
}

// Открыть / закрыть корзину
const cartToggle = document.getElementById('cartToggle');

function setCart(open) {
  const wasOpen = cartEl.classList.contains('open');
  if (open === wasOpen) return; // уже в нужном состоянии — ничего не делаем
  if (open) setMenu(false); // мобильное меню и корзина одновременно не открываются
  cartEl.classList.toggle('open', open);
  cartOverlay.classList.toggle('open', open);
  cartEl.setAttribute('aria-hidden', !open);
  cartToggle.setAttribute('aria-expanded', open);
  document.body.classList.toggle('no-scroll', open);
  // Фокус: при открытии — на кнопку «закрыть», при закрытии — обратно на значок корзины
  if (open) {
    focusSoon(document.getElementById('cartClose'));
  } else if (cartEl.contains(document.activeElement)) {
    cartToggle.focus();
  }
}

cartToggle.addEventListener('click', function () { setCart(true); });
document.getElementById('cartClose').addEventListener('click', function () { setCart(false); });
cartOverlay.addEventListener('click', function () { setCart(false); });

// Если корзину изменили в другой вкладке браузера — обновляем и здесь
window.addEventListener('storage', function (e) {
  if (e.key === CART_KEY) {
    cart = loadCart();
    renderCart();
  }
});

renderCart();

// =========================================
// 8. ДЕМО-УВЕДОМЛЕНИЕ ВМЕСТО ЗАКАЗА
// «Оформить заказ» и кнопки WhatsApp показывают окно:
// «Это демонстрационный сайт. Реальные заказы не принимаются».
// Корзина при этом не очищается. Личные данные не запрашиваются.
// =========================================
const modal = document.getElementById('demoModal');
let returnFocusTo = null; // куда вернуть фокус после закрытия окна

function setModal(open) {
  if (open === modal.classList.contains('open')) return;
  modal.classList.toggle('open', open);
  modal.setAttribute('aria-hidden', !open);
  document.body.classList.toggle('no-scroll', open);
  if (open) {
    focusSoon(document.getElementById('demoOk'));
  } else if (returnFocusTo) {
    returnFocusTo.focus(); // после закрытия окна фокус не «теряется»
  }
}

function showDemoNotice(opener) {
  setCart(false);
  returnFocusTo = opener;
  setModal(true);
}

checkoutBtn.addEventListener('click', function () {
  if (cart.length === 0) return;
  showDemoNotice(cartToggle);
});

// Кнопка «Написать в WhatsApp» в контактах и круглая кнопка внизу экрана
document.querySelectorAll('.js-demo').forEach(function (btn) {
  btn.addEventListener('click', function () { showDemoNotice(btn); });
});

document.getElementById('modalClose').addEventListener('click', function () { setModal(false); });
document.getElementById('demoOk').addEventListener('click', function () { setModal(false); });
// Клик по тёмному фону вокруг окна тоже закрывает его
modal.addEventListener('click', function (e) {
  if (e.target === modal) setModal(false);
});

// Esc закрывает корзину и окно заказа
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    setCart(false);
    setModal(false);
  }
});

// Скрипт дошёл до конца без ошибок — анимации появления можно оставить включёнными
// (см. «страховку от чёрного экрана» в index.html)
window.siteReady = true;
