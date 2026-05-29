document.addEventListener("DOMContentLoaded", () => {
    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120";
    
    let adminProfile = JSON.parse(localStorage.getItem("adminProfile")) || {
        name: "Root Admin",
        user: "@cdptm_admin",
        bio: "Mərkəzi təhsil şəbəkəsinin rəqəmsal infrastrukturu üzrə tam səlahiyyətli administrator və sistem rəhbəri.",
        avatar: defaultAvatar
    };

    function syncProfileUI() {
        document.getElementById("adminName").textContent = adminProfile.name;
        document.getElementById("navAdminName").textContent = adminProfile.name;
        document.getElementById("adminUser").textContent = adminProfile.user;
        document.getElementById("adminBio").textContent = adminProfile.bio;
        document.getElementById("adminAvatar").src = adminProfile.avatar;
        document.getElementById("navAdminAvatar").src = adminProfile.avatar;
    }
    syncProfileUI();

    // BİRBAŞA ŞƏKİL YÜKLƏMƏ MEXANİZMİ
    const fileInput = document.getElementById("directAvatarUpload");
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            // Şəkil ölçüsünü yoxlayırıq (Maksimum 1.5MB test üçün)
            if (file.size > 1500000) {
                alert("Seçdiyiniz şəkil çox böyükdür! Zəhmət olmasa daha kiçik ölçülü (məsələn, 1MB-dan az) profil şəkli seçin.");
                fileInput.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                adminProfile.avatar = reader.result;
                localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
                syncProfileUI();
                fileInput.value = "";
            };
            reader.readAsDataURL(file);
        }
    });

    // Mətnləri yeniləmək üçün modalın açılması
    document.getElementById("openEditModal").addEventListener("click", () => {
        document.getElementById("editName").value = adminProfile.name;
        document.getElementById("editUser").value = adminProfile.user;
        document.getElementById("editBio").value = adminProfile.bio;
        document.getElementById("profileModal").style.display = "block";
    });

    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("profileModal").style.display = "none";
    });

    document.getElementById("saveProfile").addEventListener("click", () => {
        adminProfile.name = document.getElementById("editName").value.trim() || adminProfile.name;
        adminProfile.user = document.getElementById("editUser").value.trim() || adminProfile.user;
        adminProfile.bio = document.getElementById("editBio").value.trim() || adminProfile.bio;

        localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
        syncProfileUI();
        document.getElementById("profileModal").style.display = "none";
    });


    // ----------------------------------------------------------------------
    // 2. REAL-TIME FAQ MANAGEMENT SYSTEM
    // ----------------------------------------------------------------------
    let approvedFaq = JSON.parse(localStorage.getItem("approvedFaq")) || [];
    let pendingQuestions = JSON.parse(localStorage.getItem("pendingQuestions")) || [];

    const faqTrigger = document.getElementById("faqTrigger");
    const faqPanelSection = document.getElementById("faqPanelSection");
    const faqCountBadge = document.getElementById("faqCountBadge");
    const incomingContainer = document.getElementById("incomingContainer");
    const activeContainer = document.getElementById("activeContainer");

    faqCountBadge.textContent = pendingQuestions.length;

    faqTrigger.addEventListener("click", () => {
        const isHidden = faqPanelSection.style.display === "none" || !faqPanelSection.style.display;
        faqPanelSection.style.display = isHidden ? "block" : "none";
        if(isHidden) renderLiveFaqSystem();
    });

    function renderLiveFaqSystem() {
        faqCountBadge.textContent = pendingQuestions.length;
        incomingContainer.innerHTML = pendingQuestions.length === 0 ? "<p style='color:var(--text-muted); font-size:13px;'>Gözləyən yeni tələbə müraciəti yoxdur.</p>" : "";
        
        pendingQuestions.forEach((q, idx) => {
            const box = document.createElement("div");
            box.style.cssText = "background:var(--bg-main); padding:16px; border-radius:12px; margin-bottom:12px; border-left:4px solid var(--accent-orange);";
            box.innerHTML = `
                <div style='font-size:11px; color:var(--accent-orange); font-weight:700;'>Müraciət edən: ${q.user}</div>
                <div style='margin:6px 0 12px 0; font-size:13.5px; color:white;'>"${q.question}"</div>
                <textarea id="ans-text-${q.id}" rows="2" style="width:100%; background:var(--bg-input); border:1px solid rgba(255,255,255,0.05); color:white; padding:8px; border-radius:6px; font-size:13px; resize:none; outline:none;" placeholder="Rəsmi cavab mətni yazın..."></textarea>
                <div style='margin-top:10px; display:flex; gap:8px;'>
                    <button onclick="publishAnswer(${q.id}, ${idx})" style='background:#10b981; color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:700;'>Cavabla</button>
                    <button onclick="discardQuestion(${idx})" style='background:var(--accent-red); color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;'>Sil</button>
                </div>
            `;
            incomingContainer.appendChild(box);
        });

        activeContainer.innerHTML = approvedFaq.length === 0 ? "<p style='color:var(--text-muted); font-size:13px;'>Portalda aktiv FAQ kontenti yoxdur.</p>" : "";
        approvedFaq.forEach((item, idx) => {
            const row = document.createElement("div");
            row.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:var(--bg-main); padding:12px 16px; border-radius:10px; margin-bottom:8px; font-size:13px;";
            row.innerHTML = `
                <span style='color:white;'><strong style='color:var(--accent-blue)'>Q:</strong> ${item.question}</span>
                <button onclick="removeActiveFaq(${idx})" style='background:transparent; border:none; color:var(--accent-red); cursor:pointer; font-size:14px;'><i class='fa-solid fa-trash-can'></i></button>
            `;
            activeContainer.appendChild(row);
        });
    }

    window.publishAnswer = (id, idx) => {
        const answerText = document.getElementById(`ans-text-${id}`).value.trim();
        if(!answerText) return alert("Boş cavab göndərilə bilməz!");
        
        approvedFaq.push({
            id: id,
            user: pendingQuestions[idx].user,
            question: pendingQuestions[idx].question,
            answer: answerText
        });
        pendingQuestions.splice(idx, 1);
        updateStorage();
    };

    window.discardQuestion = (idx) => {
        if(confirm("Bu müraciəti silmək istəyirsiniz?")) {
            pendingQuestions.splice(idx, 1);
            updateStorage();
        }
    };

    window.removeActiveFaq = (idx) => {
        if(confirm("Sistemdən çıxarmaq istəyirsiniz?")) {
            approvedFaq.splice(idx, 1);
            updateStorage();
        }
    };

    function updateStorage() {
        localStorage.setItem("approvedFaq", JSON.stringify(approvedFaq));
        localStorage.setItem("pendingQuestions", JSON.stringify(pendingQuestions));
        renderLiveFaqSystem();
    }
});

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