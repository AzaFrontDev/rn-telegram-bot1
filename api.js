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

    // ОТПРАВКА ФОРМЫ НА БЭКЕНД
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const applicationData = {
            userNick: document.getElementById('userNick').value,
            userSkill: document.getElementById('userSkill').value,
            userDiscord: document.getElementById('userDiscord').value
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
                alert('Заявка успешно отправлена в штаб RN!');
                form.reset(); // Очистить поля
                modal.style.display = 'none'; // Закрыть окно
            } else {
                alert('Ошибка сервера при отправке.');
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            alert('Не удалось связаться с сервером.');
        }
    });
});