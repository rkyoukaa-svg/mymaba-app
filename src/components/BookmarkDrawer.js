import { getBookmarks, toggleBookmark } from '../utils/storage.js';

export function renderBookmarkDrawer(allPlaces) {
  const bookmarkIds = getBookmarks();
  const bookmarkedPlaces = allPlaces.filter(p => bookmarkIds.includes(p.id));

  return `
    <div class="modal-overlay active" id="bookmarks-drawer-modal">
      <div class="modal-container" style="max-width:550px; margin-left:auto; border-radius:var(--radius-lg) 0 0 var(--radius-lg); height:100vh; max-height:100vh;">
        <div style="padding:1.5rem; border-bottom:1px solid var(--border-light); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div class="brand-emblem" style="width:34px; height:34px;">
              <i data-lucide="bookmark" style="width:18px; height:18px;"></i>
            </div>
            <h3 class="font-serif" style="font-size:1.3rem; font-weight:800;">Kebutuhan Tersimpan</h3>
          </div>

          <button class="modal-close-btn" id="close-bookmarks-btn" style="position:static;">
            <i data-lucide="x" style="width:18px; height:18px;"></i>
          </button>
        </div>

        <div style="padding:1.5rem; overflow-y:auto; height:calc(100vh - 90px);">
          ${bookmarkedPlaces.length === 0 ? `
            <div style="text-align:center; padding:3rem 1rem;">
              <div style="width:64px; height:64px; background:var(--primary-red-soft); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; color:var(--primary-red);">
                <i data-lucide="bookmark-x" style="width:32px; height:32px;"></i>
              </div>
              <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:0.4rem;">Belum Ada Tempat Tersimpan</h4>
              <p style="font-size:0.85rem; color:var(--text-muted);">Klik ikon bookmark pada kartu kos, warung, atau tempat nugas untuk menyimpannya di sini.</p>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${bookmarkedPlaces.map(p => {
                const formattedPrice = typeof p.price === 'number' 
                  ? `Rp ${p.price.toLocaleString('id-ID')}` 
                  : p.price;
                return `
                  <div style="display:flex; gap:1rem; background:var(--off-white); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--border-light); align-items:center;">
                    <img src="${p.image}" alt="${p.title}" style="width:80px; height:80px; object-fit:cover; border-radius:10px;" />
                    <div style="flex:1;">
                      <h4 style="font-size:0.95rem; font-weight:700; line-height:1.3;">${p.title}</h4>
                      <span style="font-size:0.75rem; color:var(--primary-red); font-weight:700; display:block; margin-top:2px;">${p.campusDistance}</span>
                      <strong style="font-size:0.88rem; color:var(--text-primary); display:block; margin-top:4px;">${formattedPrice}</strong>
                    </div>
                    <button class="remove-bookmark-btn" data-remove-id="${p.id}" style="background:none; border:none; color:var(--text-muted); cursor:pointer; padding:6px;" title="Hapus">
                      <i data-lucide="trash-2" style="width:18px; height:18px;"></i>
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

export function initBookmarkDrawerEvents(onUpdate, onClose) {
  const closeBtn = document.getElementById('close-bookmarks-btn');
  const modalOverlay = document.getElementById('bookmarks-drawer-modal');

  if (closeBtn) closeBtn.addEventListener('click', () => { if (onClose) onClose(); });
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) if (onClose) onClose();
    });
  }

  document.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove-id');
      toggleBookmark(id);
      if (onUpdate) onUpdate();
    });
  });
}
