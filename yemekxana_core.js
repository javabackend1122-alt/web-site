// YEMƏKXANA PLATFORMASI - LOGİK JS FAYLI
document.addEventListener("DOMContentLoaded", () => {
    // 1. Aktiv İstifadəçini Tap və Yuxarı Yaz
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (activeUser) {
        document.getElementById('canteenUserName').innerText = activeUser.name;
        document.getElementById('canteenUserRole').innerText = activeUser.role.toUpperCase();

        // Admin yoxlanışı - Əgər adminsə forma sahəsini açırıq
        if (activeUser.role === 'admin') {
            document.getElementById('adminCanteenZone').style.display = 'block';
        }
    }

    // 2. Geri Düyməsinin İdarə Edilməsi
    document.getElementById('btnBackToDash').addEventListener('click', () => {
        window.location.href = "dashboard.html"; // Yeni qurduğumuz vahid dashboard-a qaytarır
    });

    // 3. Menyu Bazası və Render Prosesi
    initMenuDatabase();
    renderMealMenu();
});

// Standart ilkin italyan ləzzətləri
function initMenuDatabase() {
    const currentMenu = localStorage.getItem('portal_menu');
    if (!currentMenu) {
        const defaultMenu = [
            {
                id: "MEAL-101",
                title: "Zuppa di Pomodoro",
                price: "4.50 AZN",
                ingredients: "Təzə pomidor, reyhan, sarımsaq, xüsusi italyan zeytun yağı, parmezan pendiri və xırtıldayan fokaçça çörəyi ilə.",
                category: "sulu",
                image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500",
                badge: "Populyar",
                score: "96%"
            },
            {
                id: "MEAL-201",
                title: "Tiramisu Tradizionale",
                price: "6.50 AZN",
                ingredients: "Orijinal maskarpone pendiri, savoyardi biskvitləri, tünd italyan espressosu və üzərinə ələnmiş xalis kakao tozu.",
                category: "sirniyyat",
                image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
                badge: "Şefin Seçimi",
                score: "99%"
            }
        ];
        localStorage.setItem('portal_menu', JSON.stringify(defaultMenu));
    }
}

// Yeməkləri ekrana basan kod
function renderMealMenu() {
    const menuData = JSON.parse(localStorage.getItem('portal_menu')) || [];
    const soupsContainer = document.getElementById('soupsContainer');
    const dessertsContainer = document.getElementById('dessertsContainer');
    
    if (soupsContainer) soupsContainer.innerHTML = "";
    if (dessertsContainer) dessertsContainer.innerHTML = "";

    menuData.forEach(item => {
        const cardHtml = `
            <div class="menu-card" data-id="${item.id}">
                <div class="menu-card__image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="menu-card__img">
                    ${item.badge ? `<span class="menu-card__badge">${item.badge}</span>` : ''}
                </div>
                <div class="menu-card__info">
                    <div class="menu-card__header">
                        <h4 class="menu-card__title">${item.title}</h4>
                        <span class="menu-card__price">${item.price}</span>
                    </div>
                    <p class="menu-card__ingredients">${item.ingredients}</p>
                    <div class="menu-card__footer">
                        <div class="menu-card__stars">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <span class="menu-card__popularity-score"><i class="fas fa-fire"></i> ${item.score}</span>
                    </div>
                </div>
            </div>
        `;

        if (item.category === 'sulu' && soupsContainer) {
            soupsContainer.innerHTML += cardHtml;
        } else if (item.category === 'sirniyyat' && dessertsContainer) {
            dessertsContainer.innerHTML += cardHtml;
        }
    });
}

// Admin formunun dinlənilməsi və yeni yeməyin bazaya atılması
const addMealForm = document.getElementById('addMealForm');
if (addMealForm) {
    addMealForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('mealTitle').value.trim();
        const price = document.getElementById('mealPrice').value;
        const category = document.getElementById('mealCategory').value;
        const badge = document.getElementById('mealBadge').value.trim();
        const ingredients = document.getElementById('mealIngredients').value.trim();
        let image = document.getElementById('mealImage').value.trim();

        if (!image) {
            image = category === 'sulu' 
                ? "https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500" 
                : "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500";
        }

        let menuData = JSON.parse(localStorage.getItem('portal_menu')) || [];
        const newMeal = {
            id: "MEAL-" + Math.floor(1000 + Math.random() * 9000),
            title: title,
            price: parseFloat(price).toFixed(2) + " AZN",
            ingredients: ingredients,
            category: category,
            image: image,
            badge: badge,
            score: Math.floor(88 + Math.random() * 12) + "%"
        };

        menuData.push(newMeal);
        localStorage.setItem('portal_menu', JSON.stringify(menuData));

        // Qlobal bildiriş tetiklənməsi
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const canteenNotification = {
            id: "NOTIF-" + Math.floor(Math.random() * 100000),
            message: `Menyuda Yenilik! Şef tərəfindən yeni İtalyan ləzzəti əlavə olundu: "${title}"`,
            type: 'Yeməkxana',
            time: timestamp
        };
        localStorage.setItem('portal_global_notification', JSON.stringify(canteenNotification));

        addMealForm.reset();
        renderMealMenu();
        alert(`"${title}" uğurla əlavə edildi!`);
    });
}