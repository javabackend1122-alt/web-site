document.addEventListener("DOMContentLoaded", () => {
    const tabLinks = document.querySelectorAll(".tab-link");
    const newsCards = document.querySelectorAll(".news-card");

    tabLinks.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".tab-link.active").classList.remove("active");
            button.classList.add("active");

            const targetCategory = button.getAttribute("data-category");

            newsCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (targetCategory === "all" || cardCategory === targetCategory) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});