document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.querySelector(".search-box__btn");

    // Axtarış funksiyası
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (query === "") {
            searchInput.focus();
            return;
        }

        // Səhifədəki əsas bölmələri və başlıqları
        const targets = document.querySelectorAll(".section__title, .hero__title, h2, h3, .cta-main-heading");
        let found = false;

        for (let target of targets) {
            const targetText = target.textContent.toLowerCase();

            // Əgər axtarılan söz başlıq mətni daxilində tapılarsa
            if (targetText.includes(query)) {
                // Tapılan hissəyə zərif şəkildə sürüşdür (Smooth Scroll)
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                // Vizual olaraq istifadəçinin diqqətini çəkmək üçün keçici effekt
                target.style.transition = "all 0.4s ease";
                target.style.textShadow = "0 0 15px #38bdf8";
                target.style.transform = "scale(1.03)";
                
                setTimeout(() => {
                    target.style.textShadow = "none";
                    target.style.transform = "scale(1)";
                }, 2000);

                found = true;
                break; // İlk tapılan nəticəyə fokuslan və dayan
            }
        }

        // Əgər səhifədə birbaşa vizual başlıq tapılmazsa, alt keçidləri yoxla
        if (!found) {
            if (query.includes("yemək") || query.includes("meny") || query.includes("metbex") || query.includes("yemek")) {
                window.location.href = "yemekxana_platformasu.html";
            } else if (query.includes("kitab") || query.includes("oxu") || query.includes("pdf")) {
                window.location.href = "kitabxana.html";
            } else if (query.includes("xəbər") || query.includes("xeber") || query.includes("yenilik")) {
                window.location.href = "xeberler.html";
            } else if (query.includes("əlaqə") || query.includes("elaye") || query.includes("telefon")) {
                window.location.href = "contact.html";
            } else if (query.includes("sual") || query.includes("faq")) {
                window.location.href = "faq.html";
            } else {
                // Tapılmadıqda daxili input xətası vizualı
                searchInput.style.border = "1px solid #ef4444";
                searchInput.placeholder = "Nəticə tapılmadı...";
                setTimeout(() => {
                    searchInput.style.border = "";
                    searchInput.placeholder = "Portal üzrə axtarış...";
                }, 2000);
            }
        }
    }

    // 1. Düyməyə klikləyəndə axtar
    if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    // 2. "Enter" düyməsini basanda axtar
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                performSearch();
            }
        });
    }
});