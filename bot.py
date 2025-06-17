import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters
import os
from dotenv import load_dotenv

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
TOKEN = os.getenv('TELEGRAM_TOKEN')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    web_app_url = os.getenv("RENDER_EXTERNAL_URL", "https://kalogram-frontend.onrender.com")
    keyboard = [
        [InlineKeyboardButton("📸 Сканировать еду", callback_data='scan_food')],
        [InlineKeyboardButton("📊 История", callback_data='history')],
        [InlineKeyboardButton("ℹ️ Помощь", callback_data='help')],
        [InlineKeyboardButton(
            "🚀 Открыть мини-приложение",
            web_app=WebAppInfo(url=web_app_url)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_message = (
        "👋 Привет! Я бот для подсчёта калорий.\n\n"
        "📸 Отправьте мне фото еды, и я:\n"
        "- Распознаю что на фото\n"
        "- Подсчитаю калории\n"
        "- Сохраню информацию в вашу историю\n\n"
        "Выберите действие:"
    )
    
    await update.message.reply_text(welcome_message, reply_markup=reply_markup)

async def button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle button presses."""
    query = update.callback_query
    await query.answer()

    if query.data == 'scan_food':
        await query.edit_message_text(
            text="📸 Отправьте фото еды, и я проанализирую его содержимое и калорийность."
        )
    elif query.data == 'history':
        await query.edit_message_text(
            text="📊 Здесь будет ваша история сканирований (функция в разработке)"
        )
    elif query.data == 'help':
        help_text = (
            "ℹ️ Как использовать бота:\n\n"
            "1. Отправьте фото еды\n"
            "2. Дождитесь анализа\n"
            "3. Получите информацию о калорийности\n\n"
            "Для начала работы нажмите /start"
        )
        await query.edit_message_text(text=help_text)

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming photos."""
    # Get the photo file
    photo_file = await update.message.photo[-1].get_file()
    
    await update.message.reply_text(
        "🔍 Анализирую фото... Пожалуйста, подождите."
    )
    
    # TODO: Implement AI food recognition
    # For MVP, we'll just return a placeholder message
    await update.message.reply_text(
        "🍽 На фото похоже на:\n"
        "- Предположительно: Салат\n"
        "- Примерная калорийность: 150 ккал\n\n"
        "⚠️ Это тестовая версия. Точность распознавания будет улучшена в следующих обновлениях."
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    help_text = (
        "ℹ️ Как использовать бота:\n\n"
        "1. Отправьте фото еды\n"
        "2. Дождитесь анализа\n"
        "3. Получите информацию о калорийности\n\n"
        "Для начала работы нажмите /start"
    )
    await update.message.reply_text(help_text)

def main() -> None:
    """Start the bot."""
    # Create the Application
    application = Application.builder().token(TOKEN).build()

    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CallbackQueryHandler(button))
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))

    # Start the Bot
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main() 