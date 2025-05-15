// bot.js (отдельный файл для бота)

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7778460827:AAHLh2e9yePoYCdEKPrmdrdVVsMqbrhBuS0';
const bot = new TelegramBot(token, { polling: true });

// База данных товаров (можно подключить к MongoDB/PostgreSQL)
let products = [];

// Команда /addproduct (из пункта 5)
bot.onText(/\/addproduct/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Отправьте данные товара в формате: Название|Описание|Цена|Категория|URL фото');
});

// Обработка сообщений с товарами (из пункта 5)
bot.on('message', async (msg) => {
  if (msg.text && msg.text.includes('|')) {
    const [title, desc, price, category, image] = msg.text.split('|');
    const newProduct = {
      id: products.length + 1,
      title: title.trim(),
      description: desc.trim(),
      price: parseFloat(price.trim()),
      category: category.trim(),
      image: image.trim()
    };
    
    products.push(newProduct);
    
    // Отправляем товар в API (пункт 4)
    try {
      await axios.post('http://ваш-сервер.ru/products', newProduct);
      bot.sendMessage(msg.chat.id, `Товар "${title}" добавлен!`);
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'Ошибка при сохранении товара :(');
    }
  }
});
