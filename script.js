const cartButton = document.querySelector('.cart-btn');
const cartOverlay = document.getElementById('cartOverlay');
const cartModal = document.getElementById('cartModal');
const cartClose = document.querySelector('.cart-close');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.querySelector('.checkout-btn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.querySelector('.checkout-close');
const checkoutForm = document.getElementById('checkoutForm');
const successModal = document.getElementById('successModal');
const successClose = document.querySelector('.success-btn');
const addButtons = document.querySelectorAll('.add-to-cart-btn');
const productCards = Array.from(document.querySelectorAll('.product-card'));
const searchInput = document.getElementById('search');
const searchEmpty = document.getElementById('searchEmpty');

let cart = [];

function formatPrice(value) {
    return `${value.toLocaleString('ru-RU')} сом`;
}

function renderCart() {
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Себет азыр бош. Биринчи товарды кошуп көрүңүз.</div>';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <button class="remove-item-btn" type="button" data-index="${index}" aria-label="Өчүрүү">×</button>
        </div>
    `).join('');
}

function showOverlay() {
    cartOverlay.classList.add('active');
    cartOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function hideOverlay() {
    cartOverlay.classList.remove('active');
    cartOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function showModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function hideModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function openCart() {
    hideModal(checkoutModal);
    hideModal(successModal);
    showModal(cartModal);
    showOverlay();
}

function closeCart() {
    hideModal(cartModal);
    if (!cartModal.classList.contains('active') && !checkoutModal.classList.contains('active') && !successModal.classList.contains('active')) {
        hideOverlay();
    }
}

function openCheckout() {
    hideModal(cartModal);
    hideModal(successModal);
    showModal(checkoutModal);
    showOverlay();
}

function closeCheckout() {
    hideModal(checkoutModal);
    if (!cartModal.classList.contains('active') && !checkoutModal.classList.contains('active') && !successModal.classList.contains('active')) {
        hideOverlay();
    }
}

function openSuccess() {
    hideModal(cartModal);
    hideModal(checkoutModal);
    showModal(successModal);
    showOverlay();
}

function closeSuccess() {
    hideModal(successModal);
    if (!cartModal.classList.contains('active') && !checkoutModal.classList.contains('active') && !successModal.classList.contains('active')) {
        hideOverlay();
    }
}

function addProductToCart(buttonOrCard) {
    const card = buttonOrCard.closest('.product-card');
    const name = card.querySelector('.product-name').textContent.trim();
    const priceText = card.querySelector('.product-price').textContent.trim();
    const image = card.querySelector('img').src;
    const price = Number(priceText.replace(/\D/g, ''));

    cart.push({ name, price, image });
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function resetStore() {
    cart = [];
    renderCart();
    checkoutForm.reset();
    searchInput.value = '';
    filterProducts();
    hideModal(cartModal);
    hideModal(checkoutModal);
    hideModal(successModal);
    hideOverlay();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

addButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        addProductToCart(button);
    });
});

productCards.forEach((card) => {
    card.addEventListener('click', (event) => {
        if (event.target.closest('.add-to-cart-btn')) {
            return;
        }
        addProductToCart(card);
    });
});

cartButton.addEventListener('click', () => {
    openCart();
});

cartItems.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-item-btn');
    if (!removeButton) return;

    const index = Number(removeButton.dataset.index);
    removeFromCart(index);
});

checkoutButton.addEventListener('click', () => {
    openCheckout();
});

cartClose.addEventListener('click', closeCart);
checkoutClose.addEventListener('click', closeCheckout);
successClose.addEventListener('click', resetStore);
cartOverlay.addEventListener('click', () => {
    closeCart();
    closeCheckout();
    closeSuccess();
});

checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!checkoutForm.checkValidity()) {
        checkoutForm.reportValidity();
        return;
    }

    openSuccess();
});

function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(query);
        card.style.display = matches ? '' : 'none';

        if (matches) {
            visibleCount += 1;
        }
    });

    searchEmpty.hidden = visibleCount !== 0;
}

searchInput.addEventListener('input', filterProducts);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeCart();
        closeCheckout();
        closeSuccess();
    }
});

filterProducts();
renderCart();
