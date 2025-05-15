// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Импорт API функций
import { fetchProducts, sendOrder } from './api.js';

// Элементы DOM (остается как было)
const productsContainer = document.getElementById('productsContainer');
// ... остальные DOM элементы

// Переменные состояния
let cart = [];
let products = []; // Теперь товары будут загружаться
let currentProduct = null;
let currentQty = 1;
let activeCategory = 'all';
let searchQuery = '';

// Инициализация приложения
async function init() {
    tg.MainButton.show();
    tg.MainButton.setParams({
        text: 'LOADING...',
        is_visible: true,
        is_active: false
    });
    
    try {
        products = await fetchProducts();
        renderProducts();
        setupEventListeners();
        loadCart();
        
        tg.MainButton.setParams({
            text: `CHECKOUT (${cart.reduce((sum, item) => sum + item.quantity, 0)})`,
            is_visible: cart.length > 0
        });
    } catch (error) {
        console.error('Initialization error:', error);
        tg.showAlert('Failed to initialize app. Please try again later.');
    }
}

// В функции checkout замените отправку данных:
async function checkout() {
    if (cart.length === 0) return;

    tg.MainButton.showProgress();
    
    const orderData = {
        products: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        user: tg.initDataUnsafe.user,
        initData: tg.initData
    };

    const result = await sendOrder(orderData);
    
    if (result) {
        showAlert('Thank you for your order!');
        cart = [];
        saveCart();
        renderCartItems();
        closeCartModal();
    }
    
    tg.MainButton.hideProgress();
}

// Остальной код остается таким же, как в предыдущей версии