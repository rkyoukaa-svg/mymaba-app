export function renderWelcomeModal() {
  return `
    <div class="modal-overlay active" id="welcome-popup-modal" style="z-index: 1100;">
      <div class="modal-container welcome-modal-box" style="max-width: 520px; border-radius: var(--radius-lg); overflow: hidden; background: var(--pure-white); border: 1px solid var(--border-gold);">
        
        <!-- Header -->
        <div class="popup-anim-1" style="background: var(--red-gradient); padding: 2rem 2rem 1.6rem; text-align: center; color: white; border-bottom: 3px solid var(--gold-accent); position: relative;">
          <button class="modal-close-btn animated-close-btn" id="close-welcome-modal-btn" style="background: rgba(255,255,255,0.2); color: white;" title="Tutup">
            <i data-lucide="x" style="width:18px; height:18px;"></i>
          </button>

          <div class="badge-gold" style="margin-bottom: 0.75rem; background: rgba(255,255,255,0.2); color: #ffffff; border-color: rgba(255,255,255,0.4);">
            <i data-lucide="compass" style="width:14px; height:14px;"></i>
            Platform Mahasiswa Surabaya
          </div>

          <h2 class="font-serif" style="font-size: 1.75rem; font-weight: 800; line-height: 1.25; margin: 0;">
            Selamat Datang di Web MyMaba
          </h2>
          
          <p style="font-size: 0.9rem; opacity: 0.95; margin-top: 0.4rem; font-weight: 500;">
            Selamat mencari kebutuhan Anda di web ini
          </p>
        </div>

        <!-- Body Content -->
        <div style="padding: 1.6rem 1.8rem; background: var(--pure-white);">
          
          <!-- Features Grid Highlights -->
          <div class="popup-anim-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div class="feature-pop-card">
              <div style="color: var(--primary-red);"><i data-lucide="home" style="width: 18px; height: 18px;"></i></div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">Hunian & Kos Maba</div>
            </div>

            <div class="feature-pop-card">
              <div style="color: var(--primary-red);"><i data-lucide="utensils" style="width: 18px; height: 18px;"></i></div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">Kuliner & UMKM Cheap Eats</div>
            </div>

            <div class="feature-pop-card">
              <div style="color: var(--primary-red);"><i data-lucide="coffee" style="width: 18px; height: 18px;"></i></div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">Cafe Nugas 24 Jam</div>
            </div>

            <div class="feature-pop-card">
              <div style="color: #10b981;"><i data-lucide="shopping-bag" style="width: 18px; height: 18px;"></i></div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary);">Marketplace</div>
            </div>
          </div>

          <!-- 18+ Warning Notice Card -->
          <div class="popup-anim-3 warning-notice-box" style="background: var(--primary-red-soft); border: 1px solid var(--primary-red); border-radius: var(--radius-md); padding: 0.9rem 1rem; margin-bottom: 1.25rem; text-align: left;">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--primary-red-dark); font-weight: 800; font-size: 0.85rem; margin-bottom: 0.35rem;">
              <i data-lucide="shield-alert" style="width: 18px; height: 18px; color: var(--primary-red); flex-shrink: 0;"></i>
              <span>ATURAN KESELAMATAN & LARANGAN BARANG 18+</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--primary-red-dark); line-height: 1.5; margin: 0;">
              <b>DILARANG KERAS</b> menjual barang yang berbau 18+ seperti <b>Minuman Keras (Alkohol)</b>, <b>Rokok / Vape / Liquid</b>, dan <b>Senjata Tajam</b> di platform MyMaba. Pelanggaran akan berakibat pemblokiran akun permanen.
            </p>
          </div>

          <!-- Action Button -->
          <div class="popup-anim-4">
            <button class="btn btn-primary" id="start-explore-btn" style="width: 100%; padding: 0.8rem; font-size: 0.95rem; justify-content: center;">
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              <span>Mulai Jelajahi Kebutuhan Maba</span>
            </button>
          </div>

          <div class="popup-anim-5" style="margin-top: 0.9rem; font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            <input type="checkbox" id="dont-show-again-checkbox" style="accent-color: var(--primary-red); cursor: pointer;" />
            <label for="dont-show-again-checkbox" style="cursor: pointer; user-select: none;">Jangan tampilkan pesan selamat datang ini lagi</label>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function initWelcomeModalEvents(onClose) {
  const modalOverlay = document.getElementById('welcome-popup-modal');
  const closeBtn = document.getElementById('close-welcome-modal-btn');
  const startBtn = document.getElementById('start-explore-btn');
  const checkbox = document.getElementById('dont-show-again-checkbox');

  let isClosing = false;

  const handleClose = () => {
    if (isClosing) return;
    isClosing = true;

    if (checkbox && checkbox.checked) {
      localStorage.setItem('mymaba_welcome_dismissed', 'true');
    }

    if (modalOverlay) {
      modalOverlay.classList.add('closing');
      setTimeout(() => {
        if (onClose) onClose();
      }, 260);
    } else {
      if (onClose) onClose();
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (startBtn) startBtn.addEventListener('click', handleClose);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) handleClose();
    });
  }
}

