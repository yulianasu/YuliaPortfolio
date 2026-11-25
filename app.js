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


//landing
    const canvas = document.getElementById('fullCanvasBg');
        const ctx = canvas.getContext('2d');

        let width, height;
        let mouse = { x: null, y: null, radius: 160 };
        let laptopOffset = { x: 0, y: 0 };

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Созвездия на весь сайт (на заднем фоне)
        let stars = [];
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2.5 + 1,
                color: Math.random() > 0.5 ? '#00d2ff' : '#ff007f'
            });
        }

        let time = 0;

        function renderScene() {
            time += 0.03;
            ctx.clearRect(0, 0, width, height);

            // 1. СОЗВЕЗДИЯ НА ФОНЕ
            stars.forEach(s => {
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < 0 || s.x > width) s.vx *= -1;
                if (s.y < 0 || s.y > height) s.vy *= -1;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.shadowColor = s.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    let dx = stars[i].x - stars[j].x;
                    let dy = stars[i].y - stars[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.strokeStyle = `rgba(0, 210, 255, ${0.35 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - stars[i].x;
                    let dy = mouse.y - stars[i].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 0, 127, ${0.7 * (1 - dist / mouse.radius)})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }

            // 2. НОУТБУК РИСУЕТСЯ ТОЛЬКО НА ПЕРВОМ ЭКРАНЕ
            if (window.scrollY < window.innerHeight) {
                const isMobile = width < 968;
                
                // РАБОЧИЕ КООРДИНАТЫ: на десктопе справа, на мобилках по центру экрана (внизу под текстом)
                const baseX = isMobile ? width / 2 : width * 0.73;
                const baseY = isMobile ? height * 0.78 : height * 0.52;

                let targetOffsetX = 0;
                let targetOffsetY = 0;
                if (mouse.x !== null && mouse.y !== null && !isMobile) {
                    targetOffsetX = (mouse.x - width / 2) * 0.03;
                    targetOffsetY = (mouse.y - height / 2) * 0.03;
                }
                laptopOffset.x += (targetOffsetX - laptopOffset.x) * 0.08;
                laptopOffset.y += (targetOffsetY - laptopOffset.y) * 0.08;

                const floatY = Math.sin(time * 1.5) * 5;
                const nx = baseX + laptopOffset.x;
                const ny = baseY + laptopOffset.y + floatY;

                // Подсветка сзади
                const backGlow = ctx.createRadialGradient(nx + 30, ny - 50, 15, nx + 30, ny - 50, 240);
                backGlow.addColorStop(0, 'rgba(255, 0, 127, 0.4)');
                backGlow.addColorStop(0.5, 'rgba(0, 210, 255, 0.2)');
                backGlow.addColorStop(1, 'transparent');
                ctx.fillStyle = backGlow;
                ctx.beginPath();
                ctx.arc(nx + 30, ny - 50, 240, 0, Math.PI * 2);
                ctx.fill();

                // Тень под ноутбуком
                ctx.beginPath();
                ctx.ellipse(nx, ny + 95, 130, 35, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.filter = 'blur(12px)';
                ctx.fill();
                ctx.filter = 'none';

                const curY = ny;

                // База ноутбука
                const p1 = { x: nx - 140, y: curY + 20 };
                const p2 = { x: nx,       y: curY + 85 };
                const p3 = { x: nx + 140, y: curY + 20 };
                const p4 = { x: nx,       y: curY - 40 };

                // Толщина базы
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p2.x, p2.y + 12);
                ctx.lineTo(p1.x, p1.y + 12);
                ctx.closePath();
                ctx.fillStyle = '#100c1c';
                ctx.fill();
                ctx.strokeStyle = '#6e00ff';
                ctx.lineWidth = 1.2;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p3.x, p3.y + 12);
                ctx.lineTo(p2.x, p2.y + 12);
                ctx.closePath();
                ctx.fillStyle = '#1c1233';
                ctx.fill();
                ctx.stroke();

                // Поверхность клавиатуры
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.closePath();
                const baseGrad = ctx.createLinearGradient(p1.x, p4.y, p3.x, p2.y);
                baseGrad.addColorStop(0, '#2d1b4e');
                baseGrad.addColorStop(1, '#110b21');
                ctx.fillStyle = baseGrad;
                ctx.fill();
                ctx.strokeStyle = '#00d2ff';
                ctx.lineWidth = 1.8;
                ctx.shadowColor = '#00d2ff';
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Клавиатура
                const kp1 = { x: nx - 102, y: curY + 12 };
                const kp2 = { x: nx,       y: curY + 57 };
                const kp3 = { x: nx + 102, y: curY + 12 };
                const kp4 = { x: nx,       y: curY - 31 };

                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.lineTo(kp3.x, kp3.y);
                ctx.lineTo(kp4.x, kp4.y);
                ctx.closePath();
                ctx.fillStyle = '#080510';
                ctx.fill();

                for (let i = 0; i < 4; i++) {
                    const rt = (i + 0.5) / 4;
                    for (let j = 0; j < 8; j++) {
                        const ct = (j + 0.5) / 8;
                        const kx = (1 - rt) * (kp1.x + (kp4.x - kp1.x) * ct) + rt * (kp2.x + (kp3.x - kp2.x) * ct);
                        const ky = (1 - rt) * (kp1.y + (kp4.y - kp1.y) * ct) + rt * (kp2.y + (kp3.y - kp2.y) * ct);

                        const active = Math.sin(time * 5 + i + j * 2) > 0.8;
                        ctx.beginPath();
                        ctx.arc(kx, ky, 2, 0, Math.PI * 2);
                        ctx.fillStyle = active ? '#00d2ff' : '#2d2545';
                        if (active) {
                            ctx.shadowColor = '#00d2ff';
                            ctx.shadowBlur = 6;
                        }
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }

                // ЭКРАН И СТРОКИ КОДА (Вернул на 100% ту самую проверенную рабочую изометрию, где всё чётко и ровно)
                const sH = 135;
                const sB1 = { x: p4.x, y: p4.y };
                const sB2 = { x: p3.x, y: p3.y };
                const sT1 = { x: p4.x, y: p4.y - sH };
                const sT2 = { x: p3.x, y: p3.y - sH };

                ctx.beginPath();
                ctx.moveTo(sT1.x, sT1.y);
                ctx.lineTo(sT2.x, sT2.y);
                ctx.lineTo(sT2.x + 6, sT2.y);
                ctx.lineTo(sT1.x + 6, sT1.y);
                ctx.closePath();
                ctx.fillStyle = '#1a0d33';
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(sB1.x, sB1.y);
                ctx.lineTo(sB2.x, sB2.y);
                ctx.lineTo(sT2.x, sT2.y);
                ctx.lineTo(sT1.x, sT1.y);
                ctx.closePath();
                ctx.fillStyle = '#06040d';
                ctx.fill();
                ctx.strokeStyle = '#ff007f';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = '#ff007f';
                ctx.shadowBlur = 15;
                ctx.stroke();
                ctx.shadowBlur = 0;

                const pad = 9;
                const db1 = { x: sB1.x + pad + 2, y: sB1.y - pad };
                const db2 = { x: sB2.x - pad,     y: sB2.y - pad };
                const dt2 = { x: sT2.x - pad,     y: sT2.y + pad };
                const dt1 = { x: sT1.x + pad + 2, y: sT1.y + pad };

                ctx.beginPath();
                ctx.moveTo(db1.x, db1.y);
                ctx.lineTo(db2.x, db2.y);
                ctx.lineTo(dt2.x, dt2.y);
                ctx.lineTo(dt1.x, dt1.y);
                ctx.closePath();
                const screenGrad = ctx.createLinearGradient(dt1.x, dt1.y, db2.x, db2.y);
                screenGrad.addColorStop(0, '#0d0921');
                screenGrad.addColorStop(1, '#030208');
                ctx.fillStyle = screenGrad;
                ctx.fill();

                // Идеальные ровные строки кода из самой первой рабочей версии
                for (let i = 0; i < 6; i++) {
                    const t = (i + 0.8) / 7;
                    const lx1 = db1.x + (dt1.x - db1.x) * t + 8;
                    const ly1 = db1.y + (dt1.y - db1.y) * t;
                    const fullLx2 = db2.x + (dt2.x - db2.x) * t - 8;
                    const fullLy2 = db2.y + (dt2.y - db2.y) * t;

                    const len = ((i * 31) % 5 + 4) / 10;
                    const lx2 = lx1 + (fullLx2 - lx1) * len;
                    const ly2 = ly1 + (fullLy2 - ly1) * len;

                    const isPink = (i % 3 === 0);
                    const isGold = (i === 1 || i === 4);

                    ctx.beginPath();
                    ctx.moveTo(lx1, ly1);
                    ctx.lineTo(lx2, ly2);
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = isGold ? '#f7df1e' : (isPink ? '#ff007f' : '#00d2ff');
                    ctx.shadowColor = ctx.strokeStyle;
                    ctx.shadowBlur = 8;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Чашка кофе
                const cupX = nx - 110;
                const cupY = curY + 30;

                ctx.beginPath();
                ctx.ellipse(cupX, cupY + 12, 18, 8, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#1c1233';
                ctx.strokeStyle = '#00d2ff';
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(cupX, cupY, 13, 6, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#ff007f';
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(cupX - 13, cupY);
                ctx.lineTo(cupX - 13, cupY + 13);
                ctx.quadraticCurveTo(cupX, cupY + 18, cupX + 13, cupY + 13);
                ctx.lineTo(cupX + 13, cupY);
                ctx.closePath();
                ctx.fillStyle = '#170f2b';
                ctx.strokeStyle = '#ff007f';
                ctx.lineWidth = 1.6;
                ctx.stroke();
                ctx.fill();

                ctx.save();
                ctx.font = "bold 10px monospace";
                ctx.fillStyle = "#00d2ff";
                ctx.textAlign = "center";
                ctx.fillText("< / >", cupX, cupY + 9);
                ctx.restore();

                const steamP = Math.sin(time * 3.5) * 4;
                ctx.beginPath();
                ctx.moveTo(cupX, cupY - 3);
                ctx.quadraticCurveTo(cupX + steamP, cupY - 15, cupX - steamP, cupY - 28);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 1.8;
                ctx.stroke();
            }

            requestAnimationFrame(renderScene);
        }

        renderScene();

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