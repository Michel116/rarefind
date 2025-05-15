const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock база данных
let products = [
    {
        id: 1,
        title: "Antique Pocket Watch",
        description: "Vintage silver pocket watch from 1890s",
        price: 1200,
        category: "collectibles",
        image: "https://example.com/watch.jpg"
    }
    // ... другие товары
];

let orders = [];

// Получение товаров
app.get('/products', (req, res) => {
    // Можно добавить фильтрацию по категориям и т.д.
    res.json(products);
});

// Создание заказа
app.post('/orders', (req, res) => {
    const order = req.body;
    order.id = orders.length + 1;
    order.date = new Date();
    orders.push(order);
    
    // Здесь можно добавить отправку уведомления в Telegram
    // через bot.sendMessage()
    
    res.json({ success: true, orderId: order.id });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});