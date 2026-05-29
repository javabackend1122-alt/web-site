document.addEventListener("DOMContentLoaded", () => {
    
    // Yaddaşdan dataları oxu (İlk başda boş müraciət olacaq)
    let approvedFaq = JSON.parse(localStorage.getItem("approvedFaq")) || [];
    let pendingQuestions = JSON.parse(localStorage.getItem("pendingQuestions")) || [];

    // Adminin daxil olub-olmadığını yoxlamaq üçün kiçik bir status trackeri
    let isAdminLoggedIn = false;

    const sualForm = document.getElementById("sualForm");
    const faqAccordion = document.getElementById("faqAccordion");
    const faqCount = document.getElementById("faqCount");
    const incomingQuestions = document.getElementById("incomingQuestions");
    const toggleAdminBtn = document.getElementById("toggleAdminBtn");
    const adminPanelContent = document.getElementById("adminPanelContent");
    const toast = document.getElementById("toastNotification");

    renderFAQ();
    renderAdminPanel();

    // İSTİFADƏÇİ SUALINI GÖNDƏRİR
    sualForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newQuestion = {
            id: Date.now(),
            user: document.getElementById("username").value.trim(),
            question: document.getElementById("userQuestion").value.trim()
        };

        pendingQuestions.push(newQuestion);
        localStorage.setItem("pendingQuestions", JSON.stringify(pendingQuestions));
        
        sualForm.reset();
        
        // Toast Bildirişini Göstər
        toast.classList.remove("hidden", "hide");
        setTimeout(() => {
            toast.classList.add("hide");
            setTimeout(() => {
                toast.classList.add("hidden");
            }, 300);
        }, 4000);
        
        renderAdminPanel();
    });

    // FAQ SİYAHISINI RENDƏR ETMƏK
    function renderFAQ() {
        faqAccordion.innerHTML = "";
        faqCount.textContent = `${approvedFaq.length} Sual`;

        if (approvedFaq.length === 0) {
            faqAccordion.innerHTML = `<p style="color:var(--text-muted); font-size:14px; text-align:center; padding:30px 0;">Hazırda cavablandırılmış sual yoxdur.</p>`;
            return;
        }

        approvedFaq.forEach((item, index) => {
            const faqItem = document.createElement("div");
            faqItem.className = "faq-item";
            
            // Əgər admin daxil olubsa, sualın yanına "Siyahıdan Sil" düyməsi qoyuruq
            const deleteButtonHtml = isAdminLoggedIn 
                ? `<button class="btn-delete-faq" data-index="${index}" style="background:#ef4444; color:white; border:none; padding:4px 10px; font-size:11px; font-weight:700; border-radius:6px; cursor:pointer; margin-left:10px;"><i class="fa-solid fa-trash"></i> Sil</button>`
                : "";

            faqItem.innerHTML = `
                <div class="faq-question-wrapper" style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <button class="faq-question" style="flex-grow: 1;">
                        <span><i class="fa-solid fa-circle-question faq-icon"></i> ${item.question} <small style="color:var(--text-muted); font-size:11px; font-weight:400;">(${item.user})</small></span>
                        <i class="fa-solid fa-chevron-down arrow-icon"></i>
                    </button>
                    ${deleteButtonHtml}
                </div>
                <div class="faq-answer">
                    <div class="answer-content">${item.answer}</div>
                </div>
            `;
            
            // Akkordeon funksiyası
            faqItem.querySelector(".faq-question").addEventListener("click", () => {
                const isItemActive = faqItem.classList.contains("active");
                
                document.querySelectorAll(".faq-item").forEach(el => {
                    el.classList.remove("active");
                    el.querySelector(".faq-answer").style.maxHeight = null;
                });

                if (!isItemActive) {
                    faqItem.classList.add("active");
                    const answerBlock = faqItem.querySelector(".faq-answer");
                    answerBlock.style.maxHeight = answerBlock.scrollHeight + "px";
                }
            });

            // Təsdiqlənmiş sualı silmə mexanizmi
            if (isAdminLoggedIn) {
                faqItem.querySelector(".btn-delete-faq").addEventListener("click", (e) => {
                    e.stopPropagation(); // Akkordeonun açılmasının qarşısını alır
                    if (confirm("Bu sual-cavabı FAQ siyahısından tamamilə silmək istədiyinizə əminsiniz?")) {
                        approvedFaq.splice(index, 1);
                        localStorage.setItem("approvedFaq", JSON.stringify(approvedFaq));
                        renderFAQ();
                    }
                });
            }

            faqAccordion.appendChild(faqItem);
        });
    }

    // ADMİN PANELİNİ RENDƏR ETMƏK (GƏLƏN SUALLARI SİLMƏK VƏ CAVABLAMAQ)
    function renderAdminPanel() {
        incomingQuestions.innerHTML = "";
        toggleAdminBtn.textContent = `Gələn Suallar (${pendingQuestions.length})`;

        if (pendingQuestions.length === 0) {
            incomingQuestions.innerHTML = `<p style="color:var(--text-muted); font-size:13px; text-align:center; padding:10px 0;">Gözləmədə olan yeni sual yoxdur.</p>`;
            return;
        }

        pendingQuestions.forEach((q, index) => {
            const card = document.createElement("div");
            card.className = "incoming-card";
            card.innerHTML = `
                <div class="incoming-meta">GÖNDƏRƏN: ${q.user.toUpperCase()}</div>
                <div class="incoming-q-text">"${q.question}"</div>
                <textarea class="admin-reply-area" id="reply-${q.id}" rows="2" placeholder="Rəsmi cavabınızı bura yazın..." required></textarea>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button class="btn-cavabla" data-id="${q.id}"><i class="fa-solid fa-square-check"></i> Cavabla və Dərc Et</button>
                    <button class="btn-reject" style="background:#ef4444; color:white; border:none; padding:10px 16px; font-size:13px; font-weight:700; border-radius:8px; cursor:pointer;"><i class="fa-solid fa-circle-xmark"></i> İmtina Et (Sil)</button>
                </div>
            `;

            // Cavablama düyməsi
            card.querySelector(".btn-cavabla").addEventListener("click", () => {
                const replyText = document.getElementById(`reply-${q.id}`).value.trim();
                if (!replyText) {
                    alert("Zəhmət olmasa cavab yazın!");
                    return;
                }

                approvedFaq.push({
                    id: q.id,
                    user: q.user,
                    question: q.question,
                    answer: replyText
                });

                pendingQuestions.splice(index, 1);
                updateStorageAndRefresh();
            });

            // Gələn sualı birbaşa rədd etmək / silmək düyməsi
            card.querySelector(".btn-reject").addEventListener("click", () => {
                if (confirm("Bu sualı cavablandırmadan silmək istəyirsiniz?")) {
                    pendingQuestions.splice(index, 1);
                    updateStorageAndRefresh();
                }
            });

            incomingQuestions.appendChild(card);
        });
    }

    function updateStorageAndRefresh() {
        localStorage.setItem("approvedFaq", JSON.stringify(approvedFaq));
        localStorage.setItem("pendingQuestions", JSON.stringify(pendingQuestions));
        renderFAQ();
        renderAdminPanel();
    }

    // TƏHLÜKƏSİZLİK ŞİFRƏSİ Mexanizmi
    toggleAdminBtn.addEventListener("click", () => {
        if (adminPanelContent.classList.contains("hidden")) {
            const sifre = prompt("Admin panelinə keçid üçün təhlükəsizlik kodunu daxil edin (Şifrə: 1234):");
            if (sifre === "000&111Admin#") {
                isAdminLoggedIn = true; // Admin statusunu aktivləşdirir
                adminPanelContent.classList.remove("hidden");
                toggleAdminBtn.textContent = "Paneli Gizlə";
                renderFAQ(); // Düymələrin görünməsi üçün FAQ siyahısını yenidən qurur
            } else if (sifre !== null) {
                alert("Yanlış təhlükəsizlik kodu!");
            }
        } else {
            isAdminLoggedIn = false;
            adminPanelContent.classList.add("hidden");
            toggleAdminBtn.textContent = `Gələn Suallar (${pendingQuestions.length})`;
            renderFAQ();
        }
    });
});