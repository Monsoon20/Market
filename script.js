let ads = JSON.parse(localStorage.getItem('vse_srazu_ads')) || [];
let currentFilter = 'all';

// Відображення товарів
function renderAds(data = ads) {
    const grid = document.getElementById('adsGrid');
    const empty = document.getElementById('emptyMsg');
    
    let filtered = data;
    if (currentFilter !== 'all') {
        filtered = data.filter(a => a.category === currentFilter);
    }

    grid.innerHTML = '';
    if (filtered.length === 0) {
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    filtered.forEach((ad, index) => {
        grid.innerHTML += `
            <div class="ad-card" onclick="showDetails(${index})">
                <div class="ad-img" style="background-image: url('${ad.img || 'https://via.placeholder.com/300'}')"></div>
                <div class="ad-info">
                    <p class="ad-price">${ad.price} грн</p>
                    <h3 class="ad-title">${ad.title}</h3>
                </div>
            </div>
        `;
    });
}

// Пошук
function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const result = ads.filter(ad => ad.title.toLowerCase().includes(query));
    renderAds(result);
}

// Фільтр по категоріях
function filterByCat(cat, el) {
    currentFilter = cat;
    document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
    if(el) el.classList.add('active');
    renderAds();
}

// Детальна інформація
function showDetails(index) {
    const ad = ads[index];
    const content = document.getElementById('itemDetailContent');
    content.innerHTML = `
        <div style="display:flex; gap:20px; flex-wrap:wrap">
            <img src="${ad.img || 'https://via.placeholder.com/300'}" style="width:100%; max-height:300px; object-fit:contain; background:#f0f0f0; border-radius:8px;">
            <div style="flex:1; min-width:250px">
                <h2 style="margin-bottom:10px">${ad.title}</h2>
                <p style="font-size:24px; color:#3a77ff; font-weight:bold; margin-bottom:15px">${ad.price} грн</p>
                <p style="color:#666; margin-bottom:10px"><b>Категорія:</b> ${ad.category}</p>
                <p style="line-height:1.6">${ad.desc}</p>
                <hr style="margin:20px 0; border:0; border-top:1px solid #eee">
                <button onclick="deleteAd(${index})" style="color:red; background:none; border:none; cursor:pointer">Видалити оголошення</button>
            </div>
        </div>
    `;
    toggleModal('detailModal');
}

// Додавання
document.getElementById('sellForm').onsubmit = function(e) {
    e.preventDefault();
    const newAd = {
        title: document.getElementById('itemTitle').value,
        price: document.getElementById('itemPrice').value,
        category: document.getElementById('itemCat').value,
        desc: document.getElementById('itemDesc').value,
        img: document.getElementById('itemImg').value
    };
    ads.push(newAd);
    localStorage.setItem('vse_srazu_ads', JSON.stringify(ads));
    this.reset();
    toggleModal('sellModal');
    renderAds();
};

function deleteAd(index) {
    if(confirm('Видалити це оголошення?')) {
        ads.splice(index, 1);
        localStorage.setItem('vse_srazu_ads', JSON.stringify(ads));
        toggleModal('detailModal');
        renderAds();
    }
}

function toggleModal(id) {
    const m = document.getElementById(id);
    m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
}

function login(e) {
    e.preventDefault();
    localStorage.setItem('vse_user', document.getElementById('loginName').value);
    location.reload();
}

window.onload = () => {
    const user = localStorage.getItem('vse_user');
    if(user) {
        document.getElementById('userMenu').innerHTML = `
            <span>Привіт, <b>${user}</b></span>
            <button class="btn-add" onclick="toggleModal('sellModal')">+ Продати</button>
        `;
    }
    renderAds();
};