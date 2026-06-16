
// const firstNameInput = document.getElementById("fName");
// const lastNameInput = document.getElementById("lName");
// const amountInput = document.getElementById("amount");
// const depositBtn = document.getElementById("deposit");
// const withdrawBtn = document.getElementById("withdraw");
// const clearUserTransactionsBtn = document.getElementById("clearUserTransactionsBtn");
// const saveBackupBtn = document.getElementById("saveBackupBtn");
// const restoreBackupBtn = document.getElementById("restoreBackupBtn");
// const clearAllBtn = document.getElementById("clearAllBtn");
// const loginBtn = document.getElementById("loginBtn");
// const passwordInput = document.getElementById("passwordInput");
// const lockScreenBtn = document.getElementById("lockScreenBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
// const searchModalBtn = document.getElementById('searchModalBtn');
// const searchModal = document.getElementById('searchModal');
// const closeSearchModal = document.querySelector('.close-search-modal');
// const searchInputModal = document.getElementById('searchInputModal');
// const modal = document.getElementById('transactionModal');
// const closeModal = document.querySelector('.close-modal');
// const chartModal = document.getElementById('chartModal');
// const closeChartModal = document.querySelector('.close-chart-modal');



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
    








  
    function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }
    function sanitizeNumber(n) { let num = parseFloat(n); return (isNaN(num) || num < 0) ? 0 : Math.min(num, 10000000000); }
    function getCurrentDate() { const d = new Date(); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`; }
    function getCurrentTime() { const d = new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`; }
    
    function showMessage(msg, type) {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:${type === 'success' ? '#48bb78' : '#e53e3e'};color:white;padding:12px 24px;border-radius:12px;z-index:20000;`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
        resetLockTimer();
    }
    
    function saveToLS() { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); updateStats(); }
    
    function loadFromLS() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) { users = JSON.parse(saved); }
        else {
            users = [
                { id: 1, firstName: "علی", lastName: "رضایی", totalBalance: 150000, totalDeposit: 200000, totalWithdraw: 50000, transactions: [
                    { id: 1, type: "deposit", category: "salary", amount: 100000, date: "1402/11/10", time: "10:00:00" },
                    { id: 2, type: "deposit", category: "salary", amount: 100000, date: "1402/11/15", time: "14:30:00" },
                    { id: 3, type: "withdraw", category: "food", amount: 30000, date: "1402/11/18", time: "12:00:00" },
                    { id: 4, type: "withdraw", category: "shopping", amount: 20000, date: "1402/11/20", time: "09:15:00" }
                ] },
                { id: 2, firstName: "سارا", lastName: "احمدی", totalBalance: 75000, totalDeposit: 100000, totalWithdraw: 25000, transactions: [
                    { id: 5, type: "deposit", category: "salary", amount: 50000, date: "1402/11/10", time: "10:00:00" },
                    { id: 6, type: "deposit", category: "salary", amount: 50000, date: "1402/11/18", time: "11:45:00" },
                    { id: 7, type: "withdraw", category: "shopping", amount: 25000, date: "1402/11/19", time: "16:30:00" }
                ] }
            ];
            saveToLS();
        }
        updateStats();
    }
    
    function findUser(fn, ln) { return users.find(u => u.firstName === fn && u.lastName === ln); }
    
    function recalcBalance(user) {
        let bal = 0, dep = 0, wit = 0;
        user.transactions.forEach(t => {
            if (t.type === 'deposit') { bal += t.amount; dep += t.amount; }
            else { bal -= t.amount; wit += t.amount; }
        });
        user.totalBalance = bal;
        user.totalDeposit = dep;
        user.totalWithdraw = wit;
    }
    
    // ============================================
    // ========== نمودار خطی ==========
    // ============================================
    function showChart(user) {
        if (user.transactions.length === 0) { showMessage(`❌ کاربر ${user.firstName} تراکنشی ندارد!`, "error"); return; }
        const sorted = [...user.transactions].sort((a, b) => a.date.localeCompare(b.date));
        const dates = [], balances = [];
        let currentBalance = 0;
        sorted.forEach(trans => {
            if (trans.type === 'deposit') currentBalance += trans.amount;
            else currentBalance -= trans.amount;
            dates.push(trans.date);
            balances.push(currentBalance);
        });
        const modal = document.getElementById('chartModal');
        document.getElementById('chartModalTitle').innerHTML = `📈 روند مالی ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}`;
        modal.style.display = 'flex';
        const isDark = document.body.classList.contains('dark-mode');
        const ctx = document.getElementById('balanceChart').getContext('2d');
        if (balanceChart) balanceChart.destroy();
        balanceChart = new Chart(ctx, {
            type: 'line',
            data: { labels: dates, datasets: [{ label: 'موجودی (تومان)', data: balances, borderColor: '#667eea', backgroundColor: isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.1)', borderWidth: 3, fill: true, tension: 0.3, pointBackgroundColor: '#667eea', pointBorderColor: '#fff', pointRadius: 5, pointHoverRadius: 7 }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { tooltip: { callbacks: { label: ctx => `موجودی: ${ctx.raw.toLocaleString()} تومان` } } }, scales: { y: { ticks: { callback: v => v.toLocaleString() + ' تومان' } } } }
        });
        resetLockTimer();
    }
    
    // ============================================
    // ========== ویرایش تراکنش (قابلیت اصلی جدید) ==========
    // ============================================
    
    function editTransaction(userId, transactionId, newAmount, newType, newCategory) {
        const user = users.find(u => u.id === userId);
        if (!user) return false;
        const transaction = user.transactions.find(t => t.id === transactionId);
        if (!transaction) return false;
        
        const oldAmount = transaction.amount;
        const oldType = transaction.type;
        
        // اعتبارسنجی برای برداشت
        if (newType === 'withdraw') {
            let tempBalance = user.totalBalance;
            if (oldType === 'deposit') tempBalance -= oldAmount;
            else tempBalance += oldAmount;
            if (newAmount > tempBalance) {
                showMessage(`❌ موجودی کافی نیست! حداکثر قابل برداشت: ${tempBalance.toLocaleString()} تومان`, "error");
                return false;
            }
        }
        
        // اعمال تغییرات
        transaction.amount = newAmount;
        transaction.type = newType;
        transaction.category = newCategory;
        transaction.editedAt = { date: getCurrentDate(), time: getCurrentTime() };
        
        recalcBalance(user);
        saveToLS();
        renderTable();
        
        // به‌روزرسانی مودال اگر باز است
        if (currentSelectedUser && currentSelectedUser.id === userId) {
            showTransactions(user);
        }
        
        showMessage(`✅ تراکنش با موفقیت ویرایش شد!`, "success");
        return true;
    }
    
    function deleteTransaction(userId, transactionId) {
        if (!confirm("⚠️ آیا از حذف این تراکنش مطمئن هستید؟")) return;
        const user = users.find(u => u.id === userId);
        if (!user) return;
        const transIndex = user.transactions.findIndex(t => t.id === transactionId);
        if (transIndex === -1) return;
        
        user.transactions.splice(transIndex, 1);
        recalcBalance(user);
        saveToLS();
        renderTable();
        
        if (currentSelectedUser && currentSelectedUser.id === userId) {
            if (user.transactions.length === 0) {
                document.getElementById('transactionModal').style.display = 'none';
                currentSelectedUser = null;
            } else {
                showTransactions(user);
            }
        }
        showMessage(`🗑 تراکنش با موفقیت حذف شد!`, "success");
    }
    
    function showEditForm(userId, transactionId) {
        const user = users.find(u => u.id === userId);
        const transaction = user.transactions.find(t => t.id === transactionId);
        if (!transaction) return;
        
        const transDiv = document.getElementById(`trans-${transactionId}`);
        if (!transDiv) return;
        
        // اگر فرم ویرایش قبلاً وجود دارد، آن را حذف کن
        const existingForm = transDiv.querySelector('.edit-form');
        if (existingForm) existingForm.remove();
        
        const editForm = document.createElement('div');
        editForm.className = 'edit-form';
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
        transDiv.appendChild(editForm);
        
        document.getElementById(`save-edit-${transactionId}`).addEventListener('click', () => {
            const newType = document.getElementById(`edit-type-${transactionId}`).value;
            const newCategory = document.getElementById(`edit-category-${transactionId}`).value;
            const newAmount = sanitizeNumber(document.getElementById(`edit-amount-${transactionId}`).value);
            if (newAmount <= 0) { showMessage("❌ مبلغ باید بزرگتر از صفر باشد!", "error"); return; }
            editTransaction(userId, transactionId, newAmount, newType, newCategory);
            editForm.remove();
        });
        
        document.getElementById(`cancel-edit-${transactionId}`).addEventListener('click', () => {
            editForm.remove();
        });
    }
    
    // ============================================
    // ========== توابع مدیریت ==========
    // ============================================
    function addTransaction(fn, ln, type, category, amount) {
        const user = findUser(fn, ln);
        const newTrans = { id: Date.now(), type, category, amount, date: getCurrentDate(), time: getCurrentTime() };
        
        if (user) {
            if (type === "withdraw" && amount > user.totalBalance) { showMessage(`❌ موجودی کافی نیست! موجودی: ${user.totalBalance.toLocaleString()} تومان`, "error"); return false; }
            user.transactions.push(newTrans);
            recalcBalance(user);
            showMessage(`✅ ${type === 'deposit' ? 'واریز' : 'برداشت'} ${amount.toLocaleString()} تومانی انجام شد!`, "success");
        } else {
            if (type === "withdraw") { showMessage(`❌ کاربر جدید نمی‌تواند برداشت کند! ابتدا واریز کنید`, "error"); return false; }
            users.push({ id: Date.now(), firstName: fn, lastName: ln, totalBalance: amount, totalDeposit: amount, totalWithdraw: 0, transactions: [newTrans] });
            showMessage(`✅ کاربر جدید ${fn} ${ln} با واریز ${amount.toLocaleString()} تومان ایجاد شد!`, "success");
        }
        saveToLS();
        renderTable();
        return true;
    }
    
    function updateStats() {
        document.getElementById('totalUsers').innerHTML = users.length;
        document.getElementById('totalBalance').innerHTML = users.reduce((s,u) => s + u.totalBalance, 0).toLocaleString() + ' تومان';
        document.getElementById('totalDeposits').innerHTML = users.reduce((s,u) => s + u.totalDeposit, 0).toLocaleString() + ' تومان';
        document.getElementById('totalWithdraws').innerHTML = users.reduce((s,u) => s + u.totalWithdraw, 0).toLocaleString() + ' تومان';
    }
    
    function deleteUser(id) { if(confirm("کاربر حذف شود؟")){ users = users.filter(u => u.id !== id); saveToLS(); renderTable(); showMessage("کاربر حذف شد","success"); } }
    function clearUserTransactions(id) { if(confirm("تمام تراکنش‌های این کاربر پاک شود؟")){ let u = users.find(u => u.id === id); if(u){ u.transactions = []; recalcBalance(u); saveToLS(); renderTable(); showMessage("تراکنش‌ها پاک شد","success"); } } }
    function clearAllData() { if(confirm("همه چیز پاک شود؟")){ users = []; saveToLS(); renderTable(); showMessage("همه چیز پاک شد","success"); } }
    function backupData() { localStorage.setItem(STORAGE_KEY+"_backup", JSON.stringify(users)); showMessage("پشتیبان ذخیره شد","success"); }
    function restoreBackup() { let b = localStorage.getItem(STORAGE_KEY+"_backup"); if(b){ if(confirm("بازیابی شود؟")){ users = JSON.parse(b); saveToLS(); renderTable(); showMessage("بازیابی شد","success"); } } else alert("پشتیبانی یافت نشد"); }
    
    function showTransactions(user) {
        currentSelectedUser = user;
        const modal = document.getElementById('transactionModal');
        const listDiv = document.getElementById('transactionsList');
        const statsDiv = document.getElementById('categoryStats');
        const statsGrid = document.getElementById('categoryStatsGrid');
        
        document.getElementById('modalTitle').innerHTML = `📋 تراکنش‌های ${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}`;
        
        if (user.transactions.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">📭 هیچ تراکنشی وجود ندارد</div>';
            statsDiv.style.display = 'none';
        } else {
            listDiv.innerHTML = user.transactions.map((t, i) => {
                const isDeposit = t.type === 'deposit';
                const cat = categories[t.category] || categories.other;
                const borderColor = isDeposit ? '#48bb78' : '#e53e3e';
                const editedInfo = t.editedAt ? `<br><small style="color:#a0aec0;">✏️ ویرایش شده: ${t.editedAt.date} ${t.editedAt.time}</small>` : '';
                
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
            
            // دکمه‌های ویرایش و حذف
            document.querySelectorAll('.edit-transaction-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const transId = parseInt(btn.dataset.id);
                    showEditForm(user.id, transId);
                });
            });
            
            document.querySelectorAll('.delete-transaction-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const transId = parseInt(btn.dataset.id);
                    deleteTransaction(user.id, transId);
                });
            });
            
            // آمار دسته‌بندی
            const stats = {};
            for (let cat in categories) stats[cat] = { deposit: 0, withdraw: 0 };
            user.transactions.forEach(t => { if (stats[t.category]) { if (t.type === 'deposit') stats[t.category].deposit += t.amount; else stats[t.category].withdraw += t.amount; } });
            let hasData = false, html = '';
            for (let [key, val] of Object.entries(stats)) {
                const total = val.deposit - val.withdraw;
                if (val.deposit > 0 || val.withdraw > 0) {
                    hasData = true;
                    html += `<div class="category-stat-item"><span>${categories[key].icon} ${categories[key].name}</span><span><span style="color:#48bb78">+${val.deposit.toLocaleString()}</span> <span style="color:#e53e3e">-${val.withdraw.toLocaleString()}</span> = ${total.toLocaleString()} تومان</span></div>`;
                }
            }
            if (hasData) { statsDiv.style.display = 'block'; statsGrid.innerHTML = html; } else statsDiv.style.display = 'none';
        }
        modal.style.display = 'flex';
        resetLockTimer();
    }
    
    function renderTable() {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        if (users.length === 0) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">📭 هیچ کاربری وجود ندارد</td></tr>'; return; }
        
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
        });

        //<button class="clear-transactions-btn" data-id="${u.id}">🗑 پاک کردن تراکنش‌ها</button>
        
        document.querySelectorAll('.transaction-link').forEach(btn => btn.onclick = () => { let u = users.find(u => u.id == btn.dataset.id); if(u) showTransactions(u); });
        document.querySelectorAll('.chart-link').forEach(btn => btn.onclick = () => { let u = users.find(u => u.id == btn.dataset.id); if(u) showChart(u); });
        document.querySelectorAll('.delete-user-btn').forEach(btn => btn.onclick = () => deleteUser(parseInt(btn.dataset.id)));
        document.querySelectorAll('.clear-transactions-btn').forEach(btn => btn.onclick = () => { let u = users.find(u => u.id == btn.dataset.id); if(u) clearUserTransactions(u.id); });
    }
    
    // ============================================
    // ========== جستجو و خروجی Excel ==========
    // ============================================
    function performSearch(term) {
        const results = document.getElementById('searchResults');
        if (!term.trim()) { results.innerHTML = '<div class="empty-state"> عبارت جستجو را وارد کنید</div>'; return; }
        const filtered = users.filter(u => u.firstName.includes(term) || u.lastName.includes(term));
        if (filtered.length === 0) { results.innerHTML = '<div class="empty-state">❌ نتیجه‌ای یافت نشد</div>'; return; }
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
        document.querySelectorAll('.search-result-item').forEach(item => item.onclick = () => { let u = users.find(u => u.id == item.dataset.id); if(u) { document.getElementById('searchModal').style.display = 'none'; showChart(u); } });
    }
    
    function exportToCSV(data, filename) {
        let csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        showMessage(`✅ خروجی Excel گرفته شد`, "success");
    }
    
    function exportAllUsers() {
        if (!users.length) { showMessage("هیچ کاربری وجود ندارد","error"); return; }
        const headers = ["ردیف","نام","نام خانوادگی","موجودی","واریز","برداشت","تعداد تراکنش"];
        const data = [headers];
        users.forEach((u,i) => data.push([i+1, u.firstName, u.lastName, u.totalBalance, u.totalDeposit, u.totalWithdraw, u.transactions.length]));
        exportToCSV(data, `users_${Date.now()}`);
    }
    
    // ============================================
    // ========== تم و مقداردهی اولیه ==========
    // ============================================
    function initTheme() {
        if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ حالت روز' : '🌙 حالت شب';
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ حالت روز' : '🌙 حالت شب';
        if (balanceChart) { balanceChart.destroy(); balanceChart = null; }
        if (document.getElementById('chartModal').style.display === 'flex' && currentSelectedUser) showChart(currentSelectedUser);
    }
    






// ! ============================ 
// 
function init() {
    initTheme();
    loadFromLS();
    renderTable();
}
    
init();



// ! ============================================================================
// ! ============================================================================
// ! ============================================================================
changePasswordBtn.addEventListener("clck" , changePassword);








        document.getElementById('loginBtn').onclick = () => { 
            if(unlockScreen(document.getElementById('passwordInput').value)) {
                resetLockTimer();
            } 
        };

        document.getElementById('passwordInput').onkeypress = (e) => { 
            if(e.key === 'Enter') {
                document.getElementById('loginBtn').click();
            } 
        };
        
        
        
        document.getElementById('lockScreenBtn').onclick = () => lockScreen();
        
        

        
        const searchModal = document.getElementById('searchModal');
        document.getElementById('searchModalBtn').onclick = () => { searchModal.style.display = 'flex'; document.getElementById('searchInputModal').focus(); };
        document.querySelector('.close-search-modal').onclick = () => searchModal.style.display = 'none';
        document.getElementById('searchInputModal').oninput = (e) => performSearch(e.target.value);
        
        const chartModal = document.getElementById('chartModal');
        document.querySelector('.close-chart-modal').onclick = () => { chartModal.style.display = 'none'; if(balanceChart) { balanceChart.destroy(); balanceChart = null; } };
        
        const transModal = document.getElementById('transactionModal');
        document.querySelector('.close-modal').onclick = () => transModal.style.display = 'none';
        document.getElementById('clearUserTransactionsBtn').onclick = () => { if(currentSelectedUser && confirm("تمام تراکنش‌ها پاک شود؟")) { currentSelectedUser.transactions = []; recalcBalance(currentSelectedUser); saveToLS(); renderTable(); showMessage("تراکنش‌ها پاک شد","success"); transModal.style.display = 'none'; } };
        
        window.onclick = (e) => {
            if (e.target === chartModal) { chartModal.style.display = 'none'; if(balanceChart) { balanceChart.destroy(); balanceChart = null; } }
            if (e.target === searchModal) searchModal.style.display = 'none';
            if (e.target === transModal) transModal.style.display = 'none';
        };
        
        document.getElementById('addTransactionBtn').onclick = () => {
            const fn = document.getElementById('firstName').value.trim();
            const ln = document.getElementById('lastName').value.trim();
            const type = document.getElementById('transactionType').value;
            const cat = document.getElementById('category').value;
            const amt = sanitizeNumber(document.getElementById('amount').value);
            if (!fn || !ln) { alert("نام و نام خانوادگی را وارد کنید"); return; }
            if (amt <= 0) { alert("مبلغ معتبر وارد کنید"); return; }
            addTransaction(fn, ln, type, cat, amt);
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('amount').value = '';
            document.getElementById('firstName').focus();
        };
        
        document.getElementById('exportAllUsersBtn').onclick = () => exportAllUsers();
        document.getElementById('clearAllDataBtn').onclick = () => clearAllData();
        document.getElementById('saveBackupBtn').onclick = () => backupData();
        document.getElementById('loadBackupBtn').onclick = () => restoreBackup();
        document.getElementById('themeToggleBtn').onclick = toggleTheme;
        
        document.addEventListener('click', resetLockTimer);
        document.addEventListener('keypress', resetLockTimer);
        
        const wasLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (wasLoggedIn === 'true' && localStorage.getItem(PASSWORD_KEY)) {
            const savedPwd = atob(localStorage.getItem(PASSWORD_KEY));
            unlockScreen(savedPwd);
        } else { lockScreen(); }
        sessionStorage.setItem('isLoggedIn', 'true');