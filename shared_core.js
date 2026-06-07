// PORTAL MƏRKƏZİ NÜVƏ SİSTEMİ (SHARED CORE LOGIC)
document.addEventListener("DOMContentLoaded", () => {
    // 1. TƏHLÜKƏSİZLİK VƏ GİRİŞ YOXLANIŞI
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (!activeUser) {
        alert("Sistemə giriş edilməyib! Giriş səhifəsinə yönləndirilirsiniz.");
        window.location.href = "login.html";
        return;
    }

    // 2. QLOBAL BİLDİRİŞ SİSTEMİNİN YÜKLƏNMƏSİ
    checkGlobalNotifications();

    // 3. PROFİL MƏLUMATLARININ EKRAZDA SAXLANILMASI VƏ YENİLƏNMƏSİ
    renderProfileDOM(activeUser);
});

// Profil məlumatlarını dinamik şəkildə interfeysə dolduran funksiya
function renderProfileDOM(user) {
    // Navbar Məlumatları
    if (document.getElementById('navStudentName')) document.getElementById('navStudentName').innerText = user.name;
    if (document.getElementById('navTeacherName')) document.getElementById('navTeacherName').innerText = user.name;
    
    // Sidebar Məlumatları
    if (document.getElementById('sidebarStudentName')) document.getElementById('sidebarStudentName').innerText = user.name;
    if (document.getElementById('sidebarTeacherName')) document.getElementById('sidebarTeacherName').innerText = user.name;

    // Profil Şəkli (Avatar) Yüklənməsi
    const defaultAvatar = user.role === 'telebe' 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
        : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120";
    
    const userImg = user.avatar || defaultAvatar;
    document.querySelectorAll('.user-avatar, .profile-sidebar__img').forEach(img => img.src = userImg);

    // İxtisas və Təcrübə Sahələri
    if (document.getElementById('studentGroup')) document.getElementById('studentGroup').innerText = user.group || "Təyin edilməyib";
    if (document.getElementById('studentGpa')) document.getElementById('studentGpa').innerText = (user.gpa || "0") + " / 100";
    if (document.getElementById('teacherSubject')) document.getElementById('teacherSubject').innerText = user.subject || "Müvafiq fənn";
    if (document.getElementById('teacherExp')) document.getElementById('teacherExp').innerText = user.experience || "1 il";
    if (document.getElementById('teacherEmail')) document.getElementById('teacherEmail').innerText = user.email;
    if (document.getElementById('studentEmail')) document.getElementById('studentEmail').innerText = user.email;
}

// Mərkəzi Bildiriş Mexanizmi - Hər bir səhifə açılanda yoxlayır
function checkGlobalNotifications() {
    const latestNotif = localStorage.getItem('portal_global_notification');
    if (latestNotif) {
        const notifData = JSON.parse(latestNotif);
        // Əgər bildiriş hələ bağlanmayıbsa navbarın dərhal üstündə göstər
        if (!sessionStorage.getItem(`notif_read_${notifData.id}`)) {
            const notifBar = document.createElement('div');
            notifBar.className = 'global-notification-bar';
            notifBar.innerHTML = `
                <div><i class="fa-solid fa-bullhorn"></i> <b>[${notifData.type.toUpperCase()}]</b> ${notifData.message} (${notifData.time})</div>
                <button class="close-notif-btn" onclick="closeNotification('${notifData.id}')"><i class="fa-solid fa-xmark"></i></button>
            `;
            document.body.insertBefore(notifBar, document.body.firstChild);
        }
    }
}

function closeNotification(id) {
    sessionStorage.setItem(`notif_read_${id}`, 'true');
    window.location.reload();
}