/*
  단픽 공동구매 마켓 기본형
  - 상품을 수정하려면 아래 products 배열만 바꾸면 됩니다.
  - GitHub Pages에 올리면 카카오톡에 URL 공유가 가능합니다.
  - 실제 카드 결제는 Toss Payments / PortOne 같은 PG 연동과 서버가 추가로 필요합니다.
*/
const products = [
  {
    id: 1,
    category: "밀키트",
    name: "더진한 마라탕 (880g/냉장) 1팩",
    pickup: "7/3(금) 픽업",
    remain: 0,
    state: "마감",
    price: 17900,
    image: "assets/product-marathon.svg"
  },
  {
    id: 2,
    category: "밀키트",
    name: "강릉댁 서래기코다리(냉동) 1팩 (900g)",
    pickup: "7/10(금) 픽업",
    remain: 0,
    state: "마감",
    price: 10900,
    image: "assets/product-fish.svg"
  },
  {
    id: 3,
    category: "밀키트",
    name: "강릉댁 봉봉쭈꾸미(냉동) 1팩 (600g/2인)",
    pickup: "7/3(금) 픽업",
    remain: 0,
    state: "마감",
    price: 11900,
    image: "assets/product-octopus.svg"
  },
  {
    id: 4,
    category: "기타",
    name: "라이스 브리또 (냉동) 5개 세트",
    pickup: "7/3(금) 픽업",
    remain: 8,
    state: "판매중",
    price: 13900,
    image: "assets/product-burrito.svg"
  },
  {
    id: 5,
    category: "과일",
    name: "초당옥수수(국산) 1봉(5개)",
    pickup: "7/3(금) 픽업",
    remain: 12,
    state: "판매중",
    price: 5900,
    image: "assets/product-corn.svg"
  },
  {
    id: 6,
    category: "밀키트",
    name: "세월낙지 낙지볶음 (450g/냉동) 1팩",
    pickup: "7/3(금) 픽업",
    remain: 6,
    state: "판매중",
    price: 10000,
    image: "assets/product-nakji.svg"
  }
];

let currentCategory = "주문가능";
let currentPage = "home";
let cart = JSON.parse(localStorage.getItem("dampick_cart") || "{}");

const productList = document.getElementById("productList");
const cartPage = document.getElementById("cartPage");
const checkoutPage = document.getElementById("checkoutPage");
const pickupPage = document.getElementById("pickupPage");
const myPage = document.getElementById("myPage");
const mainView = document.getElementById("mainView");
const paybar = document.getElementById("paybar");
const cartTotal = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");
const toast = document.getElementById("toast");

function won(value) {
  return value.toLocaleString("ko-KR") + "원";
}

function isOrderable(product) {
  return product.state === "판매중" && product.remain > 0;
}

function saveCart() {
  localStorage.setItem("dampick_cart", JSON.stringify(cart));
  updateSummary();
}

function getCartItems() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ ...products.find(p => p.id === Number(id)), qty }))
    .filter(item => item.id && item.qty > 0 && isOrderable(item));
}

function getTotal() {
  return getCartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateSummary() {
  const count = getCartItems().reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = count;
  cartBadge.style.display = count ? "grid" : "none";
  cartTotal.textContent = won(getTotal());
}

function renderProducts() {
  const list = products.filter(p => {
  if (currentCategory === "주문가능") return p.state !== "픽업완료";
  if (currentCategory === "주문마감") return p.state === "픽업완료";
  return p.state !== "픽업완료";
});
  productList.innerHTML = list.map(p => {
    const qty = cart[p.id] || 0;
    return `
      <article class="product-card">
        <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="product-info">
          <div class="product-top">
            <h2 class="product-title">${p.name}</h2>
            <button class="heart" type="button" aria-label="찜하기">♡</button>
          </div>
         <p class="meta pickup-date">${p.pickup}</p>

${isOrderable(p) ? `<p class="meta remain-count">남은 수량: ${p.remain}개</p>` : ""}

<div class="qty-line">
  <strong class="price">${won(p.price)}</strong>
  ${isOrderable(p) ? stepper(p.id, qty) : `<span class="soldout">주문 마감</span>`}
</div>
        </div>
      </article>
    `;
  }).join("");
}

function stepper(id, qty) {
  if (!qty) {
    return `<div class="stepper"><button type="button" data-minus="${id}">−</button><span>${qty}</span><button type="button" data-plus="${id}">＋</button></div>`;
  }
  return `<div class="stepper"><button type="button" data-minus="${id}">−</button><span>${qty}</span><button type="button" data-plus="${id}">＋</button></div>`;
}

function changeQty(id, delta) {
  const product = products.find(p => p.id === id);
  if (!product || !isOrderable(product)) return;
  const next = Math.max(0, Math.min(product.remain, (cart[id] || 0) + delta));
  if (next === 0) delete cart[id];
  else cart[id] = next;
  saveCart();
  renderProducts();
  if (currentPage === "cart") renderCart();
  if (currentPage === "checkout") renderCheckout();
}

function renderCart() {
  const items = getCartItems();
  cartPage.innerHTML = pageTitle("장바구니") + (items.length ? `
    <div class="list-panel">
      ${items.map(item => `
        <div class="cart-row">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <div class="row-title">${item.name}</div>
            <div class="row-sub">${won(item.price)} x ${item.qty}개 = ${won(item.price * item.qty)}</div>
            <div class="cart-actions">
              ${stepper(item.id, item.qty)}
              <button class="remove-btn" type="button" data-remove="${item.id}">삭제</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>` : emptyBox("장바구니가 비어 있습니다", "홈에서 상품 수량을 선택해 주세요."));
}

function renderCheckout() {
  const items = getCartItems();
  if (!items.length) {
    checkoutPage.innerHTML = pageTitle("결제하기") + emptyBox("결제할 상품이 없습니다", "상품을 먼저 담아 주세요.");
    return;
  }
  checkoutPage.innerHTML = `
    ${pageTitle("결제하기")}
    <div class="checkout-block">
      <div class="checkout-field"><span class="checkout-label">주문자</span><button class="edit-small" type="button">수정</button></div>
    </div>
    <div class="checkout-block">
      <div class="checkout-label">픽업지</div>
      <div class="checkout-field">탑프레부동산(안양어반포레)</div>
    </div>
    <div class="checkout-block">
      <div class="checkout-label">픽업일</div>
      <div class="checkout-field">내일 픽업(06월26일)</div>
    </div>
    <div class="list-panel">
      ${items.map(item => `
        <div class="checkout-row">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <div class="row-title">${item.name}</div>
            <div class="row-sub">${won(item.price)} x ${item.qty}개 = ${won(item.price * item.qty)}</div>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="checkout-block">
      <div class="checkout-field"><span>포인트 : 0원</span><span>0원 사용</span><button class="edit-small" type="button" disabled>사용</button></div>
    </div>
    <div class="checkout-block">
      <label class="payment-option"><input type="radio" name="pay" checked /> 카드 간편 결제</label>
      <label class="payment-option"><input type="radio" name="pay" /> 일반 결제</label>
      <label class="payment-option"><input type="radio" name="pay" /> 현장 결제/계좌이체</label>
    </div>
    <div class="fixed-checkout"><button id="completePayBtn" type="button">${won(getTotal())} 결제하기</button></div>
  `;
}

function renderPickup() {
  const orders = JSON.parse(localStorage.getItem("dampick_orders") || "[]");
  pickupPage.innerHTML = pageTitle("픽업예정") + (orders.length ? `
    <div class="list-panel">
      ${orders.map(order => `
        <div class="checkout-block">
          <div class="checkout-label">주문번호 ${order.no}</div>
          <div class="checkout-field">${order.date}</div>
          <div class="row-sub">${order.items.map(i => `${i.name} ${i.qty}개`).join(" / ")}</div>
          <strong class="price">${won(order.total)}</strong>
        </div>
      `).join("")}
    </div>` : emptyBox("픽업 예정 상품이 없습니다", "결제 완료 후 이곳에서 확인됩니다."));
}

function renderMy() {
  myPage.innerHTML = pageTitle("마이") + `
    <div class="my-card">
      <h3>DAMPICK 단픽</h3>
      <p>공동구매 상품을 카카오톡 URL로 공유하고, 고객이 바로 상품 확인/장바구니/결제까지 진행하는 기본 앱 화면입니다.</p>
      <button class="kakao-share" type="button" id="copyUrlBtn">카카오톡 공유용 URL 복사</button>
    </div>
    <div class="my-card">
      <h3>운영자 메모</h3>
      <p>상품 등록은 현재 <b>app.js</b>의 products 배열에서 수정하는 방식입니다. 실제 결제 연동은 PG사 계약 후 서버 개발이 필요합니다.</p>
    </div>
  `;
}

function pageTitle(title) {
  return `<div class="page-title"><button type="button" data-back>‹</button>${title}</div>`;
}

function emptyBox(title, text) {
  return `<div class="empty"><strong>${title}</strong><span>${text}</span></div>`;
}

function setPage(page) {
  currentPage = page;
  mainView.classList.toggle("hidden", page !== "home");
  cartPage.classList.toggle("hidden", page !== "cart");
  checkoutPage.classList.toggle("hidden", page !== "checkout");
  pickupPage.classList.toggle("hidden", page !== "pickup");
  myPage.classList.toggle("hidden", page !== "my");
  paybar.classList.toggle("hidden", page === "checkout" || page === "pickup" || page === "my");
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.page === (page === "checkout" ? "cart" : page)));
  if (page === "cart") renderCart();
  if (page === "checkout") renderCheckout();
  if (page === "pickup") renderPickup();
  if (page === "my") renderMy();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1900);
}

document.addEventListener("click", (event) => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");
  const back = event.target.closest("[data-back]");
  const nav = event.target.closest(".nav-item");

  if (plus) changeQty(Number(plus.dataset.plus), 1);
  if (minus) changeQty(Number(minus.dataset.minus), -1);
  if (remove) { delete cart[remove.dataset.remove]; saveCart(); renderProducts(); renderCart(); }
  if (back) setPage("home");
  if (nav) setPage(nav.dataset.page);

  if (event.target.id === "openCartBtn") setPage("cart");
  if (event.target.id === "goCheckoutBtn") {
    if (!getCartItems().length) return showToast("먼저 상품을 담아 주세요.");
    setPage("checkout");
  }
  if (event.target.id === "completePayBtn") {
    const orders = JSON.parse(localStorage.getItem("dampick_orders") || "[]");
    orders.unshift({
      no: Date.now().toString().slice(-6),
      date: "내일 픽업(06월26일)",
      items: getCartItems().map(({name, qty}) => ({name, qty})),
      total: getTotal()
    });
    localStorage.setItem("dampick_orders", JSON.stringify(orders));
    cart = {};
    saveCart();
    renderProducts();
    showToast("결제 완료! 픽업예정에서 확인하세요.");
    setPage("pickup");
  }
  if (event.target.id === "copyUrlBtn") {
    navigator.clipboard?.writeText(location.href);
    showToast("URL이 복사되었습니다. 카카오톡에 붙여넣으세요.");
  }
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    currentCategory = tab.dataset.category;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === tab));
    renderProducts();
  });
});

renderProducts();
updateSummary();
