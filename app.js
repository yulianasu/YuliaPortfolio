document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.background = '#ffffff';
                navMenu.style.padding = '20px';
                navMenu.style.borderBottom = '1px solid #e2e8f0';
                navMenu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
            }
        });
    }

    // Обработка формы контактов (Отправка в Telegram)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ДАННЫЕ ИЗ ТЕЛЕГРАМА:
        const token = "9001007511:AAFpA_0h9ltCzqiM1FvHkV91Vx1tpf-EO6Q";
        const chatId = "5272282589";

        // Автоматически собираем все поля из формы
        const formData = new FormData(contactForm);
        let message = `<b>🔥 Новая заявка с сайта!</b>\n\n`;

        formData.forEach((value, key) => {
            message += `<b>${key}:</b> ${value}\n`;
        });

        // Отправляем в Telegram через fetch
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                parse_mode: 'html',
                text: message
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Спасибо за сообщение! Юлия Суворова свяжется с вами в ближайшее время.');
                contactForm.reset();
            } else {
                alert('Ошибка при отправке. Попробуйте еще раз.');
            }
        })
        .catch(error => {
            alert('Произошла ошибка сети.');
            console.error(error);
        });
    });
  }
});