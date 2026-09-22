export function renderFilterBar(activeCategory, activeSubCat, currentSort, activeSearchQuery) {
  let subCats = [];
  if (activeCategory === 'hunian') {
    subCats = ['Semua Hunian', 'Kos Putri', 'Kos Putra', 'Kos Campur'];
  } else if (activeCategory === 'kuliner') {
    subCats = ['Semua Kuliner', 'Warung Mahasiswa', 'UMKM Makanan', 'Food Court'];
  } else if (activeCategory === 'nongkrong') {
    subCats = ['Semua Cafe', 'Coffee Shop & Nugas', 'Cafe Tempat Belajar', 'WiFi 24h'];
  } else if (activeCategory === 'kebutuhan') {
    subCats = ['Semua Kebutuhan', 'Percetakan & ATK', 'Laundry Kiloan', 'Fotokopi'];
  } else if (activeCategory === 'lainnya') {
    subCats = ['Semua Services', 'Sewa Motor', 'Service Laptop & HP'];
  }

  return `
    <div class="container">
      <div class="filter-bar">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          ${activeSearchQuery ? `
            <div class="badge-red" style="padding:0.4rem 0.9rem; font-size:0.85rem;">
              <i data-lucide="search" style="width:14px; height:14px;"></i>
              Pencarian: "${activeSearchQuery}"
              <span id="clear-search-btn" style="cursor:pointer; margin-left:6px; font-weight:800;">✕</span>
            </div>
          ` : ''}

          ${subCats.length > 0 ? `
            <div class="subcat-pills">
              ${subCats.map(sub => `
                <button class="subcat-pill ${activeSubCat === sub ? 'active' : ''}" data-subcat="${sub}">
                  ${sub}
                </button>
              `).join('')}
            </div>
          ` : '<span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">Menampilkan Rekomendasi Terkurasi</span>'}
        </div>

        <div style="display:flex; align-items:center; gap:0.75rem;">
          <label style="font-size:0.82rem; font-weight:700; color:var(--text-muted);">Urutkan:</label>
          <select class="sort-select" id="sort-order-select">
            <option value="popular" ${currentSort === 'popular' ? 'selected' : ''}>Paling Populer & Rating</option>
            <option value="price-asc" ${currentSort === 'price-asc' ? 'selected' : ''}>Harga: Terendah ke Tertinggi</option>
            <option value="price-desc" ${currentSort === 'price-desc' ? 'selected' : ''}>Harga: Tertinggi ke Terendah</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

export function initFilterBarEvents(onSubCatChange, onSortChange, onClearSearch) {
  const subPills = document.querySelectorAll('.subcat-pill');
  subPills.forEach(pill => {
    pill.addEventListener('click', () => {
      subPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const sub = pill.getAttribute('data-subcat');
      if (onSubCatChange) onSubCatChange(sub);
    });
  });

  const sortSelect = document.getElementById('sort-order-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      if (onSortChange) onSortChange(e.target.value);
    });
  }

  const clearSearchBtn = document.getElementById('clear-search-btn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (onClearSearch) onClearSearch();
    });
  }
}
