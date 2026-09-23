import './style.css';
import { MOCK_PLACES } from './data/mockData.js';
import { getSelectedCampus, getPartnerListings, getMarketplaceItems, toggleBookmark, getTheme, getSystemSettings } from './utils/storage.js';

import { renderNavbar, initNavbarEvents } from './components/Navbar.js';
import { renderHero, initHeroEvents } from './components/Hero.js';
import { renderCategoryNav, initCategoryNavEvents } from './components/CategoryNav.js';
import { renderFilterBar, initFilterBarEvents } from './components/FilterBar.js';
import { renderListingCard } from './components/ListingCard.js';
import { renderListingModal, initListingModalEvents } from './components/ListingModal.js';
import { renderPartnerModal, initPartnerModalEvents } from './components/PartnerModal.js';
import { renderBookmarkDrawer, initBookmarkDrawerEvents } from './components/BookmarkDrawer.js';
import { renderLoginModal, initLoginModalEvents } from './components/LoginModal.js';
import { renderAdminPanelModal, initAdminPanelEvents } from './components/AdminPanelModal.js';
import { renderSellItemModal, initSellItemModalEvents } from './components/SellItemModal.js';
import { renderWelcomeModal, initWelcomeModalEvents } from './components/WelcomeModal.js';
import { renderFooter, initFooterEvents } from './components/Footer.js';
import { createRealtimeClient } from './utils/realtime.js';
import { createSupabaseRealtimeClient } from './utils/supabaseRealtime.js';

// Application State
const state = {
  campusId: getSelectedCampus(),
  categoryId: 'all',
  subCat: null,
  searchQuery: '',
  sortOrder: 'popular',
  activeDetailPlace: null,
  showPartnerModal: false,
  showBookmarksDrawer: false,
  showLoginModal: false,
  showAdminPanel: false,
  showSellItemModal: false,
  showWelcomeModal: !localStorage.getItem('mymaba_welcome_dismissed'),
  adminTab: 'overview',
  adminSearch: '',
  adminFilterAction: 'all',
  toastMessage: null,
  toastType: 'success'
};

// Initialize Document Theme
document.documentElement.setAttribute('data-theme', getTheme());

// One shared realtime connection for the application.
const realtimeOptions = {
  onStatus: (status) => {
    window.dispatchEvent(new CustomEvent('mymaba:realtime-status', { detail: status }));
  },
  onMessage: (message) => {
    window.dispatchEvent(new CustomEvent('mymaba:realtime-message', { detail: message }));
  },
  onError: (error) => {
    console.warn('Realtime connection error:', error);
  }
};

const supabaseRealtime = createSupabaseRealtimeClient(realtimeOptions);
const realtime = supabaseRealtime.isEnabled()
  ? supabaseRealtime
  : createRealtimeClient(realtimeOptions);

window.mymabaRealtime = realtime;

function showToast(message, type = 'success') {
  state.toastMessage = message;
  state.toastType = type;
  renderApp();
  setTimeout(() => {
    state.toastMessage = null;
    renderApp();
  }, 4000);
}

function getAllPlaces() {
  const customPlaces = getPartnerListings();
  const customMarketplace = getMarketplaceItems();
  return [...customMarketplace, ...customPlaces, ...MOCK_PLACES];
}

function getFilteredPlaces() {
  let places = getAllPlaces();

  // 1. Campus Filter
  if (state.campusId !== 'all') {
    places = places.filter(p => p.campusId === state.campusId);
  }

  // 2. Category Filter
  if (state.categoryId !== 'all') {
    places = places.filter(p => p.category === state.categoryId);
  }

  // 3. SubCategory Filter
  if (state.subCat && !state.subCat.startsWith('Semua')) {
    places = places.filter(p => p.subCategory && p.subCategory.toLowerCase().includes(state.subCat.toLowerCase()));
  }

  // 4. Search Query Filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    places = places.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(q)) ||
      (p.sellerEmail && p.sellerEmail.toLowerCase().includes(q)) ||
      p.facilities.some(f => f.toLowerCase().includes(q))
    );
  }

  // 5. Sorting
  if (state.sortOrder === 'price-asc') {
    places.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (state.sortOrder === 'price-desc') {
    places.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    // Popular
    places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return places;
}

function renderApp() {
  const appContainer = document.getElementById('app');
  const filteredPlaces = getFilteredPlaces();
  const allPlaces = getAllPlaces();
  const sysSettings = getSystemSettings();

  appContainer.innerHTML = `
    <!-- Global Toast Notification Banner -->
    ${state.toastMessage ? `
      <div class="toast-notification ${state.toastType === 'error' ? 'toast-error' : 'toast-success'}" style="position:fixed; top:20px; right:20px; z-index:9999; display:flex; align-items:center; gap:0.75rem; background:${state.toastType === 'error' ? '#ef4444' : '#16a34a'}; color:white; padding:0.85rem 1.25rem; border-radius:var(--radius-md); box-shadow:0 10px 25px rgba(0,0,0,0.25); animation: fadeInDown 0.3s ease;">
        <i data-lucide="${state.toastType === 'error' ? 'alert-circle' : 'check-circle'}" style="width:20px; height:20px;"></i>
        <span style="font-weight:600; font-size:0.9rem;">${state.toastMessage}</span>
      </div>
    ` : ''}

    <!-- Developer Emergency Alert Broadcast Banner -->
    ${sysSettings.emergencyAlert && sysSettings.emergencyAlert.active ? `
      <div style="background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%); color: white; padding: 0.85rem 1.25rem; text-align: center; font-size: 0.92rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border-bottom: 2px solid #fde047; box-shadow: 0 4px 15px rgba(220,38,38,0.4); animation: pulse 2s infinite;">
        <i data-lucide="siren" style="width: 22px; height: 22px; color: #fde047; flex-shrink: 0;"></i>
        <div>
          <span style="background: #fde047; color: #7f1d1d; font-size: 0.7rem; font-weight: 900; padding: 0.15rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; text-transform: uppercase;">SIARAN DARURAT DEVELOPER</span>
          <strong style="color: #ffffff;">${sysSettings.emergencyAlert.title || 'PEMBERITAHUAN DARURAT SISTEM'}:</strong>
          <span>${sysSettings.emergencyAlert.message || 'Pemeliharaan mendesak sedang berlangsung.'}</span>
        </div>
      </div>
    ` : ''}

    <!-- Superadmin Global Announcement Banner -->
    ${sysSettings.announcementBanner && sysSettings.announcementBanner.active ? `
      <div style="background: linear-gradient(90deg, #e11d48 0%, #be123c 100%); color: white; padding: 0.6rem 1rem; text-align: center; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
        <i data-lucide="megaphone" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
        <span>${sysSettings.announcementBanner.text}</span>
      </div>
    ` : ''}

    <!-- Superadmin Maintenance Mode Alert -->
    ${sysSettings.maintenanceMode ? `
      <div style="background: #ef4444; color: white; padding: 0.75rem 1rem; text-align: center; font-size: 0.88rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
        <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
        <span>MODE PEMELIHARAAN AKTIF — ${sysSettings.maintenanceScheduleText || 'Beberapa fitur dibatasi oleh Pengelola System.'}</span>
      </div>
    ` : ''}


    ${renderNavbar(
      (newCampus) => { state.campusId = newCampus; renderApp(); },
      () => { state.showPartnerModal = true; renderApp(); },
      () => { state.showBookmarksDrawer = true; renderApp(); },
      () => { state.showLoginModal = true; renderApp(); },
      () => {
        showToast('Anda telah keluar dari sistem MyMaba.', 'info');
        renderApp();
      },
      () => { state.showAdminPanel = true; renderApp(); },
      () => { state.showSellItemModal = true; renderApp(); }
    )}

    ${renderHero(state.campusId)}

    ${renderCategoryNav(state.categoryId)}

    ${renderFilterBar(state.categoryId, state.subCat, state.sortOrder, state.searchQuery)}

    <!-- Main Listings Section -->
    <main class="container" style="min-height: 400px;">
      ${filteredPlaces.length === 0 ? `
        <div style="text-align:center; padding:4rem 1rem; background:var(--pure-white); border-radius:var(--radius-xl); border:1px solid var(--border-light); margin:2rem 0 4rem;">
          <div style="width:70px; height:70px; background:var(--primary-red-soft); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1.2rem; color:var(--primary-red);">
            <i data-lucide="search-x" style="width:36px; height:36px;"></i>
          </div>
          <h3 class="font-serif" style="font-size:1.6rem; font-weight:800; margin-bottom:0.4rem;">Tidak Ada Rekomendasi Ditemukan</h3>
          <p style="color:var(--text-muted); max-width:480px; margin:0 auto 1.5rem;">Coba sesuaikan kata kunci pencarian atau ganti pilihan kampus untuk menemukan barang/rekomendasi lainnya.</p>
          <button class="btn btn-primary" id="reset-all-filters-btn">
            <i data-lucide="refresh-cw" style="width:16px; height:16px;"></i>
            <span>Tampilkan Semua Rekomendasi</span>
          </button>
        </div>
      ` : `
        <div class="listings-grid">
          ${filteredPlaces.map(place => renderListingCard(place)).join('')}
        </div>
      `}
    </main>

    ${renderFooter()}

    <!-- Modals Overlay Container -->
    <div id="modal-portal">
      ${state.activeDetailPlace ? renderListingModal(state.activeDetailPlace) : ''}
      ${state.showPartnerModal ? renderPartnerModal() : ''}
      ${state.showBookmarksDrawer ? renderBookmarkDrawer(allPlaces) : ''}
      ${state.showLoginModal ? renderLoginModal() : ''}
      ${state.showAdminPanel ? renderAdminPanelModal(state.adminTab, state.adminSearch, state.adminFilterAction) : ''}
      ${state.showSellItemModal ? renderSellItemModal() : ''}
      ${state.showWelcomeModal ? renderWelcomeModal() : ''}
    </div>
  `;

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Attach Event Handlers
  initNavbarEvents(
    (newCampus) => { state.campusId = newCampus; renderApp(); },
    () => { state.showPartnerModal = true; renderApp(); },
    () => { state.showBookmarksDrawer = true; renderApp(); },
    () => { state.showLoginModal = true; renderApp(); },
    () => {
      showToast('Anda telah keluar dari akun MyMaba.', 'success');
      renderApp();
    },
    () => { state.showAdminPanel = true; renderApp(); },
    () => { state.showSellItemModal = true; renderApp(); }
  );

  initHeroEvents(
    (query) => { state.searchQuery = query; renderApp(); },
    (priorityCategory) => { 
      state.categoryId = priorityCategory; 
      state.subCat = null;
      renderApp();
      // Scroll smoothly to catalog
      document.querySelector('.categories-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  );

  initCategoryNavEvents((newCat) => {
    state.categoryId = newCat;
    state.subCat = null;
    renderApp();
  });

  initFilterBarEvents(
    (newSubCat) => { state.subCat = newSubCat; renderApp(); },
    (newSort) => { state.sortOrder = newSort; renderApp(); },
    () => { state.searchQuery = ''; renderApp(); }
  );

  // Listing Cards click triggers (Bookmark & Detail modal)
  document.querySelectorAll('.card-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const placeId = btn.getAttribute('data-bookmark-id');
      toggleBookmark(placeId);
      renderApp();
    });
  });

  document.querySelectorAll('.card-detail-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const placeId = btn.getAttribute('data-detail-id');
      const target = allPlaces.find(p => p.id === placeId);
      if (target) {
        state.activeDetailPlace = target;
        renderApp();
      }
    });
  });

  const resetFiltersBtn = document.getElementById('reset-all-filters-btn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      state.campusId = 'all';
      state.categoryId = 'all';
      state.subCat = null;
      state.searchQuery = '';
      renderApp();
    });
  }

  // Init Modals Event Listeners
  if (state.activeDetailPlace) {
    initListingModalEvents(() => {
      state.activeDetailPlace = null;
      renderApp();
    });
  }

  if (state.showPartnerModal) {
    initPartnerModalEvents(
      () => {
        state.showPartnerModal = false;
        renderApp();
      },
      () => {
        state.showPartnerModal = false;
        renderApp();
      }
    );
  }

  if (state.showBookmarksDrawer) {
    initBookmarkDrawerEvents(
      () => renderApp(),
      () => {
        state.showBookmarksDrawer = false;
        renderApp();
      }
    );
  }

  if (state.showLoginModal) {
    initLoginModalEvents(
      (user) => {
        state.showLoginModal = false;
        showToast(`🎉 Login Berhasil! Selamat datang kembali, ${user.name}!`, 'success');
        renderApp();
      },
      () => {
        state.showLoginModal = false;
        renderApp();
      }
    );
  }

  if (state.showAdminPanel) {
    initAdminPanelEvents(
      () => {
        state.showAdminPanel = false;
        renderApp();
      },
      (tab, search, filterAction) => {
        state.adminTab = tab;
        state.adminSearch = search;
        state.adminFilterAction = filterAction;
        renderApp();
      }
    );
  }

  if (state.showSellItemModal) {
    initSellItemModalEvents(
      (newItem) => {
        state.showSellItemModal = false;
        state.categoryId = 'jual-beli';
        showToast(`🎉 Berhasil memposting iklan: "${newItem.title}"!`, 'success');
        renderApp();
      },
      () => {
        state.showSellItemModal = false;
        renderApp();
      }
    );
  }

  if (state.showWelcomeModal) {
    initWelcomeModalEvents(() => {
      state.showWelcomeModal = false;
      renderApp();
    });
  }

  initFooterEvents(() => {
    state.showPartnerModal = true;
    renderApp();
  });
}

// Initial App Boot
renderApp();
