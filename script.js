document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('orderModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('applyForm');

    // Открытие модалки
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
    });

    // Закрытие модалки на крестик
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Закрытие модалки при клике мимо окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ОТПРАВКА ОБНОВЛЕННОЙ АНКЕТЫ НА БЭКЕНД
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Собираем данные со всех 7 новых королевских полей
        // .trim() убирает случайные пробелы по краям
        const applicationData = {
            userNick: document.getElementById('userNick').value.trim(),
            userAge: document.getElementById('userAge').value.trim(),
            userKills: document.getElementById('userKills').value.trim(),
            userIntent: document.getElementById('userIntent').value.trim(),
            // Если оставили пустым — подставляем дефолт, чтобы бэк не получил пустую строку
            userPastClans: document.getElementById('userPastClans').value.trim() || 'Промолчал',
            userChar: document.getElementById('userChar').value.trim(),
            userJob: document.getElementById('userJob').value.trim() || 'Не осмелился просить'
        };

        try {
            const response = await fetch('https://rn-telegram-bot1.onrender.com/api/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            });

            const data = await response.json();

            if (data.ok) {
                alert('Ваша жалкая заявка отправлена на рассмотрение повелителю!');
                form.reset(); // Очистить все 7 полей
                modal.style.display = 'none'; // Закрыть окно
            } else {
                alert('Ошибка сервера при отправке. Скорее всего бэк не обновился.');
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            alert('Не удалось связаться с сервером. Проверь интернет или статус Render.');
        }
    });
});