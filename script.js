// ===== VARIABLES GLOBALES =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const galleryItems = document.querySelectorAll('.gallery__item');
const modal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.querySelector('.modal__close');
const contactForm = document.getElementById('contact-form');
const orderButtons = document.querySelectorAll('#order-btn, #menu-order-btn');

// ===== NAVEGACIÓN MÓVIL =====
function toggleMobileMenu() {
    navMenu.classList.toggle('show-menu');
    
    // Animación del ícono hamburger
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('show-menu')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// Event Listeners para navegación móvil
if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

// Cerrar menú móvil al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    });
});

// ===== SCROLL SUAVE =====
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Event Listeners para navegación suave
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        smoothScroll(target);
    });
});

// ===== HEADER DINÁMICO =====
function updateHeader() {
    const scrollY = window.pageYOffset;
    
    if (scrollY >= 50) {
        header.classList.add('scroll-header');
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.classList.remove('scroll-header');
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }
}

// ===== SECCIÓN ACTIVA EN NAVEGACIÓN =====
function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// ===== ANIMACIONES DE SCROLL =====
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('appear');
        }
    });
}

// Intersection Observer para animaciones más eficientes
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
});

// ===== GALERÍA MODAL =====
function openModal(imageSrc, caption) {
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    modalCaption.textContent = caption;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners para galería
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imageSrc = item.dataset.src || item.querySelector('img').src;
        const caption = item.querySelector('h3').textContent + ' - ' + item.querySelector('p').textContent;
        openModal(imageSrc, caption);
    });
});

// Cerrar modal
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// ===== FORMULARIO DE CONTACTO =====
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

function showFormMessage(message, type = 'success') {
    // Remover mensaje anterior si existe
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    messageDiv.textContent = message;
    
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Scroll suave al mensaje
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage(errors.join('. '), 'error');
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (aquí integrarías con tu backend)
    setTimeout(() => {
        showFormMessage('¡Mensaje enviado exitosamente! Te responderemos pronto.');
        contactForm.reset();
        
        // Restaurar botón
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Resetear labels flotantes
        const labels = contactForm.querySelectorAll('.form__label');
        labels.forEach(label => {
            label.style.top = '50%';
            label.style.transform = 'translateY(-50%)';
            label.style.fontSize = 'var(--fs-normal)';
            label.style.color = 'var(--gray)';
        });
    }, 2000);
}

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// ===== BOTONES DE PEDIDO WHATSAPP =====
function createWhatsAppMessage() {
    const message = encodeURIComponent(
        "¡Hola! Me interesa ordenar una pizza artesanal de Danamarys 🍕\n\n" +
        "Me gustaría conocer:\n" +
        "• Pizzas disponibles hoy\n" +
        "• Precios actuales\n" +
        "• Tiempo de entrega\n" +
        "• Ubicación del carrito\n\n" +
        "¡Gracias!"
    );
    return `https://wa.me/593995502182?text=${message}`;
}

orderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(createWhatsAppMessage(), '_blank');
    });
});

// ===== LAZY LOADING DE IMÁGENES =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== EFECTOS DE PARALLAX SUTIL =====
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__pattern');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// ===== CONTADOR DE PIZZA SLICE =====
function animatePizzaSlices() {
    const pizzaCards = document.querySelectorAll('.pizza__card');
    
    pizzaCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) rotate(1deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
}

// ===== TOOLTIP PERSONALIZADO =====
function createTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--primary-red);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translateX(-50%);
    `;
    
    element.addEventListener('mouseenter', (e) => {
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        setTimeout(() => tooltip.style.opacity = '1', 10);
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    });
}

// ===== INICIALIZACIÓN =====
function initializeApp() {
    // Aplicar clases para animaciones
    const elementsToAnimate = [
        { selector: '.hero__content', class: 'fade-in' },
        { selector: '.hero__image', class: 'slide-in-right' },
        { selector: '.timeline__content', class: 'fade-in' },
        { selector: '.mission__card', class: 'slide-in-left' },
        { selector: '.value__card', class: 'fade-in' },
        { selector: '.pizza__card', class: 'fade-in' },
        { selector: '.gallery__item', class: 'fade-in' },
        { selector: '.contact__form', class: 'slide-in-left' },
        { selector: '.contact__info', class: 'slide-in-right' }
    ];
    
    elementsToAnimate.forEach(({ selector, class: className }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.classList.add(className));
    });
    
    // Inicializar funciones
    lazyLoadImages();
    animatePizzaSlices();
    
    // Agregar tooltips
    const whatsappButton = document.querySelector('.whatsapp-float__link');
    if (whatsappButton) {
        createTooltip(whatsappButton, '¡Chatea con nosotros!');
    }
    
    // Simular carga de imágenes
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (!img.src || img.src.includes('placeholder')) {
            // Generar URLs de placeholder realistas para pizzas
            const pizzaPlaceholders = [
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&h=300&fit=crop',
                'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=300&fit=crop'
            ];
            
            const randomPlaceholder = pizzaPlaceholders[Math.floor(Math.random() * pizzaPlaceholders.length)];
            img.src = randomPlaceholder;
        }
    });
}

// ===== EVENT LISTENERS PRINCIPALES =====
window.addEventListener('scroll', () => {
    updateHeader();
    updateActiveNavLink();
    animateOnScroll();
    parallaxEffect();
});

window.addEventListener('resize', () => {
    // Cerrar menú móvil si se cambia a desktop
    if (window.innerWidth > 768) {
        navMenu.classList.remove('show-menu');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
});

// ===== INICIALIZACIÓN AL CARGAR =====
document.addEventListener('DOMContentLoaded', initializeApp);

// ===== OPTIMIZACIÓN DE PERFORMANCE =====
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateHeader();
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}

// Reemplazar el event listener de scroll para mejor performance
window.removeEventListener('scroll', () => {
    updateHeader();
    updateActiveNavLink();
    animateOnScroll();
    parallaxEffect();
});

window.addEventListener('scroll', requestTick);

// ===== FUNCIONES DE UTILIDAD =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== SERVICE WORKER PARA PWA (OPCIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS Y TRACKING (PLACEHOLDER) =====
function trackUserInteraction(action, category, label) {
    // Aquí integrarías con Google Analytics, Facebook Pixel, etc.
    console.log(`Tracking: ${category} - ${action} - ${label}`);
}

// Trackear clics importantes
orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        trackUserInteraction('click', 'order', 'whatsapp_button');
    });
});

// ===== MODO OSCURO (OPCIONAL) =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Cargar preferencia de modo oscuro
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ===== NOTIFICACIONES PUSH (PLACEHOLDER) =====
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

// ===== GEOLOCALIZACIÓN PARA DELIVERY =====
function getDeliveryDistance() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Coordenadas aproximadas de Izamba (placeholder)
                const pizzeriaLat = -1.2345;
                const pizzeriaLng = -78.4567;
                
                const distance = calculateDistance(userLat, userLng, pizzeriaLat, pizzeriaLng);
                
                if (distance <= 10) { // 10km de radio
                    console.log(`Delivery disponible: ${distance.toFixed(1)}km`);
                } else {
                    console.log('Fuera del área de delivery');
                }
            },
            error => {
                console.log('Error getting location:', error);
            }
        );
    }
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// ===== EASTER EGG =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg: lluvia de pizzas
        createPizzaRain();
        konamiCode = [];
    }
});

function createPizzaRain() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const pizza = document.createElement('div');
            pizza.innerHTML = '🍕';
            pizza.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                font-size: 2rem;
                pointer-events: none;
                z-index: 9999;
                animation: fall 3s linear forwards;
            `;
            
            document.body.appendChild(pizza);
            
            setTimeout(() => pizza.remove(), 3000);
        }, i * 100);
    }
}

// CSS para la animación de caída
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);