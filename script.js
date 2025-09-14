// DOM Elements
const customerForm = document.getElementById('customerForm');
const successModal = document.getElementById('successModal');

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAQ Toggle functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validateForm(formData) {
    const errors = [];
    
    // Validate required fields
    if (!formData.nombre.trim()) {
        errors.push('El nombre es requerido');
    }
    
    if (!formData.email.trim()) {
        errors.push('El email es requerido');
    } else if (!validateEmail(formData.email)) {
        errors.push('El email no tiene un formato válido');
    }
    
    if (formData.telefono && !validatePhone(formData.telefono)) {
        errors.push('El teléfono no tiene un formato válido');
    }
    
    if (!formData.tipo) {
        errors.push('Debe seleccionar un tipo de consulta');
    }
    
    if (!formData.mensaje.trim()) {
        errors.push('El mensaje es requerido');
    } else if (formData.mensaje.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

// Show error messages
function showErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    errors.forEach(error => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            background: #fdf2f2;
            border: 1px solid #e74c3c;
            padding: 0.5rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        `;
        errorDiv.textContent = error;
        customerForm.insertBefore(errorDiv, customerForm.firstChild);
    });
}

// Show success modal
function showModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Form submission handler
function handleFormSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        tipo: document.getElementById('tipo').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    // Validate form
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Remove any existing error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        customerForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showModal();
        
        // Log form data (in real application, send to server)
        console.log('Formulario enviado:', formData);
        
        // Store submission in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('customerSubmissions') || '[]');
        submissions.push({
            ...formData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('customerSubmissions', JSON.stringify(submissions));
        
    }, 2000);
}

// Real-time form validation
function setupRealTimeValidation() {
    const inputs = customerForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(field.id) {
        case 'nombre':
            if (!value) {
                isValid = false;
                errorMessage = 'El nombre es requerido';
            }
            break;
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'El email es requerido';
            } else if (!validateEmail(value)) {
                isValid = false;
                errorMessage = 'Email no válido';
            }
            break;
        case 'telefono':
            if (value && !validatePhone(value)) {
                isValid = false;
                errorMessage = 'Teléfono no válido';
            }
            break;
        case 'tipo':
            if (!value) {
                isValid = false;
                errorMessage = 'Seleccione un tipo de consulta';
            }
            break;
        case 'mensaje':
            if (!value) {
                isValid = false;
                errorMessage = 'El mensaje es requerido';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mínimo 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    errorDiv.textContent = message;
    
    field.style.borderColor = '#e74c3c';
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e0e0e0';
}

// Navigation highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Add active class styles for navigation
function addNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav a.active {
            color: #e74c3c !important;
            background-color: rgba(255,255,255,0.1) !important;
        }
    `;
    document.head.appendChild(style);
}

// Animate elements on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.contact-item, .hours-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Character counter for textarea
function addCharacterCounter() {
    const textarea = document.getElementById('mensaje');
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #666;
        margin-top: 0.25rem;
    `;
    
    function updateCounter() {
        const length = textarea.value.length;
        counter.textContent = `${length}/500 caracteres`;
        
        if (length > 500) {
            counter.style.color = '#e74c3c';
            textarea.style.borderColor = '#e74c3c';
        } else {
            counter.style.color = '#666';
            textarea.style.borderColor = '#e0e0e0';
        }
    }
    
    textarea.setAttribute('maxlength', '500');
    textarea.parentElement.appendChild(counter);
    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up form submission
    if (customerForm) {
        customerForm.addEventListener('submit', handleFormSubmission);
        setupRealTimeValidation();
        addCharacterCounter();
    }
    
    // Set up modal close on outside click
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            closeModal();
        }
    });
    
    // Set up navigation highlighting
    highlightActiveSection();
    addNavigationStyles();
    
    // Set up scroll animations
    animateOnScroll();
    
    // Add smooth scrolling to navigation links
    document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    // Close modal with Escape key
    if (event.key === 'Escape' && successModal.style.display === 'block') {
        closeModal();
    }
    
    // Navigate FAQ with keyboard
    if (event.target.classList.contains('faq-question')) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleFAQ(event.target);
        }
    }
});

// Add ARIA attributes for accessibility
function enhanceAccessibility() {
    // Add ARIA attributes to FAQ items
    document.querySelectorAll('.faq-question').forEach((question, index) => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        
        const answer = question.nextElementSibling;
        answer.setAttribute('id', `faq-answer-${index}`);
        answer.setAttribute('role', 'region');
    });
    
    // Update ARIA attributes when FAQ is toggled
    const originalToggleFAQ = window.toggleFAQ;
    window.toggleFAQ = function(element) {
        originalToggleFAQ(element);
        const isExpanded = element.parentElement.classList.contains('active');
        element.setAttribute('aria-expanded', isExpanded);
    };
}

// Call accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Export functions for global access
window.scrollToSection = scrollToSection;
window.toggleFAQ = toggleFAQ;
window.closeModal = closeModal;
