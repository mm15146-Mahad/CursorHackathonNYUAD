// Gamified Budget Tracker - Main JavaScript File

class BudgetTracker {
    constructor() {
        this.currentPage = 'home';
        this.userData = {
            points: 2450, // Simplified representation of financial health
            streak: 12,
            rank: 3,
            level: 7,
            progress: 70,
            bankBalance: 2450.00,
            bankConnected: false,
            spending: {
                housing: 1200,
                food: 800,
                transportation: 600,
                entertainment: 400,
                utilities: 300,
                shopping: 200
            },
            income: 4500,
            goals: {
                monthlySavings: 1000,
                dailyLimit: 50,
                emergencyFund: 5000
            },
            settings: {
                theme: 'default',
                notifications: {
                    dailyReminders: true,
                    budgetAlerts: true,
                    weeklyReports: false,
                    achievements: true
                },
                privacy: {
                    shareProgress: true,
                    showBalance: false,
                    allowData: true
                },
                profile: {
                    displayName: 'Budget Hiker',
                    avatar: 'hiking'
                }
            }
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.updateDisplay();
        this.animateHiker();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });
    }

    setupEventListeners() {
        // Quick action buttons
        const addTransactionBtn = document.querySelector('.action-btn.primary');
        const scanReceiptBtn = document.querySelector('.action-btn.secondary');
        
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                this.showAddTransactionModal();
            });
        }
        
        if (scanReceiptBtn) {
            scanReceiptBtn.addEventListener('click', () => {
                this.showScanReceiptModal();
            });
        }

        // Mountain interactions
        const mountains = document.querySelectorAll('.mountain');
        mountains.forEach(mountain => {
            mountain.addEventListener('click', () => {
                this.showCategoryDetails(mountain.dataset.category);
            });
        });

        // Invite button
        const inviteBtn = document.querySelector('.invite-btn');
        if (inviteBtn) {
            inviteBtn.addEventListener('click', () => {
                this.showInviteModal();
            });
        }

        // Bank connection buttons
        const applePayBtn = document.getElementById('apple-pay-btn');
        const googlePayBtn = document.getElementById('google-pay-btn');
        const manualBankBtn = document.getElementById('manual-bank-btn');

        if (applePayBtn) {
            applePayBtn.addEventListener('click', () => {
                this.connectBankAccount('apple-pay');
            });
        }

        if (googlePayBtn) {
            googlePayBtn.addEventListener('click', () => {
                this.connectBankAccount('google-pay');
            });
        }

        if (manualBankBtn) {
            manualBankBtn.addEventListener('click', () => {
                this.showManualBankModal();
            });
        }

        // Customize page event listeners
        this.setupCustomizePage();
        this.setupSettingsPage();
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page display
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        this.currentPage = page;
        
        // Page-specific animations
        if (page === 'spendings') {
            this.animateMountains();
        }
    }

    updateDisplay() {
        // Update stats
        document.getElementById('points-display').textContent = this.userData.points.toLocaleString();
        document.getElementById('streak-display').textContent = this.userData.streak;
        document.getElementById('rank-display').textContent = `#${this.userData.rank}`;

        // Update hiker position on mountain
        const hiker = document.getElementById('hiker-position');
        if (hiker) {
            // Calculate position based on level (1-10)
            const level = this.userData.level;
            const positions = {
                1: { bottom: '20px', left: '15%' },
                2: { bottom: '50px', left: '25%' },
                3: { bottom: '80px', left: '35%' },
                4: { bottom: '110px', left: '45%' },
                5: { bottom: '140px', left: '50%' },
                6: { bottom: '170px', left: '48%' },
                7: { bottom: '200px', left: '46%' },
                8: { bottom: '230px', left: '47%' },
                9: { bottom: '260px', left: '48%' },
                10: { bottom: '290px', left: '49%' }
            };
            
            const position = positions[level] || positions[7];
            hiker.style.bottom = position.bottom;
            hiker.style.left = position.left;
        }

        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${this.userData.progress}%`;
        }

        // Update spending data
        this.updateSpendingDisplay();
    }

    updateSpendingDisplay() {
        const mountains = document.querySelectorAll('.mountain');
        mountains.forEach(mountain => {
            const category = mountain.dataset.category;
            const amount = this.userData.spending[category];
            const percentage = (amount / this.userData.income) * 100;
            
            mountain.dataset.amount = amount;
            mountain.dataset.percentage = percentage.toFixed(1);
            
            const valueEl = mountain.querySelector('.mountain-value');
            if (valueEl) {
                valueEl.textContent = `$${amount.toLocaleString()}`;
            }
        });

        // Update summary
        const totalSpent = Object.values(this.userData.spending).reduce((sum, amount) => sum + amount, 0);
        const remaining = this.userData.income - totalSpent;
        const savingsRate = ((remaining / this.userData.income) * 100).toFixed(1);

        const summaryCards = document.querySelectorAll('.summary-card');
        if (summaryCards.length >= 3) {
            summaryCards[0].querySelector('.summary-value').textContent = `$${totalSpent.toLocaleString()}`;
            summaryCards[1].querySelector('.summary-value').textContent = `$${remaining.toLocaleString()}`;
            summaryCards[2].querySelector('.summary-value').textContent = `${savingsRate}%`;
        }
    }

    animateHiker() {
        const hiker = document.getElementById('hiker-position');
        if (hiker) {
            // Add random movement animation
            setInterval(() => {
                const randomOffset = (Math.random() - 0.5) * 10;
                hiker.style.transform = `translateX(-50%) translateY(${randomOffset}px)`;
            }, 3000);
        }
    }

    animateMountains() {
        const mountains = document.querySelectorAll('.mountain');
        mountains.forEach((mountain, index) => {
            mountain.style.opacity = '0';
            mountain.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                mountain.style.transition = 'all 0.6s ease';
                mountain.style.opacity = '1';
                mountain.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    showAddTransactionModal() {
        // Create modal for adding transactions
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Transaction</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="transaction-form">
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" id="amount" placeholder="0.00" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select id="category" required>
                                <option value="">Select Category</option>
                                <option value="housing">Housing</option>
                                <option value="food">Food</option>
                                <option value="transportation">Transportation</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="utilities">Utilities</option>
                                <option value="shopping">Shopping</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" id="description" placeholder="Transaction description">
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select id="type" required>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <button type="submit" class="submit-btn">Add Transaction</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #333;
            }
            .form-group input,
            .form-group select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #667eea;
            }
            .submit-btn {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });

        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });
    }

    addTransaction() {
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const type = document.getElementById('type').value;
        
        if (type === 'expense') {
            this.userData.spending[category] += amount;
            this.userData.bankBalance -= amount;
            
            // Points system: Simplified representation of financial health
            // Smart spending = more points, overspending = fewer points
            const dailyLimit = this.userData.goals.dailyLimit;
            const isSmartSpending = amount <= dailyLimit;
            
            if (isSmartSpending) {
                this.userData.points += Math.floor(amount / 5); // More points for smart spending
                this.userData.streak += 1; // Maintain streak
            } else {
                this.userData.points += Math.floor(amount / 20); // Fewer points for overspending
                this.userData.streak = Math.max(0, this.userData.streak - 1); // Break streak
            }
            
            // Update level based on spending behavior (not just balance)
            this.updateLevelFromSpendingBehavior();
        } else {
            this.userData.income += amount;
            this.userData.bankBalance += amount;
            this.userData.points += Math.floor(amount / 25); // Income gives good points
            this.userData.streak += 1; // Income maintains streak
            
            // Update level based on income
            this.updateLevelFromSpendingBehavior();
        }
        
        this.updateDisplay();
        this.showNotification(`${type === 'expense' ? 'Expense' : 'Income'} added successfully!`);
    }

    updateLevelFromSpendingBehavior() {
        // Update level based on spending behavior and financial health
        const points = this.userData.points;
        const streak = this.userData.streak;
        const totalSpent = Object.values(this.userData.spending).reduce((sum, amount) => sum + amount, 0);
        const savingsRate = ((this.userData.income - totalSpent) / this.userData.income) * 100;
        
        // Level calculation based on multiple factors
        let newLevel = 1;
        
        if (points >= 5000 && streak >= 30 && savingsRate >= 20) newLevel = 10;
        else if (points >= 4500 && streak >= 25 && savingsRate >= 18) newLevel = 9;
        else if (points >= 4000 && streak >= 20 && savingsRate >= 15) newLevel = 8;
        else if (points >= 3500 && streak >= 15 && savingsRate >= 12) newLevel = 7;
        else if (points >= 3000 && streak >= 10 && savingsRate >= 10) newLevel = 6;
        else if (points >= 2500 && streak >= 7 && savingsRate >= 8) newLevel = 5;
        else if (points >= 2000 && streak >= 5 && savingsRate >= 5) newLevel = 4;
        else if (points >= 1500 && streak >= 3 && savingsRate >= 3) newLevel = 3;
        else if (points >= 1000 && streak >= 2) newLevel = 2;
        else newLevel = 1;
        
        this.userData.level = newLevel;
        this.userData.progress = ((points % 500) / 500) * 100;
    }

    showScanReceiptModal() {
        this.showNotification('Receipt scanning feature coming soon! 📸');
    }

    showCategoryDetails(category) {
        const categoryNames = {
            housing: 'Housing',
            food: 'Food',
            transportation: 'Transportation',
            entertainment: 'Entertainment',
            utilities: 'Utilities',
            shopping: 'Shopping'
        };

        const amount = this.userData.spending[category];
        const percentage = ((amount / this.userData.income) * 100).toFixed(1);
        
        this.showNotification(`${categoryNames[category]}: $${amount.toLocaleString()} (${percentage}% of income)`);
    }

    showInviteModal() {
        this.showNotification('Invite feature coming soon! 📱');
    }

    connectBankAccount(provider) {
        // Simulate bank connection process
        this.showNotification(`Connecting to ${provider}...`);
        
        setTimeout(() => {
            this.userData.bankConnected = true;
            this.userData.bankBalance = 2450.00;
            
            // Show connection status
            const connectionStatus = document.getElementById('connection-status');
            if (connectionStatus) {
                connectionStatus.style.display = 'block';
            }
            
            // Update points to reflect bank balance
            this.userData.points = Math.floor(this.userData.bankBalance);
            this.updateDisplay();
            
            this.showNotification(`Successfully connected to ${provider}! 🎉`);
        }, 2000);
    }

    showManualBankModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Bank Account Manually</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="manual-bank-form">
                        <div class="form-group">
                            <label>Bank Name</label>
                            <input type="text" id="bank-name" placeholder="e.g., Chase Bank" required>
                        </div>
                        <div class="form-group">
                            <label>Account Number</label>
                            <input type="text" id="account-number" placeholder="Enter account number" required>
                        </div>
                        <div class="form-group">
                            <label>Routing Number</label>
                            <input type="text" id="routing-number" placeholder="Enter routing number" required>
                        </div>
                        <div class="form-group">
                            <label>Current Balance</label>
                            <input type="number" id="current-balance" placeholder="0.00" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Account Type</label>
                            <select id="account-type" required>
                                <option value="">Select Account Type</option>
                                <option value="checking">Checking</option>
                                <option value="savings">Savings</option>
                            </select>
                        </div>
                        <button type="submit" class="submit-btn">Connect Account</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        document.getElementById('manual-bank-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.connectManualBank();
            document.body.removeChild(modal);
        });
    }

    connectManualBank() {
        const bankName = document.getElementById('bank-name').value;
        const balance = parseFloat(document.getElementById('current-balance').value);
        
        this.userData.bankConnected = true;
        this.userData.bankBalance = balance;
        this.userData.points = Math.floor(balance);
        
        // Update connection status
        const connectionStatus = document.getElementById('connection-status');
        if (connectionStatus) {
            const bankNameEl = connectionStatus.querySelector('.bank-name');
            const balanceEl = connectionStatus.querySelector('.account-balance');
            
            if (bankNameEl) bankNameEl.textContent = bankName;
            if (balanceEl) balanceEl.textContent = `Current Balance: $${balance.toLocaleString()}`;
            
            connectionStatus.style.display = 'block';
        }
        
        this.updateDisplay();
        this.showNotification(`Successfully connected ${bankName} account! 🏦`);
    }

    setupSettingsPage() {
        // Account management
        const changePasswordBtn = document.querySelector('.change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.showChangePasswordModal();
            });
        }

        // Category management (Settings page)
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.addNewCategory();
            });
        }

        // Goals settings
        const goalsInputs = document.querySelectorAll('#savings-goal, #daily-limit, #emergency-fund');
        goalsInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateGoals();
            });
        });

        // Data management buttons
        const exportBtn = document.querySelector('.export-btn');
        const backupBtn = document.querySelector('.backup-btn');
        const clearDataBtn = document.querySelector('.clear-data-btn');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.createBackup();
            });
        }

        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                this.clearAllData();
            });
        }

        // Save settings button (Settings page)
        const settingsSaveBtn = document.querySelector('#settings-page .save-btn');
        if (settingsSaveBtn) {
            settingsSaveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    setupCustomizePage() {
        // Disposable income slider and input
        const disposableSlider = document.getElementById('disposable-income-slider');
        const disposableInput = document.getElementById('disposable-income-input');
        const disposableValue = document.getElementById('disposable-income-value');
        const barFill = document.getElementById('bar-fill');
        const remainingFill = document.getElementById('remaining-fill');
        const feedbackIndicator = document.getElementById('feedback-indicator');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackText = document.getElementById('feedback-text');
        const feedbackIcon = document.querySelector('.feedback-icon i');

        if (disposableSlider && disposableInput && disposableValue) {
            // Sync slider and input
            disposableSlider.addEventListener('input', () => {
                const value = disposableSlider.value;
                disposableInput.value = value;
                disposableValue.textContent = value;
                this.updateBudgetVisualization(parseInt(value));
            });

            disposableInput.addEventListener('input', () => {
                const value = disposableInput.value;
                disposableSlider.value = value;
                disposableValue.textContent = value;
                this.updateBudgetVisualization(parseInt(value));
            });

            // Initial update
            this.updateBudgetVisualization(parseInt(disposableSlider.value));
        }

        // Theme selection
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.changeTheme(option.dataset.theme);
            });
        });

        // Profile settings (Customize page)
        const displayNameInput = document.getElementById('display-name');
        if (displayNameInput) {
            displayNameInput.addEventListener('change', () => {
                this.userData.settings.profile.displayName = displayNameInput.value;
            });
        }

        // Avatar selection
        const avatarOptions = document.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                avatarOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.userData.settings.profile.avatar = option.querySelector('i').className;
            });
        });

        // Goals inputs
        const goalInputs = document.querySelectorAll('#emergency-fund-goal, #vacation-fund-goal, #investment-fund-goal');
        goalInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateGoalProgress(input);
            });
        });

        // Save customizations button
        const customizeSaveBtn = document.querySelector('#customize-page .save-btn');
        if (customizeSaveBtn) {
            customizeSaveBtn.addEventListener('click', () => {
                this.saveCustomizations();
            });
        }
    }

    updateBudgetVisualization(disposableIncome) {
        const totalBudget = 3000; // Fixed total budget for demo
        const percentage = (disposableIncome / totalBudget) * 100;
        const remainingPercentage = ((totalBudget - disposableIncome) / totalBudget) * 100;

        // Update bar fills
        const barFill = document.getElementById('bar-fill');
        const remainingFill = document.getElementById('remaining-fill');
        const feedbackIndicator = document.getElementById('feedback-indicator');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackText = document.getElementById('feedback-text');
        const feedbackIcon = document.querySelector('.feedback-icon i');

        if (barFill) {
            barFill.style.width = `${percentage}%`;
            
            // Update colors based on percentage
            barFill.classList.remove('safe', 'warning', 'danger');
            if (percentage <= 50) {
                barFill.classList.add('safe');
            } else if (percentage <= 80) {
                barFill.classList.add('warning');
            } else {
                barFill.classList.add('danger');
            }
        }

        if (remainingFill) {
            remainingFill.style.width = `${remainingPercentage}%`;
        }

        // Update feedback
        if (feedbackIndicator && feedbackTitle && feedbackText && feedbackIcon) {
            feedbackIndicator.classList.remove('safe', 'warning', 'danger');
            
            if (percentage <= 50) {
                feedbackIndicator.classList.add('safe');
                feedbackIcon.className = 'fas fa-check-circle';
                feedbackTitle.textContent = 'Great Choice!';
                feedbackText.textContent = 'Your disposable income target is well within your budget. You\'re on track for healthy savings!';
            } else if (percentage <= 80) {
                feedbackIndicator.classList.add('warning');
                feedbackIcon.className = 'fas fa-exclamation-triangle';
                feedbackTitle.textContent = 'Approaching Limit';
                feedbackText.textContent = 'Your disposable income is getting close to your budget limit. Consider reducing it to maintain healthy savings.';
            } else {
                feedbackIndicator.classList.add('danger');
                feedbackIcon.className = 'fas fa-times-circle';
                feedbackTitle.textContent = 'Over Budget!';
                feedbackText.textContent = 'Your disposable income exceeds your budget. This will impact your savings goals. Please adjust your target.';
            }
        }
    }

    updateGoalProgress(input) {
        const goalId = input.id;
        const goalValue = parseInt(input.value);
        
        // Find the corresponding progress bar and text
        const goalItem = input.closest('.goal-item');
        const progressFill = goalItem.querySelector('.progress-fill');
        const progressText = goalItem.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            // Simulate current progress (in real app, this would come from actual data)
            let currentAmount = 0;
            let percentage = 0;
            
            switch (goalId) {
                case 'emergency-fund-goal':
                    currentAmount = 1500;
                    percentage = Math.min((currentAmount / goalValue) * 100, 100);
                    break;
                case 'vacation-fund-goal':
                    currentAmount = 300;
                    percentage = Math.min((currentAmount / goalValue) * 100, 100);
                    break;
                case 'investment-fund-goal':
                    currentAmount = 500;
                    percentage = Math.min((currentAmount / goalValue) * 100, 100);
                    break;
            }
            
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `$${currentAmount.toLocaleString()} / $${goalValue.toLocaleString()}`;
        }
    }

    changeTheme(theme) {
        this.userData.settings.theme = theme;
        // Apply theme changes (simplified for demo)
        this.showNotification(`Theme changed to ${theme}! 🎨`);
    }

    addNewCategory() {
        const input = document.getElementById('new-category');
        const categoryName = input.value.trim();
        
        if (categoryName && !this.userData.spending[categoryName.toLowerCase()]) {
            this.userData.spending[categoryName.toLowerCase()] = 0;
            
            // Add to UI
            const categoryList = document.getElementById('category-list');
            const newCategory = document.createElement('div');
            newCategory.className = 'category-item';
            newCategory.innerHTML = `
                <span class="category-name">${categoryName}</span>
                <div class="category-actions">
                    <button class="edit-category"><i class="fas fa-edit"></i></button>
                    <button class="delete-category"><i class="fas fa-trash"></i></button>
                </div>
            `;
            categoryList.appendChild(newCategory);
            
            input.value = '';
            this.showNotification(`Category "${categoryName}" added! 📝`);
        } else {
            this.showNotification('Category already exists or name is empty! ⚠️');
        }
    }

    updateGoals() {
        const savingsGoal = document.getElementById('savings-goal').value;
        const dailyLimit = document.getElementById('daily-limit').value;
        const emergencyFund = document.getElementById('emergency-fund').value;
        
        this.userData.goals.monthlySavings = parseFloat(savingsGoal) || 1000;
        this.userData.goals.dailyLimit = parseFloat(dailyLimit) || 50;
        this.userData.goals.emergencyFund = parseFloat(emergencyFund) || 5000;
        
        this.showNotification('Goals updated! 🎯');
    }

    saveAllSettings() {
        // Save all settings to localStorage (simplified)
        localStorage.setItem('budgetTrackerSettings', JSON.stringify(this.userData.settings));
        this.showNotification('All settings saved successfully! 💾');
    }

    showChangePasswordModal() {
        this.showNotification('Change password feature coming soon! 🔐');
    }

    exportData() {
        // Create CSV data
        const csvData = this.createCSVData();
        this.downloadCSV(csvData, 'budget-data.csv');
        this.showNotification('Data exported successfully! 📊');
    }

    createCSVData() {
        const headers = ['Date', 'Category', 'Amount', 'Type', 'Description'];
        const rows = [
            ['2024-01-01', 'Housing', '1200', 'Expense', 'Rent'],
            ['2024-01-02', 'Food', '50', 'Expense', 'Groceries'],
            ['2024-01-03', 'Income', '3000', 'Income', 'Salary']
        ];
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(csvData, filename) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    createBackup() {
        const backupData = {
            userData: this.userData,
            timestamp: new Date().toISOString()
        };
        
        const backupJson = JSON.stringify(backupData, null, 2);
        const blob = new Blob([backupJson], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budget-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Backup created successfully! 💾');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.userData = {
                points: 0,
                streak: 0,
                rank: 999,
                level: 1,
                progress: 0,
                bankBalance: 0,
                bankConnected: false,
                spending: {},
                income: 0,
                goals: {
                    monthlySavings: 0,
                    dailyLimit: 0,
                    emergencyFund: 0
                },
                settings: this.userData.settings // Keep settings
            };
            
            this.updateDisplay();
            this.showNotification('All data cleared! 🗑️');
        }
    }

    saveSettings() {
        localStorage.setItem('budgetTrackerSettings', JSON.stringify(this.userData.settings));
        localStorage.setItem('budgetTrackerGoals', JSON.stringify(this.userData.goals));
        this.showNotification('Settings saved successfully! ⚙️');
    }

    saveCustomizations() {
        localStorage.setItem('budgetTrackerCustomizations', JSON.stringify({
            theme: this.userData.settings.theme,
            profile: this.userData.settings.profile,
            visual: this.userData.settings.visual || {},
            mountain: this.userData.settings.mountain || {},
            layout: this.userData.settings.layout || {}
        }));
        this.showNotification('Customizations saved successfully! 🎨');
    }

    changeMountainType(type) {
        this.userData.settings.mountain = this.userData.settings.mountain || {};
        this.userData.settings.mountain.type = type;
        this.showNotification(`Mountain type changed to ${type}! 🏔️`);
    }

    changeHikerCharacter(character) {
        this.userData.settings.mountain = this.userData.settings.mountain || {};
        this.userData.settings.mountain.character = character;
        this.showNotification(`Hiker character changed to ${character}! 🧗`);
    }

    changeCardSize(size) {
        this.userData.settings.layout = this.userData.settings.layout || {};
        this.userData.settings.layout.cardSize = size;
        this.showNotification(`Card size changed to ${size}! 📏`);
    }

    changeGridLayout(layout) {
        this.userData.settings.layout = this.userData.settings.layout || {};
        this.userData.settings.layout.gridLayout = layout;
        this.showNotification(`Grid layout changed to ${layout}! 📐`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 3000);
    }

    // Simulate real-time updates
    startSimulation() {
        setInterval(() => {
            // Randomly update points
            if (Math.random() < 0.1) {
                this.userData.points += Math.floor(Math.random() * 10) + 1;
                this.updateDisplay();
            }

            // Randomly update streak
            if (Math.random() < 0.05) {
                this.userData.streak += 1;
                this.updateDisplay();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new BudgetTracker();
    app.startSimulation();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to mountains
    const mountains = document.querySelectorAll('.mountain');
    mountains.forEach(mountain => {
        mountain.addEventListener('click', () => {
            mountain.style.transform = 'scale(0.95)';
            setTimeout(() => {
                mountain.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add leaderboard item animations
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    leaderboardItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
});
