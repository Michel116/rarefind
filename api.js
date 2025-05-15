const API_BASE_URL = 'https://your-bot-api-url.com'; // Замените на реальный URL вашего бота

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        tg.showAlert('Failed to load products. Please try again later.');
        return [];
    }
}

async function sendOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error placing order:', error);
        tg.showAlert('Failed to place order. Please try again later.');
        return null;
    }
}

export { fetchProducts, sendOrder };