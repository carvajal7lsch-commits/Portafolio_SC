document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link, .btn-secondary');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. Project Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove inline style so it transitions to CSS stylesheet default (including rotations!)
                entry.target.style.transform = '';
                entry.target.style.opacity = '';
                
                // Clear inline transition after it finishes so hover CSS transition works perfectly
                setTimeout(() => {
                    entry.target.style.transition = '';
                }, 600);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.about-card, .skill-category, .project-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // 6. Lightbox Modal para Mockups
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const mockupImages = document.querySelectorAll('.device-screen img');

    if(modal && modalImg && closeBtn) {
        // Abrir modal al hacer clic en imagen
        mockupImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                modal.classList.add('active');
                modalImg.src = this.src;
            });
        });

        // Cerrar al hacer clic en la X
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Cerrar al hacer clic en cualquier lugar fuera de la imagen
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }

    // 7. Tech Visualizer Tabs Switcher
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Quitar clase activa de todos los botones y agregar al seleccionado
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Ocultar contenidos y mostrar el seleccionado
                tabContents.forEach(content => {
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // 8. Contact Form Submission via FormSubmit AJAX
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            const formData = new FormData(contactForm);
            
            fetch('https://formsubmit.co/ajax/carvajal7lsch@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === "true" || data.success === true) {
                    alert('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.');
                    contactForm.reset();
                } else {
                    alert('Hubo un problema al enviar el mensaje. Por favor intenta de nuevo.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar tu mensaje. Intenta de nuevo más tarde.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }

    // 9. 3D Parallax Tilt Effect for Profile Card
    const card = document.getElementById('profile-card');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Posición del mouse relativa al centro de la tarjeta
            const mouseX = e.clientX - cardRect.left - cardWidth / 2;
            const mouseY = e.clientY - cardRect.top - cardHeight / 2;
            
            // Valores de rotación (máximo 15 grados)
            const rotateX = -(mouseY / cardHeight) * 20;
            const rotateY = (mouseX / cardWidth) * 20;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Efecto de brillo que sigue el cursor
            const glow = card.querySelector('.card-glow');
            if (glow) {
                const percentX = ((e.clientX - cardRect.left) / cardWidth) * 100;
                const percentY = ((e.clientY - cardRect.top) / cardHeight) * 100;
                glow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(59, 130, 246, 0.25) 0%, transparent 60%)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Restaurar transformaciones suavemente
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)`;
            }
            
            // Quitar transición tras resetear
            setTimeout(() => {
                card.style.transition = 'transform 0.1s ease';
            }, 500);
        });
    }
});
