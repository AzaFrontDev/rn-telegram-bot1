console.log('1. Запуск системы RN...');

const { Telegraf } = require('telegraf');
const express = require('express');
const cors = require('cors');

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new Telegraf(token);
const app = express();

app.use(cors());
app.use(express.json());

// ====================
// ОФОРМЛЕНИЕ И КОМАНДЫ БОТА
// ====================

// Стартовое приветствие
bot.start((ctx) => {
    console.log('-> В телеге нажали /start');
    ctx.replyWithMarkdown(
        `Приветствую в штабе *RN Clan*! 🎖\n\n` +
        `Я твой проводник. Используй команды ниже, чтобы узнать инфу:\n` +
        `📜 /rules — Устав и правила клана\n` +
        `👥 /roster — Действующий состав\n` +
        `ℹ️ *«Что ты можешь?»* — Справка по боту`
    );
});

// Хелп-фраза
bot.hears(/что ты можешь/i, (ctx) => {
    ctx.replyWithMarkdown(
        `🤖 *Мой функционал:*\n\n` +
        `1. Я круглосуточно принимаю заявки с официального сайта RN и пересылаю их офицерам.\n` +
        `2. Выдаю инфу по командам /rules и /roster.`
    );
});

// КОМАНДА: УСТАВ КЛАНА
bot.command('rules', (ctx) => {
    ctx.replyWithMarkdown(
        `📜 *УСТАВ КЛАНА RN*\n\n` +
        `1. 🤝 *Уважение:* Никакого токсика внутри команды. За розжиг конфликтов — кик.\n` +
        `2. 🎮 *Актив:* Посещение клан-ивентов и тренировок обязательно. Оффлайн без предупреждения больше 7 дней — исключение.\n` +
        `3. 🛡 *Честь:* Использование читов, макросов или софта, дающего преимущество, запрещено навсегда.`
    );
});

// КОМАНДА: СОСТАВ КЛАНА
bot.command('roster', (ctx) => {
    ctx.replyWithMarkdown(
        `👥 *СОСТАВ КЛАНА RN*\n\n` +
        `👑 *Лидер:* [Ник Лидера]\n` +
        `⭐ *Офицеры:* [Ник Офицера 1], [Ник Офицера 2]\n` +
        `💻 *Разработчик системы:* @${ctx.from.username || 'Фронтенд-Мастер'}\n\n` +
        `⚔️ *Основной ростер:* Заявки обрабатываются в реальном времени.`
    );
});


// ====================
// ЗАЯВКИ С САЙТА VERCEL
// ====================
app.post('/api/apply', async (req, res) => {
    console.log('-> Получен запрос с сайта! Формирую заявку...');
    const { userNick, userSkill, userDiscord } = req.body;
    try {
        await bot.telegram.sendMessage(chatId, 
            `📝 *Новая заявка в клан RN!*\n\n` +
            `👤 *Ник:* \`${userNick}\`\n` +
            `🎮 *Скилл:* \`${userSkill}\`\n` +  
            `📱 *Дискорд:* \`${userDiscord}\``, 
            { parse_mode: 'Markdown' }
        );
        console.log('-> Заявка успешно переслана офицерам!');
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Ошибка отправки в группу:', err.message);
        res.status(500).json({ ok: false });
    }
});

// ====================
// НАСТРОЙКА WEBHOOK И ЗАПУСК (v5.0)
// ====================
const PORT = process.env.PORT || 3000;

// Render сам подставит сюда нужный URL твоего приложения в продакшене
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || 'https://твой-проект.onrender.com';

app.listen(PORT, async () => {
    console.log(`2. Сервер открыт на порту ${PORT}`);
    
    try {
        // Регистрируем вебхук в Телеграме
        await bot.telegram.setWebhook(`${RENDER_EXTERNAL_URL}/api/bot-webhook`);
        console.log('3. Webhook успешно зарегистрирован в Telegram!');
    } catch (err) {
        console.error('Ошибка установки Webhook:', err.message);
    }
});

// Новый эндпоинт специально для апдейтов от Телеграма (команды /start, /rules и т.д.)
app.post('/api/bot-webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));