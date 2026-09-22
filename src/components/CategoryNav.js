import { CATEGORIES } from '../data/mockData.js';

export function renderCategoryNav(selectedCategoryId) {
  return `
    <section class="categories-section">
      <div class="container">
        <div class="category-tabs-wrapper">
          ${CATEGORIES.map(cat => `
            <button class="cat-tab-btn ${cat.id === selectedCategoryId ? 'active' : ''}" data-category-id="${cat.id}">
              <i data-lucide="${cat.icon}" style="width:18px; height:18px;"></i>
              <span>${cat.name}</span>
              ${cat.badge ? `<span class="badge-gold" style="font-size:0.65rem; padding:0.15rem 0.5rem; margin-left:4px;">${cat.badge}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initCategoryNavEvents(onCategoryChange) {
  const tabs = document.querySelectorAll('.cat-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const catId = tab.getAttribute('data-category-id');
      if (onCategoryChange) onCategoryChange(catId);
    });
  });
}
