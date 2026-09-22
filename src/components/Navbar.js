import { CAMPUSES } from '../data/mockData.js';
import { getSelectedCampus, setSelectedCampus, getBookmarks, getTheme, setTheme, getAuthUser, logoutAuthUser, isDeveloperOrSuperadmin } from '../utils/storage.js';

export function renderNavbar(onCampusChange, onOpenPartnerModal, onOpenBookmarksModal, onOpenLoginModal, onLogout, onOpenAdminPanel, onOpenSellModal) {
  const currentCampusId = getSelectedCampus();
  const currentCampusObj = CAMPUSES.find(c => c.id === currentCampusId) || CAMPUSES[0];
  const bookmarksCount = getBookmarks().length;
  const currentTheme = getTheme();
  const authUser = getAuthUser();
  const isDevOrAdmin = isDeveloperOrSuperadmin(authUser);

  return `
    <header class="navbar">
      <div class="container navbar-inner">
        <a href="#" class="brand-logo" id="nav-brand-btn">
          <div class="brand-emblem">
            <i data-lucide="compass" style="width:24px; height:24px;"></i>
          </div>
          <div>
            <div class="brand-title">My<span>Maba</span></div>
            <div class="brand-subtitle">Platform Mahasiswa</div>
          </div>
        </a>

        <div class="nav-actions">
          <!-- Campus Dropdown Selector -->
          <div class="campus-select-wrapper">
            <button class="campus-select-btn" id="campus-dropdown-trigger">
              <i data-lucide="map-pin" style="width:16px; height:16px; color:var(--primary-red);"></i>
              <span id="selected-campus-label">${currentCampusObj.name}</span>
              <i data-lucide="chevron-down" style="width:14px; height:14px; margin-left:4px;"></i>
            </button>
            
            <div class="campus-dropdown" id="campus-dropdown-menu">
              <div style="padding: 0.5rem 0.85rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--off-white); margin-bottom: 0.4rem;">
                Pilih Kampus Kamu
              </div>
              ${CAMPUSES.map(c => `
                <div class="campus-option ${c.id === currentCampusId ? 'active' : ''}" data-campus-id="${c.id}">
                  <div>
                    <strong style="display:block; font-size:0.88rem;">${c.name}</strong>
                    <span style="font-size:0.75rem; opacity:0.8;">${c.subtitle}</span>
                  </div>
                  ${c.id === currentCampusId ? '<i data-lucide="check" style="width:16px; height:16px;"></i>' : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Theme Switcher -->
          <button class="btn-icon" id="theme-toggle-btn" title="Ganti Mode Tampilan">
            <i data-lucide="${currentTheme === 'dark' ? 'sun' : 'moon'}" style="width:18px; height:18px;"></i>
          </button>

          <!-- Bookmarks Drawer Trigger -->
          <button class="btn-icon" id="bookmarks-trigger-btn" title="Tempat Tersimpan">
            <i data-lucide="bookmark" style="width:18px; height:18px;"></i>
            ${bookmarksCount > 0 ? `<span class="badge-count">${bookmarksCount}</span>` : ''}
          </button>

          <!-- Admin / Monitoring Panel Trigger (Visible ONLY to Superadmin & Developer) -->
          ${isDevOrAdmin ? `
            <a href="/admin.html" class="btn-icon" id="admin-panel-trigger-btn" title="Control Panel Superadmin & Developer" style="background: rgba(225, 29, 72, 0.15); color: var(--primary-red); border: 1px solid var(--border-light); position: relative; text-decoration: none;">
              <i data-lucide="shield-alert" style="width:18px; height:18px;"></i>
              <span style="position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></span>
            </a>
          ` : ''}

          <!-- Sell Item / Marketplace CTA -->
          <button class="btn" id="sell-item-trigger-btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 0.55rem 1.1rem; font-size: 0.85rem; font-weight: 700; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">
            <i data-lucide="shopping-bag" style="width:16px; height:16px;"></i>
            <span>Jual Barang</span>
          </button>

          <!-- Register Business / Partner CTA -->
          <button class="btn btn-gold" id="partner-modal-btn" style="padding: 0.55rem 1.1rem; font-size: 0.85rem;">
            <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
            <span>Daftarkan Bisnis</span>
          </button>

          <!-- User Authentication Section -->
          ${authUser ? `
            <div class="user-profile-badge" style="display:flex; align-items:center; gap:0.5rem; background:var(--primary-red-soft); border:1px solid var(--border-light); padding:0.35rem 0.75rem; border-radius:50px;">
              <span style="font-size:1.1rem;">${authUser.avatar || '🎓'}</span>
              <div style="display:flex; flex-direction:column; line-height:1.2;">
                <span style="font-size:0.82rem; font-weight:700; color:var(--primary-red);">${authUser.name.split(' ')[0]}</span>
                <span style="font-size:0.68rem; color:var(--text-muted); font-weight:600;">${authUser.role ? authUser.role.split(' ')[0] : 'Member'}</span>
              </div>
              <button class="btn-icon" id="logout-btn" title="Keluar / Logout" style="width:28px; height:28px; background:rgba(255,255,255,0.7); margin-left:0.25rem;">
                <i data-lucide="log-out" style="width:14px; height:14px; color:var(--primary-red);"></i>
              </button>
            </div>
          ` : `
            <button class="btn btn-primary" id="open-login-btn" style="padding: 0.55rem 1.2rem; font-size: 0.85rem;">
              <i data-lucide="log-in" style="width:16px; height:16px;"></i>
              <span>Masuk</span>
            </button>
          `}
        </div>
      </div>
    </header>
  `;
}

export function initNavbarEvents(onCampusChange, onOpenPartnerModal, onOpenBookmarksModal, onOpenLoginModal, onLogout, onOpenAdminPanel, onOpenSellModal) {
  const dropdownTrigger = document.getElementById('campus-dropdown-trigger');
  const dropdownMenu = document.getElementById('campus-dropdown-menu');

  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });

    dropdownMenu.querySelectorAll('.campus-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        const campusId = opt.getAttribute('data-campus-id');
        setSelectedCampus(campusId);
        dropdownMenu.classList.remove('show');
        if (onCampusChange) onCampusChange(campusId);
      });
    });
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      if (onCampusChange) onCampusChange(getSelectedCampus());
    });
  }

  const sellBtn = document.getElementById('sell-item-trigger-btn');
  if (sellBtn && onOpenSellModal) {
    sellBtn.addEventListener('click', onOpenSellModal);
  }

  const adminPanelBtn = document.getElementById('admin-panel-trigger-btn');
  if (adminPanelBtn && onOpenAdminPanel) {
    adminPanelBtn.addEventListener('click', onOpenAdminPanel);
  }

  const partnerBtn = document.getElementById('partner-modal-btn');
  if (partnerBtn && onOpenPartnerModal) {
    partnerBtn.addEventListener('click', onOpenPartnerModal);
  }

  const bookmarkBtn = document.getElementById('bookmarks-trigger-btn');
  if (bookmarkBtn && onOpenBookmarksModal) {
    bookmarkBtn.addEventListener('click', onOpenBookmarksModal);
  }

  const openLoginBtn = document.getElementById('open-login-btn');
  if (openLoginBtn && onOpenLoginModal) {
    openLoginBtn.addEventListener('click', onOpenLoginModal);
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutAuthUser();
      if (onLogout) onLogout();
    });
  }
}
