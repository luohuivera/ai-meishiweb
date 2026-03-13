// State Management
let currentState = {
  activeUni: 'all',
  activeCategory: 'all',
  sortBy: 'rating',
  view: 'grid', // 'grid' | 'map'
  searchQuery: '',
  favorites: [],
  checkins: []
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
function toggleFav(e, id) {
  e.stopPropagation(); // prevent modal from opening when clicking fav
  if (currentState.favorites.includes(id)) {
    currentState.favorites = currentState.favorites.filter(fId => fId !== id);
  } else {
    currentState.favorites.push(id);
  }
  renderRestaurants();
}

function toggleCheckin(id) {
  if (currentState.checkins.includes(id)) {
    currentState.checkins = currentState.checkins.filter(cId => cId !== id);
  } else {
    currentState.checkins.push(id);
  }
  openModal(id); // Re-render modal to show updated state
}

function toggleReviewInput() {
  const reviewArea = document.getElementById('reviewInputArea');
  if (reviewArea) {
    reviewArea.classList.toggle('show');
    if (reviewArea.classList.contains('show')) {
      document.getElementById('reviewText').focus();
    }
  }
}

function submitReview(id) {
  const input = document.getElementById('reviewText');
  const text = input.value.trim();
  if (!text) return;

  const res = mockRestaurants.find(r => r.id === id);
  if (res) {
    res.reviews.unshift({ user: "我 (当前用户)", text: text });
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
  document.body.style.overflow = '';
}

// Run!
init();
