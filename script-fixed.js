document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================
    // 1. MENU MOBILE TOGGLE
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            
            // Animação do ícone do menu
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar menu ao clicar em um link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ========================================
    // 2. SCROLL SUAVE PARA LINKS INTERNOS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 3. ANIMAÇÃO DE CARDS AO ROLAR (FADE IN)
    // ========================================
    const cards = [...document.querySelectorAll('.service-card')];

    function checkVisibility() {
        const windowHeight = window.innerHeight;
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < windowHeight * 0.85) {
                setTimeout(() => {
                    card.classList.add('is-visible');
                }, index * 100);
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();

    // ========================================
    // 4. ANIMAÇÃO DE CONTADORES (STATS)
    // ========================================
    const statItems = document.querySelectorAll('.stat-item h3');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        
        const section = document.querySelector('#qualidade');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            
            statItems.forEach(counter => {
                const text = counter.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                let current = 0;
                const increment = number / 50;
                const duration = 2000;
                const stepTime = duration / 50;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        counter.textContent = '+' + number + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = '+' + Math.floor(current) + suffix;
                    }
                }, stepTime);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);

    // ========================================
    // 5. VALIDAÇÃO DE FORMULÁRIO EM TEMPO REAL
    // ========================================
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^\$?\d{2}\$?\s?\d{4,5}-?\d{4}$/;
        return re.test(phone);
    }

    function showInputFeedback(input, isValid, message = '') {
        const formGroup = input.closest('.form-group');
        const feedback = formGroup.querySelector('.input-feedback');
        
        if (isValid) {
            input.style.borderColor = 'var(--cor-sucesso)';
            input.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
        } else {
            input.style.borderColor = 'var(--cor-erro)';
            input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        }
    }

    nameInput.addEventListener('input', () => {
        if (nameInput.value.length >= 3) {
            showInputFeedback(nameInput, true);
        } else {
            showInputFeedback(nameInput, false);
        }
    });

    emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value)) {
            showInputFeedback(emailInput, true);
        } else {
            showInputFeedback(emailInput, false);
        }
    });

    phoneInput.addEventListener('input', () => {
        if (phoneInput.value === '' || validatePhone(phoneInput.value)) {
            showInputFeedback(phoneInput, true);
        } else {
            showInputFeedback(phoneInput, false);
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.length >= 10) {
            showInputFeedback(messageInput, true);
        } else {
            showInputFeedback(messageInput, false);
        }
    });

    // ========================================
    // 6. ENVIO DE FORMULÁRIO
    // ========================================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validação final
            if (nameInput.value.length < 3) {
                showInputFeedback(nameInput, false);
                isValid = false;
            }
            if (!validateEmail(emailInput.value)) {
                showInputFeedback(emailInput, false);
                isValid = false;
            }
            if (messageInput.value.length < 10) {
                showInputFeedback(messageInput, false);
                isValid = false;
            }

            if (isValid) {
                // Simulação de envio
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                setTimeout(() => {
                    submitBtn.textContent = '✅ Mensagem Enviada!';
                    submitBtn.style.backgroundColor = 'var(--cor-sucesso)';
                    
                    form.reset();
                    
                    // Resetar estilos dos inputs
                    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
                        input.style.borderColor = 'var(--cor-borda)';
                        input.style.boxShadow = 'none';
                    });

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.backgroundColor = '';
                    }, 3000);
                }, 2000);
            }
        });
    }

    // ========================================
    // 7. FAQ ACCORDION
    // ========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Fechar todos os outros
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherQuestion = item.querySelector('.faq-question');
                    otherAnswer.style.maxHeight = '0';
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });

            // Alternar atual
            if (isExpanded) {
                faqAnswer.style.maxHeight = '0';
                question.setAttribute('aria-expanded', 'false');
            } else {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========================================
    // 8. EFEITO PARALLAX NO HERO
    // ========================================
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    // ========================================
    // 9. BOTÃO WHATSAPP FLUTUANTE
    // ========================================
    const whatsappFloat = document.querySelector('.whatsapp-float');

    if (whatsappFloat) {
        // Mostrar botão após scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.transform = 'translateY(0)';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.transform = 'translateY(20px)';
            }
        });

        // Animação de pulso
        whatsappFloat.addEventListener('mouseenter', () => {
            whatsappFloat.style.transform = 'translateY(-5px) scale(1.1)';
        });

        whatsappFloat.addEventListener('mouseleave', () => {
            whatsappFloat.style.transform = 'translateY(0) scale(1)';
        });
    }

    // ========================================
    // 10. SCROLL REVEAL PARA SEÇÕES
    // ========================================
    const sections = document.querySelectorAll('.section');

    function revealOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Adicionar estilos iniciais
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ========================================
    // 11. EFEITO DE HOVER NOS CARDS
    // ========================================
    const allCards = document.querySelectorAll('.service-card');

    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });

    // ========================================
    // 12. LOADING SCREEN (OPCIONAL)
    // ========================================
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Carregando...</p>
        </div>
    `;

    document.body.appendChild(loadingScreen);

    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });

    // ========================================
    // 13. ANIMAÇÃO DE ENTRADA DO HEADER
    // ========================================
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // 14. TOOLTIPS (OPCIONAL)
    // ========================================
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'var(--cor-primaria)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '0.9rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            
            const rect = element.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
            
            document.body.appendChild(tooltip);

            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    });

    // ========================================
    // 15. PREVENIR SCROLL EXCESSIVO
    // ========================================
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(() => {
                isScrolling = false;
            });
        }
    });

    // ========================================
    // 16. DETECTAR MUDANÇA DE TELA
    // ========================================
    let lastWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        
        if (Math.abs(currentWidth - lastWidth) > 10) {
            // Recalcular animações
            checkVisibility();
            revealOnScroll();
        }
        
        lastWidth = currentWidth;
    });

    // ========================================
    // 17. ANIMAÇÃO DE BOTÃO PRINCIPAL
    // ========================================
    const primaryButtons = document.querySelectorAll('.btn-primary');

    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            }, 150);
        });
    });

    // ========================================
    // 18. RASTREAMENTO DE CLIC (OPCIONAL)
    // ========================================
    const clickTracker = (e) => {
        const target = e.target;
        if (target.classList.contains('btn-primary') || target.closest('.btn-primary')) {
            console.log('CTA Clicado:', target.closest('.btn-primary').textContent);
        }
    };

    document.addEventListener('click', clickTracker);

    // ========================================
    // 19. ANIMAÇÃO DE TEXTO (TYPING EFFECT)
    // ========================================
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 500);
    }

    // ========================================
    // 20. FUNÇÃO DE UTILIDADE: SCROLL TO TOP
    // ========================================
    window.scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // ========================================
    // 21. DETECTAR VISIBILIDADE DA PÁGINA
    // ========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Usuário saiu da página');
        } else {
            console.log('Usuário retornou à página');
            // Reativar animações se necessário
            checkVisibility();
            revealOnScroll();
        }
    });

    // ========================================
    // 22. MODAL FAQ
    // ========================================
    window.openFAQModal = () => {
        document.getElementById('faqModal').style.display = 'block';
    };

    window.closeFAQModal = () => {
        document.getElementById('faqModal').style.display = 'none';
    };

    // Fechar modal ao clicar fora
    window.onclick = (event) => {
        const modal = document.getElementById('faqModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

});
