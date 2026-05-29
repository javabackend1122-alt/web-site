// Axtarış süzgəci
document.getElementById('panelSearch').addEventListener('input', function(e) {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll('.module-card').forEach(card => {
        card.style.display = card.querySelector('h3').innerText.toLowerCase().includes(val) ? "block" : "none";
    });
});

// PROFİL MƏLUMATLARINI DƏYİŞDİRMƏ PANELİNİN SİDEBARA ƏLAVƏ EDİLMƏSİ
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector('.profile-sidebar');
    const user = JSON.parse(sessionStorage.getItem('activeUser'));
    
    // Şəkil dəyişdirmə qatını aktiv edirik
    const imgElement = sidebar.querySelector('.profile-sidebar__img');
    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'avatar-container';
    imgElement.parentNode.insertBefore(avatarWrapper, imgElement);
    avatarWrapper.appendChild(imgElement);
    avatarWrapper.innerHTML += `<div class="avatar-overlay"><i class="fa-solid fa-camera"></i></div><input type="file" id="avatarInput" style="display:none;" accept="image/*">`;

    // Kliklədikdə gizli fayl seçicini aç
    sidebar.querySelector('.avatar-overlay').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });

    // Şəkil dəyişəndə Base64 formatında yaddaşa yazırıq
    document.getElementById('avatarInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                updateUserData('avatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Məlumat dəyişdirmə və Hesab silmə düymələrini alt qisimdə yaradırıq
    const actionZone = document.createElement('div');
    actionZone.className = 'profile-edit-form';
    actionZone.innerHTML = `
        <input type="text" id="editName" value="${user.name}" placeholder="Ad Soyad">
        <input type="text" id="editField" value="${user.role === 'telebe' ? user.group : user.subject}" placeholder="${user.role === 'telebe' ? 'Qrup' : 'Fənn'}">
        <div class="profile-btn-group">
            <button class="btn-sidebar btn-sidebar--edit" onclick="saveProfileChanges()"><i class="fa-solid fa-floppy-disk"></i> Saxla</button>
            <button class="btn-sidebar btn-sidebar--delete" onclick="deleteOwnAccount()"><i class="fa-solid fa-trash-can"></i> Sil</button>
        </div>
    `;
    sidebar.appendChild(actionZone);
});

// Məlumatları mərkəzi LocalStorage bazasında yeniləyən funksiya
function updateUserData(key, value) {
    let users = JSON.parse(localStorage.getItem('portal_users')) || [];
    let currentUser = JSON.parse(sessionStorage.getItem('activeUser'));

    users = users.map(u => {
        if (u.id === currentUser.id) {
            u[key] = value;
            currentUser[key] = value;
        }
        return u;
    });

    localStorage.setItem('portal_users', JSON.stringify(users));
    sessionStorage.setItem('activeUser', JSON.stringify(currentUser));
    window.location.reload();
}

function saveProfileChanges() {
    const newName = document.getElementById('editName').value.trim();
    const newField = document.getElementById('editField').value.trim();
    let currentUser = JSON.parse(sessionStorage.getItem('activeUser'));

    if(!newName) return alert("Ad sahəsi boş qala bilməz!");

    let users = JSON.parse(localStorage.getItem('portal_users')) || [];
    users = users.map(u => {
        if (u.id === currentUser.id) {
            u.name = newName;
            if (u.role === 'telebe') u.group = newField;
            else u.subject = newField;
        }
        return u;
    });

    currentUser.name = newName;
    if (currentUser.role === 'telebe') currentUser.group = newField;
    else currentUser.subject = newField;

    localStorage.setItem('portal_users', JSON.stringify(users));
    sessionStorage.setItem('activeUser', JSON.stringify(currentUser));
    alert("Məlumatlarınız uğurla yeniləndi!");
    window.location.reload();
}

// Hesabın tamamilə silinməsi mexanizmi
function deleteOwnAccount() {
    if (confirm("Hesabınızı silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz!")) {
        let users = JSON.parse(localStorage.getItem('portal_users')) || [];
        let currentUser = JSON.parse(sessionStorage.getItem('activeUser'));

        users = users.filter(u => u.id !== currentUser.id);
        localStorage.setItem('portal_users', JSON.stringify(users));
        
        sessionStorage.clear();
        alert("Hesabınız sistemdən silindi.");
        window.location.href = "login.html";
    }
}

// ----------------------------------------------------------------------
// UNIVERSAL DYNAMIC SEARCH ENGINE (CONTENT-INDEPENDENT)
// ----------------------------------------------------------------------
const globalSearchInput = document.getElementById("panelSearch");

if (globalSearchInput) {
    globalSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        // Səhifədəki bütün modul kartlarını və dinamik generasiya olunan blokları tapır
        const dynamicElements = document.querySelectorAll(
            ".modules-grid .module-card, " +
            "#incomingContainer > div, " +
            "#activeContainer > div, " +
            "#studentFaqContainer > div, " +
            "#teacherStudentContainer > div"
        );

        dynamicElements.forEach(element => {
            // Elementin daxilindəki bütün mətnləri birləşdirib kiçik hərflərə çevirir
            const elementText = element.textContent.toLowerCase();

            if (elementText.includes(query)) {
                // Əgər axtarılan söz elementin hər hansı bir yerində varsa, onu göstər
                if (element.classList.contains("module-card")) {
                    element.style.display = "block"; // Kartlar üçün default blok görünüşü
                } else if (element.parentElement && element.parentElement.id === "teacherStudentContainer") {
                    element.style.display = "flex";  // Tələbə siyahısı üçün sətir görünüşü
                } else {
                    element.style.display = "block"; // Digər dinamik bloklar üçün
                }
                element.style.opacity = "1";
            } else {
                // Uyğun gəlməyənləri gizlət
                element.style.display = "none";
                element.style.opacity = "0";
            }
        });
    });
}