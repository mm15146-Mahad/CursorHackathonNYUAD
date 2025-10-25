/* ===================================
   Mountain Finance - JavaScript
   =================================== */

// ===================================
// Global State
// ===================================
const appState = {
    currentLevel: 5,
    currentStreak: 7,
    totalSavings: 2450,
    monthlyIncome: 4200,
    monthlyExpenses: 3100,
    monthlySavings: 1100,
    goalTarget: 5000,
    goalProgress: 49,
    rank: 14,
    totalClimbers: 200,
    expenses: []
};

// ===================================
// Initialize App
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏔️ Mountain Finance initialized!');
    
    initializeEventListeners();
    animateProgressBars();
    updateDashboard();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===================================
// Event Listeners
// ===================================
function initializeEventListeners() {
    // Log Expense Button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', openExpenseModal);
    }
    
    // Tab Navigation
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            handleTabClick(tab);
        });
    });
    
    // Upgrade Button
    const upgradeButton = document.querySelector('.upgrade-button');
    if (upgradeButton) {
        upgradeButton.addEventListener('click', handleUpgrade);
    }
    
    // Stat cards hover effects
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
}

// ===================================
// Expense Modal
// ===================================
function openExpenseModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('expenseModal');
    
    if (!modal) {
        modal = createExpenseModal();
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.btn-secondary');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    cancelBtn.addEventListener('click', () => closeModal(modal));
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Form submission
    const form = modal.querySelector('#expenseForm');
    form.addEventListener('submit', handleExpenseSubmit);
}

function createExpenseModal() {
    const modal = document.createElement('div');
    modal.id = 'expenseModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Log New Expense</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="expenseForm">
                <div class="form-group">
                    <label for="expenseName">Expense Name</label>
                    <input type="text" id="expenseName" name="expenseName" required placeholder="e.g., Groceries">
                </div>
                
                <div class="form-group">
                    <label for="expenseAmount">Amount ($)</label>
                    <input type="number" id="expenseAmount" name="expenseAmount" required min="0.01" step="0.01" placeholder="0.00">
                </div>
                
                <div class="form-group">
                    <label for="expenseCategory">Category</label>
                    <select id="expenseCategory" name="expenseCategory" required>
                        <option value="">Select a category</option>
                        <option value="food">🍔 Food & Dining</option>
                        <option value="transport">🚗 Transportation</option>
                        <option value="utilities">💡 Utilities</option>
                        <option value="entertainment">🎮 Entertainment</option>
                        <option value="health">🏥 Health</option>
                        <option value="shopping">🛍️ Shopping</option>
                        <option value="other">📦 Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="expenseDate">Date</label>
                    <input type="date" id="expenseDate" name="expenseDate" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="form-group">
                    <label for="expenseNote">Note (Optional)</label>
                    <textarea id="expenseNote" name="expenseNote" rows="3" placeholder="Add a note..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Log Expense</button>
                </div>
            </form>
        </div>
    `;
    
    return modal;
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        const form = modal.querySelector('form');
        if (form) form.reset();
    }, 300);
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const expense = {
        id: Date.now(),
        name: formData.get('expenseName'),
        amount: parseFloat(formData.get('expenseAmount')),
        category: formData.get('expenseCategory'),
        date: formData.get('expenseDate'),
        note: formData.get('expenseNote')
    };
    
    // Add expense to state
    appState.expenses.push(expense);
    appState.monthlyExpenses += expense.amount;
    appState.monthlySavings = appState.monthlyIncome - appState.monthlyExpenses;
    
    // Update streak
    appState.currentStreak++;
    
    // Show success notification
    showNotification('🎉 Expense logged! Keep climbing!', 'success');
    
    // Close modal
    const modal = document.getElementById('expenseModal');
    closeModal(modal);
    
    // Update dashboard
    updateDashboard();
    
    // Add confetti effect
    createConfetti();
}

// ===================================
// Dashboard Updates
// ===================================
function updateDashboard() {
    // Update streak
    const streakNumber = document.querySelector('.streak-card .stat-number');
    if (streakNumber) {
        animateNumber(streakNumber, appState.currentStreak);
    }
    
    // Update savings
    const savingsNumber = document.querySelector('.savings-card .stat-number');
    if (savingsNumber) {
        animateNumber(savingsNumber, appState.totalSavings, true);
    }
    
    // Update cash flow
    updateCashFlow();
}

function updateCashFlow() {
    const incomeAmount = document.querySelector('.flow-item.income .flow-amount');
    const expensesAmount = document.querySelector('.flow-item.expenses .flow-amount');
    const savingsAmount = document.querySelector('.flow-item.savings .flow-amount');
    
    if (incomeAmount) animateNumber(incomeAmount, appState.monthlyIncome, true);
    if (expensesAmount) animateNumber(expensesAmount, appState.monthlyExpenses, true);
    if (savingsAmount) animateNumber(savingsAmount, appState.monthlySavings, true);
}

function animateNumber(element, targetValue, isCurrency = false) {
    const duration = 1000;
    const startValue = parseFloat(element.textContent.replace(/[$,]/g, '')) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        if (isCurrency) {
            element.textContent = `$${Math.floor(currentValue).toLocaleString()}`;
        } else {
            element.textContent = Math.floor(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===================================
// Progress Bar Animations
// ===================================
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 300 * (index + 1));
    });
}

// ===================================
// Tab Navigation
// ===================================
function handleTabClick(clickedTab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    clickedTab.classList.add('active');
    
    // Get tab content
    const tabText = clickedTab.textContent.trim();
    
    // Show notification based on tab
    if (tabText.includes('Dashboard')) {
        showNotification('📊 Dashboard view', 'info');
    } else if (tabText.includes('Transaction')) {
        showNotification('📝 Transaction log coming soon!', 'info');
    } else if (tabText.includes('Settings')) {
        showNotification('⚙️ Settings coming soon!', 'info');
    }
}

// ===================================
// Notifications
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#50C878' : type === 'error' ? '#FF6B6B' : '#4A90E2',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        zIndex: 3000,
        fontWeight: '600',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to the page
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===================================
// Confetti Effect
// ===================================
function createConfetti() {
    const colors = ['#FF6B6B', '#4A90E2', '#50C878', '#f39c12', '#9b59b6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const xMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { transform: 'translateY(0px) translateX(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) translateX(${xMovement}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// ===================================
// Upgrade Handler
// ===================================
function handleUpgrade() {
    showNotification('🚀 Premium features coming soon! Stay tuned!', 'info');
    
    // Add a shake animation to the button
    const upgradeBtn = document.querySelector('.upgrade-button');
    upgradeBtn.style.animation = 'shake 0.5s ease';
    
    setTimeout(() => {
        upgradeBtn.style.animation = '';
    }, 500);
}

// Add shake animation
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyles);

// ===================================
// Sound Effects (Optional)
// ===================================
function playHoverSound() {
    // You can add actual sound files here
    // For now, we'll just use visual feedback
}

// ===================================
// User Position Animation
// ===================================
function animateUserPosition() {
    const userPosition = document.querySelector('.user-position');
    if (userPosition) {
        // Add climbing animation based on progress
        setInterval(() => {
            const currentY = parseFloat(userPosition.getAttribute('cy'));
            // Subtle movement
            userPosition.setAttribute('cy', currentY + Math.sin(Date.now() / 1000) * 2);
        }, 50);
    }
}

// ===================================
// Keyboard Shortcuts
// ===================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + E to open expense modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        openExpenseModal();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            closeModal(modal);
        }
    }
});

// ===================================
// Dark Mode Toggle (Easter Egg)
// ===================================
let darkModeEnabled = false;

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + D for dark mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDarkMode();
    }
});

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    document.body.style.filter = darkModeEnabled ? 'invert(1) hue-rotate(180deg)' : '';
    showNotification(darkModeEnabled ? '🌙 Dark mode ON' : '☀️ Dark mode OFF', 'info');
}

// ===================================
// Performance Monitoring
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`🚀 Page loaded in ${loadTime.toFixed(2)}ms`);
    });
}

// ===================================
// Welcome Message
// ===================================
setTimeout(() => {
    console.log('%c🏔️ Mountain Finance', 'font-size: 24px; font-weight: bold; color: #4A90E2;');
    console.log('%cKeep climbing to financial freedom!', 'font-size: 14px; color: #50C878;');
    console.log('%cKeyboard Shortcuts:', 'font-size: 12px; font-weight: bold; margin-top: 10px;');
    console.log('%c  • Ctrl/Cmd + E: Log Expense', 'font-size: 12px;');
    console.log('%c  • Ctrl/Cmd + Shift + D: Toggle Dark Mode', 'font-size: 12px;');
    console.log('%c  • Escape: Close Modal', 'font-size: 12px;');
}, 1000);

// ===================================
// Export for testing (optional)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        updateDashboard,
        openExpenseModal,
        showNotification
    };
}

