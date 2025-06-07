require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Проверка валидности запроса от Telegram
const validateInitData = (initData) => {
  // Здесь должна быть реализация проверки hash из initData
  // https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
  return true;
};

// API endpoints
app.post('/api/save-result', async (req, res) => {
  try {
    const { initData, userId, foodData } = req.body;

    // Проверяем валидность initData
    if (!validateInitData(initData)) {
      return res.status(401).json({ error: 'Invalid init data' });
    }

    // Сохраняем результат и отправляем уведомление пользователю
    await bot.sendMessage(userId, 
      `🍽 Новая запись в дневнике питания:\n\n` +
      `🥗 Блюдо: ${foodData.name}\n` +
      `⚖️ Вес: ${foodData.weight}г\n` +
      `🔥 Калории: ${foodData.calories} ккал\n` +
      `🥩 Белки: ${foodData.protein}г\n` +
      `🥑 Жиры: ${foodData.fats}г\n` +
      `🍚 Углеводы: ${foodData.carbs}г`
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 