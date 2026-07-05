
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const transactionTypeInput = document.getElementById("transactionType");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const addTransactionBtn = document.getElementById("addTransactionBtn");
const clearUserTransactionsBtn = document.getElementById("clearUserTransactionsBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const saveBackupBtn = document.getElementById("saveBackupBtn");
const restoreBackupBtn = document.getElementById("loadBackupBtn");
const clearAllDataBtn = document.getElementById("clearAllDataBtn");
const exportAllUsersBtn = document.getElementById("exportAllUsersBtn");
const loginBtn = document.getElementById("loginBtn");
const passwordInput = document.getElementById("passwordInput");
const lockScreenBtn = document.getElementById("lockScreenBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const searchModalBtn = document.getElementById('searchModalBtn');
const searchModal = document.getElementById('searchModal');
const closeSearchModal = document.querySelector('.close-search-modal');
const searchInputModal = document.getElementById('searchInputModal');
const modal = document.getElementById('transactionModal');
const closeModal = document.querySelector('.close-modal');
const chartModal = document.getElementById('chartModal');
const closeChartModal = document.querySelector('.close-chart-modal');



const categories = { salary: { name: "حقوق", icon: "💼" }, food: { name: "خوراک", icon: "🍔" }, shopping: { name: "خرید", icon: "🛍" }, other: { name: "سایر", icon: "📦" } };

// array for storage users localy
let users = [];
let currentSelectedUser = null;
let balanceChart = null;

// users key for save to localstorage
const STORAGE_KEY = "users_data_v(FA)";

// password key for save to localstorage
const PASSWORD_KEY = "app_password";
const DEFAULT_PASSWORD = "1234";
let lockTimeout = null;
const LOCK_TIMEOUT_MS = 5 * 60 * 1000;// 5 minuts


// ! ========================= Save Password To Local Storage
// save password with simple encryption (btoa) to local storage
function savePassword(pwd) {
    localStorage.setItem(PASSWORD_KEY, btoa(pwd)); 
}


// ! ========================= Check Password Function
// check password functi9on
function checkPassword(inputPwd) {
    // Get saved password from localStorage
    const saved = localStorage.getItem(PASSWORD_KEY);
    // If no password was saved
    if (!saved) {
        // Save the default password
        savePassword(DEFAULT_PASSWORD);
        // Check if the entered password is the same as the default password (return true)
        return inputPwd === DEFAULT_PASSWORD; 
    }
    // If there is a stored password Convert the stored password from Base64 to plain text and compare it with the entered password
    return inputPwd === atob(saved);
}

// ! ========================== Change Password Function
// change password function
function changePassword() {

    // get current password from user
    const oldPwd = prompt("رمز فعلی را وارد کنید:");
    // check current password (authentication)
    if (oldPwd && checkPassword(oldPwd)) {
        // get new password from user 
        const newPwd = prompt("رمز جدید را وارد کنید (حداقل ۳ کاراکتر):");
        // check new password (authentication)
        if (newPwd && newPwd.length >= 3) { 
            // Save the new password
            savePassword(newPwd); 
            showMessage("✅ رمز با موفقیت تغییر کرد!", "success"); 
        } else {
            showLoginError("رمز جدید باید حداقل 4 کاراکتر باشد!");
            return false;
        }
    } 
    else {
        // If the current password was incorrect
        showLoginError("❌ رمز فعلی اشتباه است !");
        return false;
    };
}


// ! ======================= Lock Screen Function
// protect the application from unauthorized people by hiding the original content and displaying the login page.
function lockScreen() {
    // Show login page (lock)
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('passwordInput').value = '';
    document.getElementById('loginError').textContent = '';

    // fucus on password input after click on lock screen
    passwordInput.focus();

    // Cancel the auto-lock timer
    // If there was a timer set for auto-lock, cancel it Since the screen is now locked, there is no need for a timer to re-lock
    if (lockTimeout) clearTimeout(lockTimeout);
}


// ! =====================  Unlock Screen Function
// Checks the user's input password and, if correct, opens access to the main application.
function unlockScreen(password) {
    // Check password correctness
    if ( password && checkPassword(password)) {
        // If the password was correct Hide login page and Show the main program
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('loginError').textContent = '';
        // Start auto-lock timer if If the user does nothing in 5 minutes, the page will be locked again
        startLockTimer();
        return true;
    } else {
        // If the password is incorrect: Show error message to user
        showLoginError("❌ رمز عبور اشتباه است!"); 
        passwordInput.value = '';
        return false; 
    }
}


// ! ====================== Start Lock Timer Function
// Increase app security by automatically locking the screen after a period of user inactivity
function startLockTimer() { 
    // If there is a previous timer, cancel it
    if (lockTimeout) clearTimeout(lockTimeout);
    // Set a new timer
    lockTimeout = setTimeout(() => {
        lockScreen();
    }, LOCK_TIMEOUT_MS); 
}


// ! ========================  Reset Lock Timer Function
// Reset the user's inactivity time to zero. If the user is actively working with the application, the application will not lock.
function resetLockTimer() {
    // Check if the main application is running or not
    if (document.getElementById('mainApp').style.display === 'block'){
        // Restart the timer.
        startLockTimer();
    } 
}

// ! ======================== Show Login Error Function
// display login errors (such as incorrect password) in a temporary and way
function showLoginError(msg) { 
    const messageDiv = document.createElement('div');
    messageDiv.textContent = msg;
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            padding: 15px 28px;
            border-radius: 12px;
            z-index: 20000;
            background: rgb(0, 0, 0);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
    `;
    document.body.insertAdjacentElement("afterbegin",messageDiv);
    document.getElementById("loginOverlay").style.background='linear-gradient(135deg, rgb(230, 0, 0) 0%, rgb(160, 0, 0) 100%)';
    setTimeout(() => {
        messageDiv.remove();
        document.getElementById("loginOverlay").style.background ='linear-gradient(135deg, var(--primary) 0%, rgb(5, 87, 62) 100%)';
    }, 3000);
}
    

// ! ======================== Save Array To Local Storage
// save array to local storage
function saveToLS() { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // upfateing stats
    updateStats(); 
}
    

// ! ======================== Get Array From Local Storage
// get array from local storage
function loadFromLS() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) { 
        users = JSON.parse(saved); 
    } else {
        saveToLS();
    }
    // updating tat
    updateStats();
}


// ! ====================== Get Current Date And Time
// get current date and time and return it as an object
function getCurrentDateTime() {
    const now = new Date();  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return {
        date: `${year}/${month}/${day}`,
        time: `${hours}:${minutes}:${seconds}`,
        timestamp: now.getTime()
    };
}

    // function getCurrentDate() { 
    //     const d = new Date(); 
    //     return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; 
    // }

    
    // function getCurrentTime() { 
    //     const d = new Date(); 
    //     return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`; 
    // }
      

// ! ======================= Find User By Name
// find existing user by name and last-name in array and return it
function findUser(fn, ln) { 
    return users.find(user => {
        user.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
        user.lastName.trim().toLowerCase() === lastName.trim().toLowerCase()
    });
}
    


// ! ======================= Show Message Function
// display a message box at the top of the page after add or minus
function showMessage(msg, type) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `
        position:fixed;
        top:20px;
        left:50%;
        transform:translateX(-50%);
        background:${type === 'success' ? '#48bb78' : '#e53e3e'};
        color:white;
        padding:12px 24px;
        border-radius:12px;
        z-index:20000;
        animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(div);
    setTimeout(() => {
        div.remove()
    }, 5000);
    resetLockTimer();
}


// ! ==================  Updating The Financial statistics
// Every time a new transaction is added, or a transaction is edited or deleted, the user's financial statistics must be updated
function recalcBalance(user) {
    // Define primary variables
    let bal = 0, dep = 0, wit = 0;
    // Loop over all user transactions
    user.transactions.forEach(t => {
        // If the transaction was a deposit
        if (t.type === 'deposit') { 
            bal += t.amount; // Add to inventory
            dep += t.amount; // Add to total deposit
        }else { 
            bal -= t.amount; 
            wit += t.amount; 
        }
    });
    // Save calculated values ​​to the user
    user.totalBalance = bal;
    user.totalDeposit = dep;
    user.totalWithdraw = wit;
}


// ! ==================== Add Transaction Function
// Every time a user posts a new transaction, this function is executed and is responsible for adding the transaction to the database (or localStorage).
function addTransaction(fn, ln, type, category, amount) {
    // Find the User
    const user = findUser(fn, ln);
    // Create New Transaction
    const dateTime = getCurrentDateTime();
    const newTrans = { 
        id: Date.now(),        // Unique ID based on timestamp
        type,                  // 'deposit' or 'withdraw'
        category,              // Category (salary, food, ...)
        amount,                // Transaction amount
        date: dateTime.date,   // Today's date
        time: dateTime.time    // Current time
    };
    
    // User Exists (First Scenario)
    if (user) {
        // Check Balance for Withdrawal
        if (type === "withdraw" && amount > user.totalBalance) { 
            showMessage(`❌ موجودی کافی نیست! موجودی: ${user.totalBalance.toLocaleString()} تومان`, "error");
            return false; 
        }
        // Add Transaction and Update
        user.transactions.push(newTrans);   // Add transaction to array
        recalcBalance(user);                // Recalculate balance, total deposit, total withdrawal
        showMessage(`✅ ${type === 'deposit' ? 'واریز' : 'برداشت'} ${amount.toLocaleString()} تومانی انجام شد!`, "success");
    } 
    // User Does Not Exist (Second Scenario)
    else {
        //  Check Withdrawal for New User
        if (type === "withdraw") { 
            showMessage(`❌ کاربر جدید نمی‌تواند برداشت کند! ابتدا واریز کنید`, "error");
            return false; 
        }
        // Create New User
        users.push(
            { 
                id: Date.now(),
                firstName: fn, 
                lastName: ln, 
                totalBalance: amount,          // Initial balance = deposit amount
                totalDeposit: amount,          // Total deposit = deposit amount
                totalWithdraw: 0,              // Total withdrawal = zero
                transactions: [newTrans]       // First transaction
            }
        );
        showMessage(`✅ کاربر جدید ${fn} ${ln} با واریز ${amount.toLocaleString()} تومان ایجاد شد!`, "success");
    }
    //  Save and Display
    saveToLS();      // Save to localStorage
    renderTable();   // Rebuild the table
    return true;     // Indicates success
}


// ! ===================== Show Transactions 
// show user transactions in modal  
function showTransactions(user) {
    // Initial Setup
    currentSelectedUser = user;
    const modal = document.getElementById('transactionModal');
    const listDiv = document.getElementById('transactionsList');
    const statsDiv = document.getElementById('categoryStats');
    const statsGrid = document.getElementById('categoryStatsGrid');

    // Set Modal Title
    document.getElementById('modalTitle').innerHTML = `📋 تراکنش‌های ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}`;
    
    // Check if User Has Transactions
    if (user.transactions.length === 0) {
        listDiv.innerHTML = '<div class="empty-state">📭 هیچ تراکنشی وجود ندارد</div>';
        statsDiv.style.display = 'none';
    } else {
        // Build Transaction List (If Transactions Exist)
        listDiv.innerHTML = user.transactions.map((t, i) => {
            // Extract Transaction Information
            const isDeposit = t.type === 'deposit';
            const cat = categories[t.category] || categories.other;
            const borderColor = isDeposit ? '#48bb78' : '#e53e3e';
            const editedInfo = t.editedAt ? `<br><small style="color:#a0aec0;">✏️ ویرایش شده: ${t.editedAt.date} ${t.editedAt.time}</small>` : '';
            
            // Build HTML for Each Transaction
            return `
                <div class="transaction-item" id="trans-${t.id}" style="border-right-color: ${borderColor}">
                    <strong>#${i+1}</strong> - ${isDeposit ? '💰 واریز' : '💸 برداشت'}<br>
                    مبلغ: <span class="${isDeposit ? 'deposit-amount' : 'withdraw-amount'}">${isDeposit ? '+' : '-'} ${t.amount.toLocaleString()} تومان</span><br>
                    دسته: ${cat.icon} ${cat.name}<br>
                    📅 ${escapeHtml(t.date)} - 🕐 ${escapeHtml(t.time)}
                    ${editedInfo}
                    <div class="transaction-actions">
                        <button class="edit-transaction-btn" data-id="${t.id}">✏️ ویرایش</button>
                        <button class="delete-transaction-btn" data-id="${t.id}">🗑 حذف</button>
                    </div>
                </div>
            `;
        }).join('');
            
        // Attach Button Events
        document.querySelectorAll('.edit-transaction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const transId = parseInt(btn.dataset.id);
                showEditForm(user.id, transId);
            });
        });
        
        // Delete Button
        document.querySelectorAll('.delete-transaction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const transId = parseInt(btn.dataset.id);
                deleteTransaction(user.id, transId);
            });
        });
            
        // Calculate Category Statistics
        const stats = {};
        for (let cat in categories) stats[cat] = { deposit: 0, withdraw: 0 };
        user.transactions.forEach((t) => { 
            if (stats[t.category]) { 
                if (t.type === 'deposit') {
                    stats[t.category].deposit += t.amount
                }else {
                    stats[t.category].withdraw += t.amount
                }; 
            } 
        });

        // Display Category Statistics
        let hasData = false, html = '';
        for (let [key, val] of Object.entries(stats)) {
            const total = val.deposit - val.withdraw;
            if (val.deposit > 0 || val.withdraw > 0) {
                hasData = true;
                html += `<div class="category-stat-item"><span>${categories[key].icon} ${categories[key].name}</span><span><span style="color:#48bb78">+${val.deposit.toLocaleString()}</span> <span style="color:#e53e3e">-${val.withdraw.toLocaleString()}</span> = ${total.toLocaleString()} تومان</span></div>`;
            }
        }

        if (hasData) { 
            statsDiv.style.display = 'block'; statsGrid.innerHTML = html;
        } else {
            statsDiv.style.display = 'none'
        };
    }

    //  Show Modal
    modal.style.display = 'flex';
    resetLockTimer();
}



// ! ======================== Edit Transaction Function
// To edit an existing transaction. The user can change the amount, type (deposit/withdrawal),
// and category of a transaction. The function uses smart validation to prevent financial errors.
function editTransaction(userId, transactionId, newAmount, newType, newCategory) {
    // Find User and Transaction
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    const transaction = user.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;
    
    // Store Old Values
    const oldAmount = transaction.amount;
    const oldType = transaction.type;
        
    // Validation for Withdrawal
    if (newType === 'withdraw') {
        let tempBalance = user.totalBalance;
        if (oldType === 'deposit') {
            tempBalance -= oldAmount  // If it was deposit, subtract from balance
        }
        else {
            tempBalance += oldAmount  // If it was withdrawal, add to balance

        }
        if (newAmount > tempBalance) { 
            showMessage(`❌ موجودی کافی نیست! حداکثر قابل برداشت: ${tempBalance.toLocaleString()} تومان`, "error");
            return false;
        }
    }
    
    // Apply Changes
    const dateTime = getCurrentDateTime();

    transaction.amount = newAmount;
    transaction.type = newType;
    transaction.category = newCategory;
    transaction.editedAt = { 
        date: dateTime.date,
        time: dateTime.time
    };
    
    // Update and Save
    recalcBalance(user);    // Recalculate balance, total deposit, total withdrawal
    saveToLS();             // Save to localStorage
    renderTable();          // Rebuild the table
        
    // Update Modal (If Open)
    if (currentSelectedUser && currentSelectedUser.id === userId) {
        showTransactions(user);
    }
     
    // Show Success Message
    showMessage(`✅ تراکنش با موفقیت ویرایش شد!`, "success");
    return true;
}
    

// ! ============================= Delete Transaction Function
// To delete a specific transaction from the user's transaction list
function deleteTransaction(userId, transactionId) {
    // Get User Confirmation
    if (!confirm("⚠️ آیا از حذف این تراکنش مطمئن هستید؟")) return;
    // Find the User
    const user = users.find(u => u.id === userId);
    if (!user) return;
    // Find the Transaction
    const transIndex = user.transactions.findIndex(t => t.id === transactionId);
    if (transIndex === -1) return;
    
    // Remove Transaction from Array
    user.transactions.splice(transIndex, 1);
    // Update Statistics
    recalcBalance(user);
    saveToLS();
    renderTable();
    
    // Update Modal (If Open)
    // Check if Modal is Open for This User
    if (currentSelectedUser && currentSelectedUser.id === userId) {
        // If User Has No More Transactions
        if (user.transactions.length === 0) {
            document.getElementById('transactionModal').style.display = 'none';
            currentSelectedUser = null;
        }
        // If User Still Has Transactions
        else {
            showTransactions(user);
        }
    }
    // Show Success Message
    showMessage(`🗑 تراکنش با موفقیت حذف شد!`, "success");
}


// ! =========================== show Edit Form Function
// To display an edit form for a specific transaction. When the user clicks the "Edit" button,
// this function runs and shows a form with editable fields.
function showEditForm(userId, transactionId) {
    // Find User and Transaction
    const user = users.find(u => u.id === userId);
    const transaction = user.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    // Find the Transaction Element in DOM
    const transDiv = document.getElementById(`trans-${transactionId}`);
    if (!transDiv) return;
        
    // Remove Existing Edit Form (If Any)
    const existingForm = transDiv.querySelector('.edit-form');
    if (existingForm) existingForm.remove();
    
    // Build the Edit Form
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    // Form HTML Content
    editForm.innerHTML = `
        <select id="edit-type-${transactionId}">
            <option value="deposit" ${transaction.type === 'deposit' ? 'selected' : ''}>💰 واریز</option>
            <option value="withdraw" ${transaction.type === 'withdraw' ? 'selected' : ''}>💸 برداشت</option>
        </select>
        <select id="edit-category-${transactionId}">
            <option value="salary" ${transaction.category === 'salary' ? 'selected' : ''}>💼 حقوق</option>
            <option value="food" ${transaction.category === 'food' ? 'selected' : ''}>🍔 خوراک</option>
            <option value="shopping" ${transaction.category === 'shopping' ? 'selected' : ''}>🛍 خرید</option>
            <option value="other" ${transaction.category === 'other' ? 'selected' : ''}>📦 سایر</option>
        </select>
        <input type="number" id="edit-amount-${transactionId}" value="${transaction.amount}" placeholder="مبلغ">
        <button id="save-edit-${transactionId}" style="background:#48bb78;">💾 ذخیره</button>
        <button id="cancel-edit-${transactionId}" style="background:#e53e3e;">❌ انصراف</button>
    `;

    // Add Form to DOM
    transDiv.appendChild(editForm);
    
    // Save Button Event
    document.getElementById(`save-edit-${transactionId}`).addEventListener('click', () => {
        // Get New Values
        const newType = document.getElementById(`edit-type-${transactionId}`).value;
        const newCategory = document.getElementById(`edit-category-${transactionId}`).value;
        const newAmount = sanitizeNumber(document.getElementById(`edit-amount-${transactionId}`).value);
        // Amount Validation
        if (newAmount <= 0) { showMessage("❌ مبلغ باید بزرگتر از صفر باشد!", "error"); return; }
        // Save Changes
        editTransaction(userId, transactionId, newAmount, newType, newCategory);
        editForm.remove();
    });
    
    // Cancel Button Event
    document.getElementById(`cancel-edit-${transactionId}`).addEventListener('click', () => {
        editForm.remove();
    });
}
    
// ! ============================== show Chart Function
// To display a line chart showing the financial trend of a specific user.
// Using the Chart.js library, it shows the user's balance changes over time.
function showChart(user) {
    // Check for Transactions
    if (user.transactions.length === 0) { 
        showMessage(`❌ کاربر ${user.firstName} تراکنشی ندارد!`, "error"); 
        return; 
    }
    // Sort Transactions by Date
    const sorted = [...user.transactions].sort((a, b) => a.date.localeCompare(b.date));
    // Calculate Balance at Each Point
    const dates = [], balances = [];
    let currentBalance = 0;
    sorted.forEach(trans => {
        if (trans.type === 'deposit') {
            currentBalance += trans.amount
        }
        else {
            currentBalance -= trans.amount
        }
        dates.push(trans.date);
        balances.push(currentBalance);
    });
    
    // Show Chart Modal
    document.getElementById('chartModalTitle').innerHTML = `📈 روند مالی ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}`;
    charModal.style.display = 'flex';

    // Detect Theme
    const isDark = document.body.classList.contains('dark-mode');

    // Prepare Canvas for Chart
    const ctx = document.getElementById('balanceChart').getContext('2d');
    if (balanceChart) {
        balanceChart.destroy()
    };

    // Draw Chart with Chart.js
    balanceChart = new Chart(ctx, {
        type: 'line',
        data: { 
            labels: dates, 
            datasets: [{ 
                label: 'موجودی (تومان)', 
                data: balances, 
                borderColor: '#667eea', 
                backgroundColor: isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.1)', 
                borderWidth: 3, 
                fill: true, 
                tension: 0.3, 
                pointBackgroundColor: '#667eea', 
                pointBorderColor: '#fff', 
                pointRadius: 5, 
                pointHoverRadius: 7 
            }] 
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: true, 
            plugins: { 
                tooltip: { 
                    callbacks: { 
                        label: ctx => `موجودی: ${ctx.raw.toLocaleString()} تومان` 
                    } 
                } 
            }, 
            scales: { 
                y: { 
                    ticks: { 
                        callback: v => v.toLocaleString() + ' تومان' 
                    } 
                } 
            } 
        }
    });

    // Reset Lock Timer
    resetLockTimer();
}


// ! ====================== Clear User Transactions Function
// Completely delete all transactions for a user and reset their
// financial statistics to zero, without deleting the user themselves.
function clearUserTransactions(id) { 
    if( confirm("تمام تراکنش‌های این کاربر پاک شود؟") ) { 
        let u = users.find(u => u.id === id);
        // Clear Transactions and Update
        if(u) { 
            u.transactions = [];           // 1. Empty the transactions array
            recalcBalance(u);              // 2. Recalculate statistics (all become zero)
            saveToLS();                    // 3. Save to localStorage
            renderTable();                 // 4. Rebuild the table
            showMessage("تراکنش ها با موفقیت پاک شد","success");  // 5. Success message 
        } 
    } 
}


// ! ====================== Search Modal Events Function
// Open modal on button click
function openSearchModal() {
    searchModal.style.display = 'flex';
    searchInputModal.value = '';
    searchInputModal.focus();
    document.getElementById('searchResults').innerHTML = '<div class="no-results"> ...چیزی بنویسید</div>';
}

// Live search (every time the user types)
searchInputModal.addEventListener("input", (e) => {
    performSearch(e.target.value)
});

// Search with Enter key (optional)
searchInputModal.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(e.target.value);
    }
});


// ! ====================== Performa Search Function
// Search capability in modal
function performSearch(searchTerm) {
    const results = document.getElementById('searchResults');
    const term = sanitizeInput(searchTerm.trim()).toLocaleString();

    // If the search term was empty
    if (!term) { 
        results.innerHTML = '<div class="empty-state"> عبارت جستجو را وارد کنید</div>'; 
        return; 
    }

    // Filter users by first or last name
    const filtered = users.filter(u =>
        u.firstName.includes(term) || 
        u.lastName.includes(term)
    );

    // If no results are found
    if (filtered.length === 0) { 
        results.innerHTML = '<div class="empty-state">❌ نتیجه‌ای یافت نشد</div>'; 
        return; 
    }

    // Creating HTML to display results
    results.innerHTML = filtered.map(u => `
        <div class="search-result-item" data-id="${u.id}">
            <div class="search-result-name">${escapeHtml(u.firstName)} ${escapeHtml(u.lastName)}</div>
            <div class="search-result-details">
                <span class="search-result-balance">💰 موجودی: ${u.totalBalance.toLocaleString()} تومان</span>
                <span>📈 واریز: ${u.totalDeposit.toLocaleString()}</span>
                <span>📉 برداشت: ${u.totalWithdraw.toLocaleString()}</span>
                <span>📋 تعداد تراکنش: ${u.transactions.length}</span>
            </div>
        </div>
    `).join('');

    // Add a click event to each result
    document.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click" , () => {
            const userId = parseInt(item.dataset.id);
            const user = users.find(u => u.id === userId);

            if (user) {
                searchModal.style.display = 'none';
                showTransactions(user)
            }
        })
    })
}


// ! ====================== Render The Table
// render the table
function renderTable() {
    // Find and Clear the Table Body
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // clear current table

    // Check if Users Exist
    if (users.length === 0) {
        // If no users exist Display empty message
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        emptyRow.innerHTML = '<td colspan="6">📭 هیچ کاربری وجود ندارد </td>';
        tableBody.appendChild(emptyRow);
    } 
    else {
        // create a row for each item in array
        users.forEach(u => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${escapeHtml(u.firstName)}</strong></td>
                <td>${escapeHtml(u.lastName)}</td>
                <td style="color:#48bb78">💰 ${u.totalDeposit.toLocaleString()}</td>
                <td style="color:#e53e3e">💸 ${u.totalWithdraw.toLocaleString()}</td>
                <td class="total-assets">${u.totalBalance.toLocaleString()} تومان</td>
                <td><div class="action-buttons">
                    <button class="transaction-link" data-id="${u.id}">📋 تراکنش‌ها</button>
                    <button class="chart-link" data-id="${u.id}">📈 نمودار</button>
                    <button class="delete-user-btn" data-id="${u.id}">🗑 حذف</button>
                </div></td>
            `;
        })
    }
 
    // Attach Transaction Button Event
    document.querySelectorAll('.transaction-link').forEach(btn => {
        btn.addEventListener("click" , () => { 
            let u = users.find(u => u.id == btn.dataset.id); 
            if(u) showTransactions(u); 
        })
    });

    // Attach Chart Button Event
    document.querySelectorAll('.chart-link').forEach(btn => {
        btn.addEventListener("click" , () => { 
            let u = users.find(u => u.id == btn.dataset.id); 
            if(u) showChart(u); 
        })
    });
    
    // Attach Delete Button Event
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener("click" , () => {
            deleteUser(parseInt(btn.dataset.id))
        })
    });
    
    // Attach Clear Transactions Button Event
    document.querySelectorAll('.clear-transactions-btn').forEach(btn => {
        btn.addEventListener("click" , () => { 
            let u = users.find(u => u.id == btn.dataset.id); 
            if(u) clearUserTransactions(u.id); 
        })
    });
}

// ! ======================= Delete A User 
// delete a user with all their information and transactions using id
function deleteUser(id) {
    // Ask for Confirmation
    if(confirm("کاربر حذف شود؟")) {
        // Filter the Users Array
        users = users.filter(u => u.id !== id);
        // Save and Update
        saveToLS();      // Save to localStorage
        renderTable();   // Rebuild the table
        showMessage("User deleted","success");  // Success message 
    }
}


// ! ========================= Update Stats
// Display overall system statistics in 4 separate cards
function updateStats() {
    document.getElementById('totalUsers').innerHTML = users.length;
    document.getElementById('totalBalance').innerHTML = users.reduce((s,u) => s + u.totalBalance, 0).toLocaleString() + ' تومان';
    document.getElementById('totalDeposits').innerHTML = users.reduce((s,u) => s + u.totalDeposit, 0).toLocaleString() + ' تومان';
    document.getElementById('totalWithdraws').innerHTML = users.reduce((s,u) => s + u.totalWithdraw, 0).toLocaleString() + ' تومان';
}




// ! ======================= Save Backup
// deep copy and save as backup in local storage
function backupData() {
    const backup = JSON.parse(JSON.stringify(users));
    if (backup.length === 0) {
        showMessage("هیچ داده‌ای برای پشتیبان‌گیری وجود ندارد","fail");
    } else {
        localStorage.setItem(STORAGE_KEY+"_backup", JSON.stringify(users));
        showMessage("پشتیبان ذخیره شد","success"); 
    }
}


// ! ======================= Restore Backup
// restore the= last backup from local storage
function restoreBackup() { 
    // Read Backup from localStorage
    let b = localStorage.getItem(STORAGE_KEY+"_backup");
    // Check if Backup Exists
    if(b) {
        // Ask for Confirmation
        if(confirm("بازیابی شود؟")) {
            // Convert JSON String to Array
            users = JSON.parse(b);
            // Save and Update
            saveToLS();      // Save to main localStorage
            renderTable();   // Rebuild the table
            showMessage("Restored","success");  // Success message 
        } 
    } else {
        // If Backup Not Found
        alert("پشتیبانی یافت نشد")
    } 
}


// ! ======================= Clear All Data
// clear all data in array and local storage
function clearAllData() { 
    // Ask for Confirmation
    if (confirm("همه چیز پاک شود؟")) {
        // Empty the Users Array
        users = [];
        // Save and Update
        saveToLS();      // Save to localStorage
        renderTable();   // Rebuild the table
        showMessage("Everything cleared","success");  // Success message
    } 
}


// ! =========================== Excel Export Function
// To export all users to a CSV (Excel) file. This function generates and
// downloads a CSV file containing the complete list of all users with their financial information.
function exportAllUsers() {
    // Check if Users Exist
    if (!users.length) { 
        showMessage("هیچ کاربری وجود ندارد","error"); 
        return; 
    }
    //  Define CSV Headers
    const headers = ["ردیف","نام","نام خانوادگی","موجودی","واریز","برداشت","تعداد تراکنش"];
    // Build Data Array
    const data = [headers];

    // Add Users to Data
    users.forEach((u,i) => {
        data.push([
            i+1, 
            u.firstName, 
            u.lastName, 
            u.totalBalance, 
            u.totalDeposit, 
            u.totalWithdraw, 
            u.transactions.length
        ])
    });

    // Call CSV Export Function
    exportToCSV(data, `users_${Date.now()}`);
}

// This is a helper function that is called by other functions like exportAllUsers(), exportUserTransactions(), etc.
// Its main job is to convert data to a CSV file and automatically download it.
function exportToCSV(data, filename) {
    // Convert Data to CSV String

    // Loop through each row
    // Loop through each cell
    // Join cells with commas
    // Join rows with new lines
    let csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    // Create File (Blob)
    // \uFEFF is a BOM (Byte Order Mark) needed for Persian/Unicode support in Excel
    // Specifies file type and encoding
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });

    // Start Download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);  // Creates a temporary URL for the Blob file
    link.download = `${filename}.csv`;
    link.click();  // Simulates a click on the link → starts download
    URL.revokeObjectURL(link.href);  // Releases the temporary URL (memory optimization)

    // Show Success Message
    showMessage(`✅ خروجی Excel گرفته شد`, "success");
}


// ! ============================ Init Theme Function
// To initialize and set up the theme (dark/light mode) when the page loads.
function initTheme() {
    //  Read Saved Theme from localStorage
    // Reads the saved theme value from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        // If dark theme is saved, adds the dark-mode class to body
        document.body.classList.add('dark-mode')
    };
    // Set Button Text
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ حالت روز' : '🌙 حالت شب'
    };
}

// ! ============================ Toggle Theme Function
// To switch between dark and light themes.
function toggleTheme() {
    // Toggle dark-mode Class on body
    // Removes the dark-mode class if it exists, adds it if it doesn't
    document.body.classList.toggle('dark-mode');
    // Save Setting to localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    // Update Button Text;
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ حالت روز' : '🌙 حالت شب'
    }

    // Destroy Existing Chart
    if (balanceChart) { 
        balanceChart.destroy(); // Destroys the chart (frees memory)
        balanceChart = null     // Sets the variable to null
    }

    // Recreate Chart with New Theme
    // Recreates the chart with the new theme and user data
    if (document.getElementById('chartModal').style.display === 'flex' && currentSelectedUser) showChart(currentSelectedUser);
}


// ! ===================== Security functions
// Security function 1 : Clear user input (for storage)
function sanitizeInput(str) {
    if (!str) return '';
    // Remove spaces from the beginning and end
    let cleaned = str.trim();
    // Remove duplicate spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    // Remove control characters
    cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
    return cleaned;
}

// Security function 2 : Clear user input (for storage)
function sanitizeNumber(n) { 
    let num = parseFloat(n); 
    return (isNaN(num) || num < 0) ? 0 : Math.min(num, 10000000000); 
}

// Security Function 2 : helper function to prevent XSS 
function escapeHtml(str) { 
    if (!str) return ''; 
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); 
}
    

// ! ===================== Initialization On Page Load
// initialization on page load
function init() {
    // Initialization Them
    initTheme();
    // get array data from local storage
    loadFromLS();
    // // show data in rable
    renderTable();
}

// Run The App
init();


// ! ====================== Close Modal Events
// close transaction modal  
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    currentSelectedUser = null;
});
    
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        currentSelectedUser = null;
    }
});

// close chart modal
closeChartModal.addEventListener('click', () => {
    chartModal.style.display = 'none';
    if (balanceChart) {
        balanceChart.destroy(); // Destroying the graph to free up memory
        balanceChart = null;
    }
});

// Close by clicking on the dark background
window.addEventListener('click', (e) => {
    if (e.target === chartModal) {
        chartModal.style.display = 'none';
        if (balanceChart) {
            balanceChart.destroy(); // Destroying the graph to free up memory
            balanceChart = null;
        }
    }
});

// close search modal
closeSearchModal.addEventListener("click" , () => {
    searchModal.style.display = 'none';
});

// Close modal by clicking on dark background
window.addEventListener("click" , (e) => {
    if (e.target === searchModal ) {
        searchModal.style.display = 'none';
    }
});


// ! ===================== User Actions To Reset The Timer Function
// User actions to reset the timer
const events = ['click', 'keypress', 'scroll', 'mousemove'];
events.forEach(ev => document.addEventListener(ev, resetLockTimer));




// ! ============================================================================

loginBtn.addEventListener("click" , () => unlockScreen(passwordInput.value) ? resetLockTimer() : false );
passwordInput.addEventListener("keypress" , (e) => { if(e.key === 'Enter') loginBtn.click()});
lockScreenBtn.addEventListener("click" , lockScreen);
changePasswordBtn.addEventListener("click" , changePassword);
searchModalBtn.addEventListener("click", openSearchModal);
clearUserTransactionsBtn.addEventListener("click" , () => currentSelectedUser ? clearUserTransactions(currentSelectedUser.id) : false);
saveBackupBtn.addEventListener("click" , backupData);
restoreBackupBtn.addEventListener("click" , restoreBackup);
clearAllDataBtn.addEventListener("click" , clearAllData)
exportAllUsersBtn.addEventListener("click" , exportAllUsers)
themeToggleBtn.addEventListener("click" , toggleTheme)
addTransactionBtn.addEventListener("click" , () => {
    const fn = sanitizeInput(firstNameInput.value.trim());
    const ln = sanitizeInput(lastNameInput.value.trim());
    const type = transactionTypeInput.value;
    const cat = categoryInput.value;
    const amt = sanitizeNumber(amountInput.value.trim());

    // input data validation
    if (!fn || !ln) { 
        alert("نام و نام خانوادگی را وارد کنید");
        return; 
    }

    if (amt <= 0) { 
        alert("مبلغ معتبر وارد کنید"); 
        return; 
    }
    
    addTransaction(fn, ln, type, cat, amt);

    // Empty the input values
    firstNameInput.value = '';
    lastNameInput.value = '';
    amountInput.value = '';

    // fucus on the first input
    firstNameInput.focus();
})

// ! ============================= To manage the user's login state.
// Read Login Status from Session Storage
// sessionStorage : Temporary storage that only lasts until the browser tab is closed
const wasLoggedIn = sessionStorage.getItem('isLoggedIn');

// Check Login Status
// Has the user logged in during this session? and Is the password stored in localStorage?
if (wasLoggedIn === 'true' && localStorage.getItem(PASSWORD_KEY)) {
    // Reads the saved password from localStorage (in Base64)
    // Decodes the password from Base64 to plain text
    const savedPwd = atob(localStorage.getItem(PASSWORD_KEY));
    // Opens the app with the saved password
    unlockScreen(savedPwd);
} else {
    // If One Condition Is False (Not Logged In):
    lockScreen() 
}

// Save Login Status
sessionStorage.setItem('isLoggedIn', 'true');








