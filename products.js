// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Элементы DOM
const productsContainer = document.getElementById('productsContainer');
const cartButton = document.getElementById('cartButton');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCounter = document.getElementById('cartCounter');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalOldPrice = document.getElementById('modalOldPrice');
const productQty = document.getElementById('productQty');
const increaseQty = document.getElementById('increaseQty');
const decreaseQty = document.getElementById('decreaseQty');
const addToCart = document.getElementById('addToCart');
const checkoutButton = document.getElementById('checkoutButton');

// Переменные состояния
let cart = [];
let currentProduct = null;
let currentQty = 1;
let activeCategory = 'all';
let searchQuery = '';

// Инициализация приложения
function init() {
    renderProducts();
    setupEventListeners();
    loadCart();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Корзина
    cartButton.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    checkoutButton.addEventListener('click', checkout);

    // Поиск
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    // Категории
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.dataset.category;
            renderProducts();
        });
    });

    // Модальное окно товара
    closeModal.addEventListener('click', () => {
        productModal.classList.remove('active');
    });

    // Количество товара
    increaseQty.addEventListener('click', () => {
        currentQty++;
        productQty.textContent = currentQty;
    });

    decreaseQty.addEventListener('click', () => {
        if (currentQty > 1) {
            currentQty--;
            productQty.textContent = currentQty;
        }
    });

    // Добавление в корзину
    addToCart.addEventListener('click', () => {
        if (currentProduct) {
            addItemToCart(currentProduct, currentQty);
            productModal.classList.remove('active');
            currentQty = 1;
            productQty.textContent = currentQty;
        }
    });
}

// Отображение товаров
function renderProducts() {
    productsContainer.innerHTML = '';

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchQuery) || 
                             product.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="empty-message">No products found</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-prices">
                    <span class="product-price">$${product.price}</span>
                    ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice}</span>` : ''}
                </div>
            </div>
        `;

        productElement.addEventListener('click', () => {
            openProductModal(product);
        });

        productsContainer.appendChild(productElement);
    });
}

// Открытие модального окна товара
function openProductModal(product) {
    currentProduct = product;
    modalImage.src = product.image;
    modalTitle.textContent = product.title;
    modalDescription.textContent = product.description;
    modalPrice.textContent = `$${product.price}`;
    
    if (product.oldPrice) {
        modalOldPrice.textContent = `$${product.oldPrice}`;
        modalOldPrice.style.display = 'inline';
    } else {
        modalOldPrice.style.display = 'none';
    }

    productModal.classList.add('active');
}

// Работа с корзиной
function openCart() {
    renderCartItems();
    cartOverlay.classList.add('active');
}

function closeCartModal() {
    cartOverlay.classList.remove('active');
}

function loadCart() {
    const savedCart = localStorage.getItem('rarefind_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCounter();
    }
}

function saveCart() {
    localStorage.setItem('rarefind_cart', JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    tg.MainButton.setParams({
        text: `CHECKOUT (${totalItems})`,
        is_visible: totalItems > 0
    });
}

function addItemToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    showAlert(`${product.title} added to cart`);
}

function removeItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
}

function updateItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        if (item.quantity < 1) {
            removeItemFromCart(productId);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '$0';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-actions">
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>
            <button class="remove-item">✕</button>
        `;

        const increaseBtn = cartItemElement.querySelector('.increase');
        const decreaseBtn = cartItemElement.querySelector('.decrease');
        const removeBtn = cartItemElement.querySelector('.remove-item');

        increaseBtn.addEventListener('click', () => {
            updateItemQuantity(item.id, item.quantity + 1);
        });

        decreaseBtn.addEventListener('click', () => {
            updateItemQuantity(item.id, item.quantity - 1);
        });

        removeBtn.addEventListener('click', () => {
            removeItemFromCart(item.id);
        });

        cartItems.appendChild(cartItemElement);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) return;

    const orderData = {
        products: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        user: tg.initDataUnsafe.user
    };

    // Здесь можно отправить данные на сервер или обработать их
    tg.sendData(JSON.stringify(orderData));
    
    // Показать уведомление
    showAlert('Thank you for your order!');
    
    // Очистить корзину
    cart = [];
    saveCart();
    renderCartItems();
    closeCartModal();
}

// Вспомогательные функции
function showAlert(message) {
    tg.showAlert(message);
}

// Запуск приложения
init();