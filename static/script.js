// ============================================================================
// UTILITAIRES
// ============================================================================

// Fonction de log
function log(message) {
    console.log(`[Parkinson App] ${message}`);
}

// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#66bb6a' : '#ef5350'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================================
// ANIMATIONS
// ============================================================================

// Ajouter les keyframes d'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    log('Initialisation de l\'application');
    
    // Initialiser les animations
    initializeAnimations();
    
    // Initialiser les interactions
    initializeInteractions();
});

// ============================================================================
// ANIMATIONS
// ============================================================================

function initializeAnimations() {
    // Animation des cartes au scroll
    const cards = document.querySelectorAll('.feature-card, .patient-card, .stat-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.5s ease';
                }
            });
        }, {
            threshold: 0.1
        });
        
        cards.forEach(card => observer.observe(card));
    }
}

// ============================================================================
// INTERACTIONS
// ============================================================================

function initializeInteractions() {
    // Initialiser les modales
    initializeModals();
    
    // Initialiser les confirmations
    initializeConfirmations();
}

function initializeModals() {
    const modals = document.querySelectorAll('[data-modal]');
    
    modals.forEach(modal => {
        const openButtons = document.querySelectorAll(`[data-modal-open="${modal.id}"]`);
        const closeButton = modal.querySelector('[data-modal-close]');
        
        openButtons.forEach(btn => {
            btn.addEventListener('click', () => modal.style.display = 'block');
        });
        
        if (closeButton) {
            closeButton.addEventListener('click', () => modal.style.display = 'none');
        }
    });
}

function initializeConfirmations() {
    const confirmButtons = document.querySelectorAll('[data-confirm]');
    
    confirmButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm');
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
}

// ============================================================================
// VALIDATION DE FORMULAIRE
// ============================================================================

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef5350';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

// ============================================================================
// GESTION DES FORMULAIRES
// ============================================================================

function submitForm(formId, endpoint, redirectUrl = null) {
    if (!validateForm(formId)) {
        showNotification('Veuillez remplir tous les champs requis', 'error');
        return;
    }
    
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Formulaire soumis avec succès');
            if (redirectUrl) {
                setTimeout(() => window.location.href = redirectUrl, 1000);
            }
        } else {
            showNotification('Une erreur est survenue', 'error');
        }
    })
    .catch(error => {
        log(`Erreur: ${error}`);
        showNotification('Une erreur est survenue', 'error');
    });
}

// ============================================================================
// UTILITAIRES DE DATE
// ============================================================================

function formatDate(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}

function formatDateTime(dateTime) {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTime).toLocaleDateString('fr-FR', options);
}

// ============================================================================
// GESTION DU STOCKAGE LOCAL
// ============================================================================

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        log(`Erreur de sauvegarde: ${error}`);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        log(`Erreur de lecture: ${error}`);
        return null;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        log(`Erreur de suppression: ${error}`);
        return false;
    }
}

// ============================================================================
// GESTION DES THÈMES
// ============================================================================

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    log(`Thème changé en: ${theme}`);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// ============================================================================
// EXPORT DES DONNÉES
// ============================================================================

function exportToCSV(data, filename) {
    const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function exportToJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ============================================================================
// IMPRESSION
// ============================================================================

function printPage() {
    window.print();
}

function printElement(elementId) {
    const element = document.getElementById(elementId);
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<pre>' + element.innerHTML + '</pre>');
    printWindow.document.close();
    printWindow.print();
}

// ============================================================================
// API CALLS
// ============================================================================

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        log(`Erreur API: ${error}`);
        showNotification('Erreur de communication avec le serveur', 'error');
        throw error;
    }
}

// ============================================================================
// RECHERCHE ET FILTRAGE
// ============================================================================

function filterTableByColumn(inputId, tableId, columnIndex) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tbody tr');
    
    input.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const cellText = cells[columnIndex].textContent.toLowerCase();
            
            if (cellText.includes(filter)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// ============================================================================
// PAGINATION
// ============================================================================

function createPagination(totalItems, itemsPerPage, currentPage = 1) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    
    return {
        pages,
        totalPages,
        currentPage,
        startIndex: (currentPage - 1) * itemsPerPage,
        endIndex: currentPage * itemsPerPage
    };
}

// ============================================================================
// DEBOUNCE ET THROTTLE
// ============================================================================

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

// ============================================================================
// INITIALISER LE THÈME AU CHARGEMENT
// ============================================================================

initializeTheme();

log('Application prête');
