// State Management
let currentState = {
  activeUni: 'all',
  activeCategory: 'all',
  sortBy: 'rating',
  view: 'grid', // 'grid' | 'map'
  searchQuery: '',
  favorites: [],
  checkins: [],
  isLoggedIn: false,
  username: ''
};

// DOM Elements
const uniSelector = document.getElementById('uniSelector');
const categoryFilters = document.getElementById('categoryFilters');
const restaurantGrid = document.getElementById('restaurantGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const viewBtns = document.querySelectorAll('.view-btn');
const gridView = document.getElementById('restaurantGrid');
const mapView = document.getElementById('mapView');
const sortLinks = document.querySelectorAll('[data-sort]');

// Initialize App
function init() {
  renderUniButtons();
  renderCategoryButtons();
  renderRestaurants();
  setupEventListeners();
}

// Renders
function renderUniButtons() {
  let html = `<button class="uni-btn active" data-uni="all">全部大学</button>`;
  universities.forEach(uni => {
    html += `<button class="uni-btn" data-uni="${uni.id}">${uni.name}</button>`;
  });
  uniSelector.innerHTML = html;
}

function renderCategoryButtons() {
  let html = `<button class="cat-btn active" data-cat="all">🔥 全部推荐</button>`;
  categories.forEach(cat => {
    html += `<button class="cat-btn" data-cat="${cat}">${cat}</button>`;
  });
  categoryFilters.innerHTML = html;
}

function renderRestaurants() {
  const filtered = filterAndSortData();
  
  if (filtered.length === 0) {
    restaurantGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
        <i class="ri-restaurant-2-line" style="font-size: 3rem; color: var(--primary); display:block; margin-bottom:1rem;"></i>
        <p>找不到符合条件的餐厅，换个搜索词试试？</p>
      </div>`;
    return;
  }

  restaurantGrid.innerHTML = filtered.map(res => {
    const isFav = currentState.favorites.includes(res.id);
    return `
    <div class="res-card glass-card" onclick="openModal(${res.id})">
      <div class="card-img">
        <img src="${res.image}" alt="${res.name}" loading="lazy">
        <span class="card-badge">${res.category}</span>
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${res.id})" title="收藏">
          <i class="${isFav ? 'ri-heart-3-fill' : 'ri-heart-3-line'}"></i>
        </button>
        <span class="dist-badge"><i class="ri-walk-line"></i> ${res.distance}m</span>
      </div>
      <div class="card-info">
        <div class="card-title-row">
          <h3 class="card-title">${res.name}</h3>
          <span class="card-rating"><i class="ri-star-fill"></i> ${res.rating}</span>
        </div>
        <div class="card-meta">
          <span><i class="ri-money-cny-circle-line"></i> 人均 ${res.price}</span>
          <span><i class="ri-map-pin-2-line"></i> ${res.address}</span>
        </div>
        <div class="card-tags">
          ${res.tags.map(tag => `<span class="tag"># ${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `}).join('');
}

// Actions
function checkLogin() {
  if (!currentState.isLoggedIn) {
    document.getElementById('authModal').classList.remove('hidden');
    return false;
  }
  return true;
}

function handleUserClick() {
  if (currentState.isLoggedIn) {
    openProfileTab('checkins');
  } else {
    document.getElementById('authModal').classList.remove('hidden');
  }
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function performLogin() {
  const username = document.getElementById('usernameInput').value || '同学';
  currentState.isLoggedIn = true;
  currentState.username = username;
  
  document.getElementById('userNameText').innerText = username;
  document.getElementById('userIcon').classList.replace('ri-user-line', 'ri-user-star-fill');
  document.getElementById('userLoginBtn').style.borderColor = 'var(--primary)';
  document.getElementById('userLoginBtn').style.color = 'var(--primary)';
  
  closeAuthModal();
}

function performLogout() {
  currentState.isLoggedIn = false;
  document.getElementById('userNameText').innerText = '登录';
  document.getElementById('userIcon').classList.replace('ri-user-star-fill', 'ri-user-line');
  document.getElementById('userLoginBtn').style.borderColor = 'rgba(255,255,255,0.2)';
  document.getElementById('userLoginBtn').style.color = '';
  closeProfileModal();
}

function toggleFav(e, id) {
  e.stopPropagation(); // prevent modal from opening when clicking fav
  if (!checkLogin()) return;

  if (currentState.favorites.includes(id)) {
    currentState.favorites = currentState.favorites.filter(fId => fId !== id);
  } else {
    currentState.favorites.push(id);
  }
  renderRestaurants();
}

function toggleCheckin(id) {
  if (!checkLogin()) return;

  if (currentState.checkins.includes(id)) {
    currentState.checkins = currentState.checkins.filter(cId => cId !== id);
  } else {
    currentState.checkins.push(id);
  }
  openModal(id); // Re-render modal to show updated state
}

function toggleReviewInput() {
  if (!checkLogin()) return;
  const reviewArea = document.getElementById('reviewInputArea');
  if (reviewArea) {
    reviewArea.classList.toggle('show');
    if (reviewArea.classList.contains('show')) {
      document.getElementById('reviewText').focus();
    }
  }
}

function submitReview(id) {
  if (!checkLogin()) return;
  const input = document.getElementById('reviewText');
  const text = input.value.trim();
  if (!text) return;

  const res = mockRestaurants.find(r => r.id === id);
  if (res) {
    res.reviews.unshift({ user: currentState.username, text: text });
    input.value = '';
    openModal(id); // Re-render to show new review
  }
}

// Logic
function filterAndSortData() {
  let result = mockRestaurants.filter(res => {
    const matchUni = currentState.activeUni === 'all' || res.uni === currentState.activeUni;
    const matchCat = currentState.activeCategory === 'all' || res.category === currentState.activeCategory;
    const matchSearch = res.name.includes(currentState.searchQuery) || 
                        res.category.includes(currentState.searchQuery) ||
                        res.tags.some(t => t.includes(currentState.searchQuery));
    return matchUni && matchCat && matchSearch;
  });

  result.sort((a, b) => {
    if (currentState.sortBy === 'rating') return b.rating - a.rating;
    if (currentState.sortBy === 'distance') return a.distance - b.distance;
    if (currentState.sortBy === 'priceAsc') return a.price - b.price;
    return 0;
  });

  return result;
}

// Events
function setupEventListeners() {
  // Uni Filtering
  uniSelector.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      document.querySelectorAll('.uni-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentState.activeUni = e.target.dataset.uni;
      renderRestaurants();
    }
  });

  // Category Filtering
  categoryFilters.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentState.activeCategory = e.target.dataset.cat;
      renderRestaurants();
    }
  });

  // Search
  searchInput.addEventListener('input', (e) => {
    currentState.searchQuery = e.target.value.trim();
    renderRestaurants();
  });

  // Sort
  sortLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      currentState.sortBy = e.target.dataset.sort;
      document.querySelector('.dropdown-btn').innerHTML = `<i class="ri-sort-desc"></i> ${e.target.innerText}`;
      renderRestaurants();
    });
  });

  // View Toggles
  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('button');
      viewBtns.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      
      currentState.view = targetBtn.dataset.view;
      if (currentState.view === 'grid') {
        gridView.classList.remove('hidden');
        mapView.classList.add('hidden');
      } else {
        gridView.classList.add('hidden');
        mapView.classList.remove('hidden');
      }
    });
  });

  // Modal Close
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
}

// Modal Functions
function openModal(id) {
  const res = mockRestaurants.find(r => r.id === id);
  if (!res) return;

  const uniObj = universities.find(u => u.id === res.uni);
  const uniName = uniObj ? uniObj.name : '未知大学';
  const isCheckedIn = currentState.checkins.includes(id);

  modalBody.innerHTML = `
    <img src="${res.image}" alt="${res.name}" class="modal-header-img">
    
    <div class="modal-info-wrap">
      <div class="modal-header-row">
        <div class="modal-title">
          <h2>${res.name}</h2>
          <div class="modal-meta">
            <span><i class="ri-star-fill" style="color:var(--accent-yellow)"></i> ${res.rating} 分</span>
            <span><i class="ri-money-cny-circle-line"></i> 人均 ¥${res.price}</span>
            <span><i class="ri-school-line"></i> 距 ${uniName} ${res.distance}m</span>
          </div>
        </div>
        <button class="nav-btn"><i class="ri-navigation-fill"></i> 一键导航</button>
      </div>

      <!-- Dianping Block -->
      <div class="dianping-block glass-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1.2rem; margin-bottom: 1.5rem; background: rgba(255, 106, 0, 0.05); border-left: 4px solid var(--primary); border-radius: 8px;">
        <div style="display: flex; flex-direction: column; gap: 0.3rem;">
           <div style="display:flex; align-items:center; gap:0.5rem; font-weight:800; font-size:1.1rem; color: #fff;">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="22" height="22" style="border-radius:4px;"><rect width="1024" height="1024" fill="#f63"/><path d="M512 341.33c47.15 0 85.33-38.19 85.33-85.33S559.15 170.67 512 170.67 426.67 208.85 426.67 256 464.85 341.33 512 341.33zM754.35 628.9l-151.04-129.7-44.37-34.99c-15.36-22.19-39.25-33.71-64-33.71-23.04 0-45.65 10.67-60.59 31.15l-43.95 50.77-138.67 96.43c-21.33 14.93-26.45 44.37-11.52 65.71 14.93 21.33 44.37 26.45 65.71 11.52l104.96-72.53 26.88 126.29-113.92 79.36c-17.92 19.63-16.21 49.92 4.27 67.41 9.39 7.68 20.91 11.52 32.43 11.52 13.65 0 27.31-5.55 37.12-16.21l138.24-151.89 30.29-94.29 36.69 72.11 48.64 153.6c7.68 24.75 34.56 38.4 59.31 29.87 24.75-7.68 38.4-34.56 29.87-59.31l-32.85-104.53 66.13-46.08c21.33-14.93 26.45-44.37 11.52-65.71-10.24-14.51-26.45-22.61-43.09-22.61-5.97 0-11.95 1.28-17.49 3.84z" fill="#fff"/></svg>
             大众点评
           </div>
           <div style="color: var(--text-muted); font-size: 0.95rem;">
             ⭐️ 综合评分 <span style="color:#fbbf24; font-weight:bold">${res.dianping.rating}</span> 
             <span style="margin:0 0.5rem">|</span> 
             📝 ${res.dianping.reviewCount}+ 条求真评价 
             <span style="margin:0 0.5rem">|</span> 
             💰 人均 ¥${res.dianping.avgPrice}
           </div>
        </div>
        <a href="${res.dianping.url}" target="_blank" class="dp-link-btn" style="background:#f63; color:#fff; padding:0.6rem 1.2rem; border-radius:30px; font-weight:600; font-size:0.95rem; text-decoration:none; display:flex; align-items:center; gap:0.3rem; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(255,102,51,0.3);">
          去 App 看详情 <i class="ri-arrow-right-s-line"></i>
        </a>
      </div>

      <div class="modal-actions-row">
        <button class="checkin-btn" onclick="toggleCheckin(${id})">
          <i class="${isCheckedIn ? 'ri-map-pin-user-fill' : 'ri-map-pin-add-line'}"></i> 
          ${isCheckedIn ? '已打卡' : '我要打卡'}
        </button>
        <button class="write-review-btn" onclick="toggleReviewInput()">
          <i class="ri-edit-2-line"></i> 分享评论
        </button>
      </div>
      
      <div class="review-input-area" id="reviewInputArea">
        <textarea id="reviewText" class="review-textarea" placeholder="这家店味道怎么样？环境好吗？把你的真实感受分享给大家吧..."></textarea>
        <button class="submit-review-btn" onclick="submitReview(${id})">发布评论</button>
        <div style="clear: both;"></div>
      </div>
      
      <p style="color: var(--text-muted); margin: 1.5rem 0;">
        <i class="ri-map-pin-line"></i> 地址：${res.address} &nbsp;|&nbsp; 
        <i class="ri-time-line"></i> 营业时间：${res.hours}
      </p>

      <div class="modal-grid-2">
        <div class="dishes-section">
          <h3 class="section-title">招牌必点</h3>
          <div class="dishes-list">
            ${res.signatureDishes.map(dish => `
              <div class="dish-item">
                <span class="dish-name">${dish}</span>
                <i class="ri-thumb-up-fill"></i>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="reviews-section">
          <h3 class="section-title">学生真实评价</h3>
          <div class="reviews-list">
            ${res.reviews.map(rev => `
              <div class="review-item">
                <div class="review-user">${rev.user}</div>
                <div class="review-text">"${rev.text}"</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // prevent bg scroll
}

function closeModal() {
  modal.classList.add('hidden');
}

// Ranking Logic
function showRanking() {
  document.querySelectorAll('.uni-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  
  // reset state to show top 10 regardless of filters
  currentState.activeUni = 'all';
  currentState.activeCategory = 'all';
  currentState.searchQuery = '';
  
  // Custom Render for Rankings
  const top10 = [...mockRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 5); // top 5
  
  restaurantGrid.innerHTML = top10.map((res, index) => {
    const isFav = currentState.favorites.includes(res.id);
    let medalColor = index === 0 ? '#fbbf24' : (index === 1 ? '#94a3b8' : (index === 2 ? '#b45309' : '#fff'));
    let shadowColor = index === 0 ? 'rgba(251, 191, 36, 0.4)' : (index === 1 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(255,255,255,0.05)');
    return `
    <div class="res-card glass-card" onclick="openModal(${res.id})" style="border: 2px solid ${index < 3 ? medalColor : 'rgba(255,255,255,0.1)'}; box-shadow: 0 8px 32px ${shadowColor};">
      <div class="card-img">
        <div style="position: absolute; top:0; left:0; right:0; bottom:0; padding:1.5rem; background: linear-gradient(to right, rgba(0,0,0,0.8), transparent); z-index: 1;">
           <span style="font-size:3rem; font-weight:900; color:${medalColor}; opacity:0.9; text-shadow: 0 0 10px rgba(0,0,0,0.5);">NO.${index+1}</span>
        </div>
        <img src="${res.image}" alt="${res.name}" loading="lazy" style="filter: brightness(0.8);">
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${res.id})" title="收藏" style="z-index: 2;">
          <i class="${isFav ? 'ri-heart-3-fill' : 'ri-heart-3-line'}"></i>
        </button>
      </div>
      <div class="card-info">
        <div class="card-title-row">
          <h3 class="card-title">${res.name}</h3>
          <span class="card-rating" style="font-size: 1.2rem; color: #fbbf24;"><i class="ri-star-fill"></i> ${res.rating}</span>
        </div>
        <div class="card-meta">
          <span><i class="ri-fire-fill" style="color:#ef4444"></i> 入选大学城必吃榜</span>
        </div>
      </div>
    </div>
  `}).join('');
  
  // Smooth scroll
  document.getElementById('restaurantGrid').scrollIntoView({ behavior: 'smooth' });
}

// Profile Modal Logic
function openProfileTab(tab) {
  if (!checkLogin()) return;
  
  document.getElementById('profileModal').classList.remove('hidden');
  document.getElementById('profileName').innerText = currentState.username;
  document.getElementById('profileAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentState.username)}&background=ff6b00&color=fff`;
  
  switchProfileTab(tab);
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
}

function switchProfileTab(tab) {
  document.getElementById('tabCheckins').classList.toggle('active', tab === 'checkins');
  document.getElementById('tabFavorites').classList.toggle('active', tab === 'favorites');
  
  document.getElementById('countCheckins').innerText = currentState.checkins.length;
  document.getElementById('countFavorites').innerText = currentState.favorites.length;
  
  const container = document.getElementById('profileContent');
  const ids = tab === 'checkins' ? currentState.checkins : currentState.favorites;
  
  if (ids.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem 0;">
      <i class="ri-ghost-smile-line" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--text-muted);"></i>
      还没有记录呢，快去探索美食吧！
    </div>`;
    return;
  }
  
  // Render mini cards
  container.innerHTML = ids.map(id => {
    const res = mockRestaurants.find(r => r.id === id);
    if (!res) return '';
    return `
      <div class="glass-card res-card" style="padding: 1rem; cursor: pointer; display: block;" onclick="closeProfileModal(); openModal(${res.id});">
        <div style="height: 120px; border-radius: 8px; overflow: hidden; margin-bottom: 0.8rem;">
          <img src="${res.image}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="font-weight: 700; font-size: 1.1rem; color: #fff; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${res.name}</div>
        <div style="color: var(--accent-yellow); font-size: 0.9rem; margin-bottom: 0.5rem; font-weight: 600;"><i class="ri-star-fill"></i> ${res.rating} 分</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;"><i class="ri-map-pin-2-line"></i> ${res.category}</div>
      </div>
    `;
  }).join('');
}

// Run!
init();
