console.log('1. Запуск системы RN...');

const { Telegraf } = require('telegraf');
const express = require('express');
const cors = require('cors');

const token = '8734644018:AAHbhqi5KGARlIzT1HBNVekFX8vAWr6CL8U';
const chatId = '-5303053241'; // Группа офицеров RN

const bot = new Telegraf(token);
const app = express();

app.use(cors());
app.use(express.json());

// ====================
// КОМАНДЫ В ТЕЛЕГРАМЕ
// ====================
bot.start((ctx) => {
    console.log('-> В телеге нажали /start');
    ctx.reply('РН на связи! Напиши мне: Что ты можешь?');
});

bot.hears(/что ты можешь/i, (ctx) => {
    console.log('-> В телеге спросили про функции');
    ctx.reply('Я слежу за заявками в клан RN и выдаю инфу. Команды /rules и /roster в разработке.');
});

// ====================
// ЗАЯВКИ С САЙТА VERCEL
// ====================
app.post('/api/apply', async (req, res) => {
    console.log('-> Получен запрос с сайта! Формирую заявку...');
    const { userNick, userSkill, userDiscord } = req.body;
    try {
        await bot.telegram.sendMessage(chatId, 
            `📝 *Новая заявка в клан RN!*\n\n👤 *Ник:* ${userNick}\n🎮 *Скилл:* ${userSkill}\n📱 *Дискорд:* ${userDiscord}`, 
            { parse_mode: 'Markdown' }
        );
        console.log('-> Заявка успешно переслана офицерам!');
        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Ошибка отправки в группу:', err.message);
        res.status(500).json({ ok: false });
    }
});

// Запуск всего добра
const PORT = 3000;
app.listen(PORT, () => console.log(`2. Сервер для сайта открыт на порту ${PORT}`));

bot.launch()
    .then(() => console.log('3. Бот успешно подключен к Телеграму! СИСТЕМА ГОТОВА.'))
    .catch(err => console.error('Ошибка старта бота:', err.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));