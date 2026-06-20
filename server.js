console.log('1. Запуск системы RN...');

const { Telegraf } = require('telegraf');
const express = require('express');
const cors = require('cors');

const token = '8734644018:AAHbhqi5KGARlIzT1HBNVekFX8vAWr6CL8U';
const chatId = '-1003816042648'; // Группа офицеров RN

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
        `⚖️ *1. Дисциплина и субординация:*\n` +
        `Решения Главы клана и офицеров обсуждению не подлежат. Внутри коллектива запрещено разведение гнили, токсичности и неуважительного отношения к соклановцам.\n\n` +
        `⚔️ *2. Игровой актив и Вары:*\n` +
        `Явка на официальные клановые войны (вары) крайне рекомендована. Ситуации, когда за весь клан отдуваются три человека, неприемлемы. Если не можешь быть — подготовь вменяемую отговорку заранее.\n\n` +
        `🛡 *3. Кадровая политика:*\n` +
        `Запрещен намеренный инвайт-спам и кража чужих кадров. Мы ставим на качество, а не на перебежчиков. При этом, если адекватный игрок сам ушел из другого клана и хочет развиваться с нами — его заявка будет рассмотрена.`
    );
});

// КОМАНДА: СОСТАВ КЛАНА
bot.command('roster', (ctx) => {
    const developer = ctx.from.username ? `@${ctx.from.username}` : 'Фронтенд-Мастер';
    
    ctx.replyWithHTML(
        `👥 <b>АКТУАЛЬНЫЙ СОСТАВ КЛАНА RN</b>\n\n` +
        `👑 <b>Глава клана:</b> Acecarslen\n` +
        `⭐ <b>Офицерский корпус:</b> Garou, Acecarslen, Hinderon\n\n` +
        `💻 <b>Разработчик системы:</b> ${developer}\n\n` +
        `⚔️ <b>Основной ростер:</b> Набор открыт через сайт. Все новые заявки падают напрямую офицерам.`
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`2. Сервер открыт на порту ${PORT}`));

bot.launch()
    .then(() => console.log('3. Система готова и задеплоена!'))
    .catch(err => console.error('Ошибка старта бота:', err.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));