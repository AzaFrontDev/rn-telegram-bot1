// Данные телеграм-бота (конфиг v4.0)
const token = '8734644018:AAHbhqi5KGARlIzT1HBNVekFX8vAWr6CL8U'; 
const chatId = '-1003816042648'; // Группа офицеров RN'; // ID группы "RN | Заявки с сайта"

// Функция для отправки заявки, которую ты вызываешь при клике на кнопку формы
function sendApplication(userNick, userSkill, userDiscord) {
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `📝 *Новая заявка в клан RN!*\n\n👤 *Ник:* ${userNick}\n🎮 *Скилл:* ${userSkill}\n📱 *Дискорд:* ${userDiscord}`,
      parse_mode: 'Markdown'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      console.log('Заявка успешно улетела в чат офицеров!');
    } else {
      console.error('Телега вернула ошибку:', data.description);
    }
  })
  .catch(err => console.error('Ошибка сети при отправке:', err));
}
