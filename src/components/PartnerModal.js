import { CAMPUSES, CATEGORIES } from '../data/mockData.js';
import { addPartnerListing } from '../utils/storage.js';

export function renderPartnerModal() {
  return `
    <div class="modal-overlay active" id="partner-registration-modal">
      <div class="modal-container" style="max-width:680px;">
        <button class="modal-close-btn animated-close-btn" id="close-partner-modal-btn">
          <i data-lucide="x" style="width:20px; height:20px;"></i>
        </button>

        <div class="popup-anim-1" style="background:var(--red-gradient); padding:2.5rem 2rem 2rem; color:white; border-bottom:2px solid var(--gold-accent);">
          <div class="badge-gold sparkle-badge" style="margin-bottom:0.75rem;">
            <i data-lucide="building" style="width:14px; height:14px;"></i>
            Mitra Business MyMaba
          </div>
          <h2 class="font-serif" style="font-size:2rem; font-weight:800; line-height:1.2;">
            Daftarkan Bisnis / Layanan Anda
          </h2>
          <p style="font-size:0.9rem; opacity:0.9; margin-top:0.4rem;">
            Jangkau ribuan Mahasiswa Baru (Maba) di berbagai Universitas Surabaya secara gratis & cepat.
          </p>
        </div>

        <form id="partner-form" style="padding:2rem;">
          <div class="form-group">
            <label class="form-label">Nama Bisnis / Layanan / Kos *</label>
            <input type="text" id="p-title" class="form-control" placeholder="Contoh: Kos Putri Royal Kertajaya / Warung Nasi Bebek Mas Sayudi" required />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Kategori *</label>
              <select id="p-category" class="form-control" required>
                <option value="hunian">Hunian & Kos</option>
                <option value="kuliner">Kuliner & UMKM</option>
                <option value="nongkrong">Nongkrong & Tempat Nugas</option>
                <option value="kebutuhan">Kebutuhan Harian (Laundry/Print)</option>
                <option value="lainnya">Services / Sewa Motor</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Sub-Kategori / Tipe</label>
              <input type="text" id="p-subcategory" class="form-control" placeholder="Contoh: Kos Putri AC / Warung Murah / Percetakan 24h" required />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Kampus Terdekat *</label>
              <select id="p-campus" class="form-control" required>
                ${CAMPUSES.filter(c => c.id !== 'all').map(c => `
                  <option value="${c.id}">${c.name}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Jarak Dari Kampus *</label>
              <input type="text" id="p-distance" class="form-control" placeholder="Contoh: 200m dari Kampus B UNAIR / 5 menit dari ITS" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Lengkap Surabaya *</label>
            <input type="text" id="p-address" class="form-control" placeholder="Jl. Gubeng Kertajaya No. 12, Surabaya" required />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Harga (Nominal Rp) *</label>
              <input type="number" id="p-price" class="form-control" placeholder="1200000" required />
            </div>

            <div class="form-group">
              <label class="form-label">Satuan Harga *</label>
              <input type="text" id="p-price-unit" class="form-control" placeholder="/ bulan atau / porsi" required />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div class="form-group">
              <label class="form-label">Nama Pemilik / Pengelola *</label>
              <input type="text" id="p-owner-name" class="form-control" placeholder="Ibu Rahmawati" required />
            </div>

            <div class="form-group">
              <label class="form-label">Nomor WhatsApp Aktif *</label>
              <input type="text" id="p-owner-phone" class="form-control" placeholder="6281234567890 (awali dengan 62)" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Fasilitas Utama (Pisahkan dengan koma) *</label>
            <input type="text" id="p-facilities" class="form-control" placeholder="Free Wi-Fi 100Mbps, AC, Kamar Mandi Dalam, Parkir Motor, Dapur Bersama" required />
          </div>

          <div class="form-group">
            <label class="form-label">Deskripsi Lengkap *</label>
            <textarea id="p-description" class="form-control" rows="3" placeholder="Jelaskan keunggulan tempat anda, peraturan, jam buka, dll." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">URL Foto / Gambar (Opsional)</label>
            <input type="url" id="p-image" class="form-control" placeholder="https://images.unsplash.com/..." />
          </div>

          <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:1rem;">
            <button type="button" class="btn btn-outline" id="cancel-partner-form-btn">Batal</button>
            <button type="submit" class="btn btn-primary shiny-btn">
              <i data-lucide="check" style="width:18px; height:18px;"></i>
              <span>Daftarkan Bisnis Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initPartnerModalEvents(onSuccess, onClose) {
  const closeBtn = document.getElementById('close-partner-modal-btn');
  const cancelBtn = document.getElementById('cancel-partner-form-btn');
  const form = document.getElementById('partner-form');
  const modalOverlay = document.getElementById('partner-registration-modal');

  let isClosing = false;

  const handleClose = () => {
    if (isClosing) return;
    isClosing = true;

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
  if (cancelBtn) cancelBtn.addEventListener('click', handleClose);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) handleClose();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const facilitiesInput = document.getElementById('p-facilities').value;
      const facilitiesArr = facilitiesInput ? facilitiesInput.split(',').map(s => s.trim()) : ['Wi-Fi', 'Strategis'];

      const newListing = {
        title: document.getElementById('p-title').value,
        category: document.getElementById('p-category').value,
        subCategory: document.getElementById('p-subcategory').value,
        campusId: document.getElementById('p-campus').value,
        campusDistance: document.getElementById('p-distance').value,
        address: document.getElementById('p-address').value,
        price: parseInt(document.getElementById('p-price').value) || 0,
        priceUnit: document.getElementById('p-price-unit').value,
        ownerName: document.getElementById('p-owner-name').value,
        ownerPhone: document.getElementById('p-owner-phone').value,
        facilities: facilitiesArr,
        description: document.getElementById('p-description').value,
        image: document.getElementById('p-image').value || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
      };

      addPartnerListing(newListing);

      alert('🎉 Selamat! Bisnis Anda berhasil didaftarkan di MyMaba Surabaya dan kini langsung tampil di katalog rekomendasi.');
      
      if (onSuccess) onSuccess();
    });
  }
}
