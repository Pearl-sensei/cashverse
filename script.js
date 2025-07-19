 // Sample transaction data
        const transactions = [
            {
                id: 1,
                title: "Salary Deposit",
                date: "Today, 9:30 AM",
                amount: 5000,
                type: "income",
                icon: "💰"
            },
            {
                id: 2,
                title: "Netflix Subscription",
                date: "Yesterday, 2:15 PM",
                amount: -15.99,
                type: "expense",
                icon: "📺"
            },
            {
                id: 3,
                title: "Transfer to Sarah",
                date: "Yesterday, 11:45 AM",
                amount: -250,
                type: "transfer",
                icon: "👩"
            },
            {
                id: 4,
                title: "Grocery Shopping",
                date: "Jan 15, 4:30 PM",
                amount: -89.50,
                type: "expense",
                icon: "🛒"
            },
            {
                id: 5,
                title: "Investment Return",
                date: "Jan 14, 10:00 AM",
                amount: 127.35,
                type: "income",
                icon: "📈"
            },
            {
                id: 6,
                title: "Coffee Shop",
                date: "Jan 13, 8:15 AM",
                amount: -4.50,
                type: "expense",
                icon: "☕"
            },
            {
                id: 7,
                title: "Freelance Payment",
                date: "Jan 12, 3:20 PM",
                amount: 850,
                type: "income",
                icon: "💻"
            },
            {
                id: 8,
                title: "Gas Station",
                date: "Jan 11, 7:45 AM",
                amount: -45.20,
                type: "expense",
                icon: "⛽"
            }
        ];

        let currentBalance = 12547.89;
        let currentPage = 'home';

        // Page navigation system
        function showPage(pageId) {
            // Hide current page
            const currentPageEl = document.querySelector('.page.active');
            if (currentPageEl) {
                currentPageEl.classList.remove('active');
            }
            
            // Show new page
            const newPageEl = document.getElementById(pageId + '-page');
            if (newPageEl) {
                newPageEl.classList.add('active');
                currentPage = pageId;
            }
        }

        // Theme toggle functionality
        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                themeIcon.textContent = '☀️';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.textContent = '🌙';
            }
        }

        // Populate transactions
        function populateTransactions() {
            const transactionList = document.getElementById('transactionList');
            const allTransactionList = document.getElementById('allTransactionList');
            
            // Recent transactions (first 6)
            if (transactionList) {
                transactionList.innerHTML = '';
                transactions.slice(0, 6).forEach(transaction => {
                    transactionList.appendChild(createTransactionElement(transaction));
                });
            }
            
            // All transactions
            if (allTransactionList) {
                allTransactionList.innerHTML = '';
                transactions.forEach(transaction => {
                    allTransactionList.appendChild(createTransactionElement(transaction));
                });
            }
        }

        function createTransactionElement(transaction) {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-icon ${transaction.type}">
                    ${transaction.icon}
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${transaction.title}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
            `;
            return transactionItem;
        }

        // Filter transactions
        function filterTransactions() {
            const filter = document.getElementById('filterSelect').value;
            const allTransactionList = document.getElementById('allTransactionList');
            
            if (allTransactionList) {
                allTransactionList.innerHTML = '';
                const filteredTransactions = filter === 'all' 
                    ? transactions 
                    : transactions.filter(t => t.type === filter);
                
                filteredTransactions.forEach(transaction => {
                    allTransactionList.appendChild(createTransactionElement(transaction));
                });
            }
        }

        // Transfer functionality
        function selectContact(name, avatar) {
            document.getElementById('recipient').value = name;
            showNotification(`Selected ${name}`);
        }

        function setAmount(amount) {
            document.getElementById('amount').value = amount;
            
            // Update button states
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function setTopUpAmount(amount) {
            document.getElementById('topupAmount').value = amount;
            
            // Update button states
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        // Handle transfer form submission
        document.addEventListener('DOMContentLoaded', function() {
            const transferForm = document.getElementById('transferForm');
            if (transferForm) {
                transferForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const recipient = document.getElementById('recipient').value;
                    const amount = parseFloat(document.getElementById('amount').value);
                    const message = document.getElementById('message').value;
                    
                    if (amount > currentBalance) {
                        showNotification('Insufficient funds!', 'error');
                        return;
                    }
                    
                    // Add new transaction
                    const newTransaction = {
                        id: transactions.length + 1,
                        title: `Transfer to ${recipient}`,
                        date: "Just now",
                        amount: -amount,
                        type: "transfer",
                        icon: "💸"
                    };
                    
                    transactions.unshift(newTransaction);
                    currentBalance -= amount;
                    
                    // Update balance display
                    document.getElementById('balance').textContent = `${currentBalance.toFixed(2)}`;
                    
                    // Reset form
                    transferForm.reset();
                    
                    showNotification(`Successfully sent ${amount.toFixed(2)} to ${recipient}!`, 'success');
                    
                    // Go back to home and refresh transactions
                    setTimeout(() => {
                        showPage('home');
                        populateTransactions();
                    }, 1500);
                });
            }
        });

        // Bills functionality
        function payBills() {
            showNotification('Processing bill payments...', 'info');
            setTimeout(() => {
                showNotification('Bills paid successfully!', 'success');
            }, 2000);
        }

        // Top up functionality
        function processTopUp() {
            const amount = parseFloat(document.getElementById('topupAmount').value);
            const method = document.getElementById('topupMethod').value;
            
            if (!amount || amount <= 0) {
                showNotification('Please enter a valid amount', 'error');
                return;
            }
            
            // Add new transaction
            const newTransaction = {
                id: transactions.length + 1,
                title: `Top up via ${method}`,
                date: "Just now",
                amount: amount,
                type: "income",
                icon: "💳"
            };
            
            transactions.unshift(newTransaction);
            currentBalance += amount;
            
            // Update balance display
            document.getElementById('balance').textContent = `${currentBalance.toFixed(2)}`;
            
            showNotification(`Successfully added ${amount.toFixed(2)} to your account!`, 'success');
            
            // Clear form
            document.getElementById('topupAmount').value = '';
            
            setTimeout(() => {
                showPage('home');
                populateTransactions();
            }, 1500);
        }

        // Receive money functionality
        function generateQR() {
            const amount = document.getElementById('requestAmount').value;
            const message = amount ? `Generate QR for ${amount}` : 'Generate QR code';
            showNotification(message, 'success');
        }

        function shareDetails() {
            showNotification('Account details copied to clipboard!', 'success');
        }

        // Navigation functions
        function navigateTo(page) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            event.target.closest('.nav-item').classList.add('active');
            
            // Show the page
            showPage(page);
        }

        // Notification system
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            
            let bgColor = 'var(--primary-pink)';
            if (type === 'success') bgColor = 'var(--success)';
            else if (type === 'error') bgColor = 'var(--error)';
            else if (type === 'warning') bgColor = 'var(--warning)';
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${bgColor};
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                animation: slideDown 0.3s ease-out;
            `;
            notification.textContent = message;
            
            // Add animation keyframes
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateX(-50%) translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(-50%) translateY(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideDown 0.3s ease-out reverse';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // Balance animation
        function animateBalance() {
            const balanceElement = document.getElementById('balance');
            const targetAmount = currentBalance;
            let currentAmount = 0;
            const increment = targetAmount / 100;
            
            const animation = setInterval(() => {
                currentAmount += increment;
                if (currentAmount >= targetAmount) {
                    currentAmount = targetAmount;
                    clearInterval(animation);
                }
                balanceElement.textContent = `${currentAmount.toFixed(2)}`;
            }, 20);
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            populateTransactions();
            setTimeout(animateBalance, 500);
            
            // Add greeting based on time
            const now = new Date();
            const hour = now.getHours();
            let greeting;
            
            if (hour < 12) {
                greeting = "Good morning ✨";
            } else if (hour < 17) {
                greeting = "Good afternoon 🌞";
            } else {
                greeting = "Good evening 🌙";
            }
            
            const greetingEl = document.querySelector('.greeting p');
            if (greetingEl) {
                greetingEl.textContent = greeting;
            }
        });

        // Add touch effects for mobile
        document.addEventListener('touchstart', function(e) {
            const target = e.target.closest('.action-item, .card-action, .nav-item, .btn, .contact-item, .bill-item');
            if (target) {
                target.style.transform = 'scale(0.95)';
            }
        });

        document.addEventListener('touchend', function(e) {
            const target = e.target.closest('.action-item, .card-action, .nav-item, .btn, .contact-item, .bill-item');
            if (target) {
                setTimeout(() => {
                    target.style.transform = '';
                }, 100);
            }
        });