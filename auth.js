// ==========================================================================
// 1. STATUS BİLDİRİŞ FUNKSİYASI
// ==========================================================================
function showStatus(message, type) {
    const statusBox = document.getElementById('statusMessage');
    if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = `status-message ${type}`;
        statusBox.innerHTML = type === 'success' 
            ? `<i class="fa-solid fa-circle-check"></i> ${message}` 
            : `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    }
}

// ==========================================================================
// 2. GİRİŞ SİSTEMİ (LOGIN) - DİNAMİK YÖNLƏNDİRMƏ İLƏ
// ==========================================================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameOrId = document.getElementById('usernameInput').value.trim().toUpperCase();
        const password = document.getElementById('passwordInput').value;

        let users = JSON.parse(localStorage.getItem('portal_users')) || [];

        // Həm istifadəçi adına, həm ID-yə, həm də Gmail-ə görə girişə icazə veririk
        const foundUser = users.find(u => 
            (u.username.toUpperCase() === usernameOrId || u.id === usernameOrId || u.email.toUpperCase() === usernameOrId) && u.password === password
        );

        if (foundUser) {
            showStatus(`Giriş uğurludur! Xoş gəldiniz, ${foundUser.name}`, "success");
            sessionStorage.setItem('activeUser', JSON.stringify(foundUser));

            setTimeout(() => {
                if (foundUser.role === 'admin') window.location.href = "admin_dashboard.html";
                else if (foundUser.role === 'muallim') window.location.href = "muallim_dashboard.html";
                else window.location.href = "telebe_dashboard.html";
            }, 1500);

        } else {
            if (usernameOrId === 'ADMIN' && password === '123456') {
                showStatus("Sistem Admini olaraq giriş edildi...", "success");
                const defaultAdmin = { id: "ADM-777", name: "Baş Administrator", role: "admin", email: "admin@gmail.com" };
                sessionStorage.setItem('activeUser', JSON.stringify(defaultAdmin));
                setTimeout(() => { window.location.href = "admin_dashboard.html"; }, 1500);
            } else {
                showStatus("Giriş məlumatları və ya şifrə yanlışdır.", "error");
            }
        }
    });
}

// ==========================================================================
// 3. QEYDİYYAT SİSTEMİ (REGISTER) - GMAIL VƏ ŞİFRƏ FİLTRİ İLƏ
// ==========================================================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    const roleButtons = document.querySelectorAll('.role-selector .role-btn');
    const regIdInput = document.getElementById('regId');
    const idHelp = document.getElementById('idHelp');
    const submitText = document.getElementById('submitText');
    const togglePasswordIcon = document.getElementById('togglePasswordIcon');
    const regPassword = document.getElementById('regPassword');
    
    let regRole = 'telebe'; // Varsayılan rol

    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            roleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            regRole = btn.getAttribute('data-role');

            if (regRole === 'telebe') {
                regIdInput.placeholder = "Məsələn: TEL-001";
                idHelp.innerHTML = "Vəzifənizə uyğun özəl ID-nizi daxil edin (<b>TEL-</b> prefiqsi ilə).";
                submitText.innerText = "Tələbə Qeydiyyatını Tamamla";
            } else if (regRole === 'muallim') {
                regIdInput.placeholder = "Məsələn: MUL-001";
                idHelp.innerHTML = "Vəzifənizə uyğun özəl ID-nizi daxil edin (<b>MUL-</b> prefiqsi ilə).";
                submitText.innerText = "Müəllim Qeydiyyatını Tamamla";
            } else if (regRole === 'admin') {
                regIdInput.placeholder = "Məsələn: ADM-001";
                idHelp.innerHTML = "Vəzifənizə uyğun özəl ID-nizi daxil edin (<b>ADM-</b> prefiqsi ilə).";
                submitText.innerText = "Administrator Qeydiyyatını Tamamla";
            }
        });
    });

    if (togglePasswordIcon) {
        togglePasswordIcon.addEventListener('click', () => {
            if (regPassword.type === 'password') {
                regPassword.type = 'text';
                togglePasswordIcon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                regPassword.type = 'password';
                togglePasswordIcon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idVal = regIdInput.value.trim().toUpperCase();
        const usernameVal = document.getElementById('regUsername').value.trim();
        const emailVal = document.getElementById('regEmail').value.trim().toLowerCase();
        const passwordVal = document.getElementById('regPassword').value;
        const nameVal = document.getElementById('regName') ? document.getElementById('regName').value.trim() : usernameVal;

        // A. GMAIL YOXLANIŞ FİLTRİ
        const gmailRegex = /^[a-z0-9](\.?[a-z0-9]){4,29}@gmail\.com$/;
        if (!gmailRegex.test(emailVal)) {
            showStatus("Xəta! Zəhmət olmasa etibarlı bir rəsmi <b>@gmail.com</b> ünvanı daxil edin.", "error");
            return;
        }

        // B. TƏHLÜKƏSİZ ŞİFRƏ LİMİTİ (Minimum 6 simvol)
        if (passwordVal.length < 6) {
            showStatus("Şifrə çox zəifdir! Minimum 6 simvoldan ibarət olmalıdır.", "error");
            return;
        }

        // C. ID PREFİQS YOXLANIŞLARI
        if (regRole === 'telebe' && !idVal.startsWith('TEL-')) { showStatus("ID nömrəsi <b>TEL-</b> ilə başlamalıdır.", "error"); return; }
        if (regRole === 'muallim' && !idVal.startsWith('MUL-')) { showStatus("ID nömrəsi <b>MUL-</b> ilə başlamalıdır.", "error"); return; }
        if (regRole === 'admin' && !idVal.startsWith('ADM-')) { showStatus("ID nömrəsi <b>ADM-</b> ilə başlamalıdır.", "error"); return; }

        // D. TƏKRARLANMA YOXLANIŞI (Eyni ID, İstifadəçi adı və ya Gmail olmamalıdır)
        let users = JSON.parse(localStorage.getItem('portal_users')) || [];
        const userExists = users.some(u => 
            u.id === idVal || 
            u.username.toUpperCase() === usernameVal.toUpperCase() || 
            u.email.toLowerCase() === emailVal.toLowerCase()
        );
        
        if (userExists) {
            showStatus("Xəta! Bu ID, İstifadəçi adı və ya Gmail ilə artıq hesab mövcuddur.", "error");
            return;
        }

        // Hər şey qaydasındadırsa, profili yaddaşa yazırıq
        const newAccount = {
            id: idVal,
            username: usernameVal,
            name: nameVal,
            email: emailVal,
            password: passwordVal,
            role: regRole,
            group: regRole === 'telebe' ? "IT-Design-1" : null,
            gpa: regRole === 'telebe' ? "92" : null,
            subject: regRole === 'muallim' ? "Baş Proqramlaşdırma Tədrisi" : null,
            experience: regRole === 'muallim' ? "6 il" : null
        };

        users.push(newAccount);
        localStorage.setItem('portal_users', JSON.stringify(users));

        showStatus("Qeydiyyat uğurla tamamlandı! Girişə yönləndirilirsiniz...", "success");
        setTimeout(() => { window.location.href = "login.html"; }, 2000);
    });
}