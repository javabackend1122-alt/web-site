document.addEventListener("DOMContentLoaded", () => {
    const librarySearch = document.getElementById("librarySearch");
    const shelfButtons = document.querySelectorAll(".shelf-btn");
    const bookCards = document.querySelectorAll(".modern-book-card");

    let currentFilter = "all";

    // 1. RƏF KLİKLƏMƏ FUNKSİYASI
    shelfButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Aktiv sinfi hamıdan sil, kliklənənə əlavə et
            shelfButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentFilter = button.getAttribute("data-filter");
            runSearchAndFilter();
        });
    });

    // 2. AXTARIŞ INPUTUNU İZLƏMƏK
    if (librarySearch) {
        librarySearch.addEventListener("input", () => {
            runSearchAndFilter();
        });
    }

    // 3. SEHRLİ MATRİS: HƏM AXTAR, HƏM FİLTRLƏ
    function runSearchAndFilter() {
        const queryText = librarySearch ? librarySearch.value.toLowerCase().trim() : "";

        bookCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            
            // Kartın daxilindəki bütün mətn zonalarını oxuyuruq
            const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const author = card.querySelector(".author-name")?.textContent.toLowerCase() || "";
            const profCode = card.querySelector(".profession-code")?.textContent.toLowerCase() || "";
            const summary = card.querySelector(".summary-text")?.textContent.toLowerCase() || "";

            // Qaydalarımıza uyğun gəlirmi yoxla?
            const isCategoryMatch = (currentFilter === "all" || cardCategory === currentFilter);
            
            const isSearchMatch = (
                title.includes(queryText) ||
                author.includes(queryText) ||
                profCode.includes(queryText) ||
                summary.includes(queryText)
            );

            // Hər iki qayda eyni anda ödənməlidir
            if (isCategoryMatch && isSearchMatch) {
                // Kartı vizual olaraq gözəl effektlə göstər
                card.style.display = "flex";
                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                }, 10);
            } else {
                // Kartı tamamilə gizlət
                card.style.display = "none";
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
            }
        });
    }
});