import { CAMPUSES } from '../data/mockData.js';

export function renderHero(selectedCampusId) {
  const currentCampusObj = CAMPUSES.find(c => c.id === selectedCampusId) || CAMPUSES[0];

  return `
    <section class="hero">
      <div class="container hero-banner">
        <div>
          <div class="hero-tag">
            <i data-lucide="map-pin" style="width:15px; height:15px; color:var(--primary-red);"></i>
            <span>Platform Informasi Kampus Surabaya</span>
          </div>

          <h1 class="hero-title">
            Temukan Kos, Kuliner & Barang Bekas Kuliah <span class="gradient-text-red">Sekitar Kampus</span>.
          </h1>

          <p class="hero-description">
            Direktori terpadu untuk mahasiswa Surabaya. Cari hunian dekat kampus, rekomendasi tempat makan murah, cafe nugas 24 jam, hingga kebutuhan kuliah antar sesama mahasiswa.
          </p>

          <!-- Quick Search Bar -->
          <div class="hero-search-box">
            <div class="search-input-group">
              <i data-lucide="search" style="width:18px; height:18px; color:var(--text-muted);"></i>
              <input type="text" id="hero-search-input" placeholder="Cari kos putri, nasi bebek 12rb, cafe wifi, buku kuliah..." />
            </div>
            <button class="btn btn-primary" id="hero-search-btn">
              <span>Cari Rekomendasi</span>
              <i data-lucide="arrow-right" style="width:16px; height:16px;"></i>
            </button>
          </div>

          <div class="hero-stats">
            <div class="stat-item">
              <h4>150+</h4>
              <p>Kos Terdaftar</p>
            </div>
            <div class="stat-item" style="border-left:1px solid var(--border-light); padding-left:1.5rem;">
              <h4>80+</h4>
              <p>Kuliner & UMKM</p>
            </div>
            <div class="stat-item" style="border-left:1px solid var(--border-light); padding-left:1.5rem;">
              <h4>100%</h4>
              <p>Kontak WhatsApp Langsung</p>
            </div>
          </div>
        </div>

        <!-- Interactive Filter Widget -->
        <div class="wizard-card">
          <div class="wizard-header">
            <div class="wizard-badge">PENCARIAN CEPAT</div>
            <div>
              <h3 class="font-serif" style="font-size:1.15rem; font-weight:800;">Pilih Kategori Utama</h3>
              <p class="wizard-step-title">Temukan lokasi atau kebutuhan sesuai prioritas kamu</p>
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <div class="wizard-options-grid" id="wizard-priority-group">
              <button class="wizard-opt-btn active" data-wizard-priority="hunian">
                <span class="wizard-opt-title">Hunian & Kos</span>
                <span class="wizard-opt-sub">Kos putri/putra & kontrakan</span>
              </button>
              <button class="wizard-opt-btn" data-wizard-priority="kuliner">
                <span class="wizard-opt-title">Kuliner & UMKM</span>
                <span class="wizard-opt-sub">Makan murah dekat kampus</span>
              </button>
              <button class="wizard-opt-btn" data-wizard-priority="nongkrong">
                <span class="wizard-opt-title">Cafe Nugas 24 Jam</span>
                <span class="wizard-opt-sub">WiFi kencang & colokan</span>
              </button>
              <button class="wizard-opt-btn" data-wizard-priority="jual-beli">
                <span class="wizard-opt-title">Marketplace</span>
                <span class="wizard-opt-sub">Buku, gadget & peralatan kos</span>
              </button>
            </div>
          </div>

          <button class="btn btn-primary" id="wizard-apply-btn" style="width:100%; justify-content:center;">
            <i data-lucide="filter" style="width:16px; height:16px;"></i>
            <span>Tampilkan Pilihan Kampus</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

export function initHeroEvents(onSearchSubmit, onWizardApply) {
  const searchInput = document.getElementById('hero-search-input');
  const searchBtn = document.getElementById('hero-search-btn');

  if (searchBtn && searchInput) {
    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (onSearchSubmit) onSearchSubmit(query);
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // Wizard option buttons selection state
  const priorityBtns = document.querySelectorAll('#wizard-priority-group .wizard-opt-btn');
  let selectedPriority = 'hunian';

  priorityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      priorityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPriority = btn.getAttribute('data-wizard-priority');
    });
  });

  const wizardApplyBtn = document.getElementById('wizard-apply-btn');
  if (wizardApplyBtn && onWizardApply) {
    wizardApplyBtn.addEventListener('click', () => {
      onWizardApply(selectedPriority);
    });
  }
}
