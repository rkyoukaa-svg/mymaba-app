import { SURABAYA_TIPS } from '../data/mockData.js';

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand-logo" style="margin-bottom:1.2rem;">
              <div class="brand-emblem">
                <i data-lucide="compass" style="width:24px; height:24px;"></i>
              </div>
              <div>
                <div class="brand-title" style="color:#FFF;">My<span>Maba</span></div>
                <div class="brand-subtitle" style="color:var(--gold-accent);">Platform Mahasiswa</div>
              </div>
            </div>

            <p style="font-size:0.88rem; color:#D4C7CB; line-height:1.6; max-width:340px; margin-bottom:1.5rem;">
              MyMaba adalah pusat informasi terkurasi yang menghubungkan mahasiswa baru di Surabaya dengan penyedia layanan Kos, Kuliner UMKM, Cafe Nugas, dan Kebutuhan Akademik.
            </p>

            <div class="badge-gold">
              <i data-lucide="heart" style="width:14px; height:14px; fill:currentColor;"></i>
              Dibuat Khusus Untuk Maba Surabaya
            </div>
          </div>

          <div class="footer-col">
            <h5>Kategori Informasi</h5>
            <ul class="footer-links">
              <li><a href="#">Hunian & Kos Dekat Kampus</a></li>
              <li><a href="#">Kuliner & Warung Murah</a></li>
              <li><a href="#">Cafe & Tempat Nugas 24h</a></li>
              <li><a href="#">Percetakan & Laundry Kilat</a></li>
              <li><a href="#">Marketplace</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h5>Tips Mahasiswa Surabaya</h5>
            <ul class="footer-links">
              ${SURABAYA_TIPS.map(tip => `
                <li style="margin-bottom:0.8rem;">
                  <strong style="color:var(--gold-accent); display:block; font-size:0.85rem;">${tip.title}</strong>
                  <span style="font-size:0.78rem; color:#D4C7CB;">${tip.desc}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="footer-col">
            <h5>Untuk Pemilik Bisnis</h5>
            <p style="font-size:0.85rem; color:#D4C7CB; margin-bottom:1.2rem;">
              Punya bisnis Kos, Cafe, Laundry, atau Warung di Surabaya? Promosikan usaha anda langsung ke ribuan maba.
            </p>
            <button class="btn btn-gold" id="footer-partner-btn" style="width:100%; font-size:0.85rem;">
              <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
              <span>Daftarkan Bisnis Gratis</span>
            </button>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 MyMaba Surabaya — Platform Penghubung & Pusat Informasi Kebutuhan Mahasiswa.</p>
          <div style="display:flex; gap:1.5rem;">
            <a href="#" style="color:#9E8E93; text-decoration:none;">Syarat & Ketentuan</a>
            <a href="#" style="color:#9E8E93; text-decoration:none;">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function initFooterEvents(onOpenPartnerModal) {
  const partnerBtn = document.getElementById('footer-partner-btn');
  if (partnerBtn && onOpenPartnerModal) {
    partnerBtn.addEventListener('click', onOpenPartnerModal);
  }
}
