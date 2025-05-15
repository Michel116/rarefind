const TelegramBot = require('node-telegram-bot-api');

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

// Обработчики команд
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в Rarefind Shop!');
});

// Основной обработчик webhook
exports.handler = async (event) => {
  try {
    // Проверка секретного ключа (опционально)
    if (event.headers['x-telegram-secret'] !== process.env.SECRET_KEY) {
      return { statusCode: 403 };
    }
    
    const update = JSON.parse(event.body);
    await bot.processUpdate(update);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'OK' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};