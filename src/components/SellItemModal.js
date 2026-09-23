import { getAuthUser, addMarketplaceItem, logActivity } from '../utils/storage.js';

export function renderSellItemModal() {
  const authUser = getAuthUser();
  const defaultSellerName = authUser ? authUser.name : '';
  const defaultSellerEmail = authUser ? authUser.email : '';
  const defaultSellerRole = authUser ? authUser.role : 'Mahasiswa';

  return `
    <div class="modal-overlay active" id="sell-item-modal" style="z-index: 1040;">
      <div class="modal-container sell-modal-box" style="max-width: 580px; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--card-shadow-hover); background: var(--pure-white);">
        
        <!-- Header -->
        <div class="popup-anim-1" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); padding: 1.8rem 2rem 1.6rem; color: white; border-bottom: 2px solid var(--gold-accent); position: relative;">
          <button class="modal-close-btn animated-close-btn" id="close-sell-modal-btn" style="background: rgba(255,255,255,0.18); color: white;" title="Tutup">
            <i data-lucide="x" style="width:20px; height:20px;"></i>
          </button>

          <div class="badge-gold" style="margin-bottom: 0.5rem; background: rgba(255,255,255,0.2); color: #ffffff; border-color: rgba(255,255,255,0.4);">
            <i data-lucide="shopping-bag" style="width:14px; height:14px;"></i>
            Marketplace Mahasiswa
          </div>
          <h2 class="font-serif" style="font-size: 1.75rem; font-weight: 800; line-height: 1.2; margin: 0;">
            Jual Barang / Pasang Iklan
          </h2>
          <p style="font-size: 0.86rem; opacity: 0.95; margin-top: 0.3rem;">
            Tawarkan buku bekas, peralatan kos, atau gadget kamu ke sesama mahasiswa.
          </p>
        </div>

        <!-- Form Body -->
        <div style="padding: 1.8rem 2rem 2rem; max-height: 75vh; overflow-y: auto;">
          
          <form id="sell-item-form">
            
            <!-- Seller Identity Banner -->
            <div style="background: var(--off-white); border: 1px dashed var(--border-gold); padding: 0.9rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.4rem; display: flex; align-items: center; gap: 0.75rem;">
              <div style="font-size: 1.8rem;">${authUser ? authUser.avatar || '🎓' : '👤'}</div>
              <div style="flex: 1;">
                <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-primary);">
                  Identitas Penjual: ${defaultSellerName || 'Tamu / Pengunjung'}
                </div>
                <div style="font-size: 0.78rem; color: var(--primary-red); font-weight: 600;">
                  ${defaultSellerEmail ? defaultSellerEmail : 'Belum Login — Kredensial akan disimpan sesuai form'}
                </div>
                <div style="font-size: 0.74rem; color: var(--text-muted);">
                  ${defaultSellerRole}
                </div>
              </div>
            </div>

            <!-- Product Title -->
            <div class="form-group" style="margin-bottom: 1.1rem;">
              <label class="form-label" for="sell-title">Nama / Judul Barang *</label>
              <input 
                type="text" 
                id="sell-title" 
                class="form-control" 
                placeholder="Contoh: Buku Pemrograman Web & Algoritma (Mulus)" 
                required 
              />
            </div>

            <!-- SubCategory & Condition Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.1rem;">
              <div class="form-group">
                <label class="form-label" for="sell-subcategory">Kategori Barang *</label>
                <select id="sell-subcategory" class="form-control" required>
                  <option value="Buku & Akademik">Buku & Akademik</option>
                  <option value="Peralatan Kos">Peralatan Kos</option>
                  <option value="Gadget & Elektronik">Gadget & Elektronik</option>
                  <option value="Perlengkapan Kuliah">Perlengkapan Kuliah</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="sell-condition">Kondisi Barang *</label>
                <select id="sell-condition" class="form-control" required>
                  <option value="Bekas Bersejarah (Mulus 95%)">Bekas Bersejarah (Mulus 95%)</option>
                  <option value="Bekas Layak Pakai (80-90%)">Bekas Layak Pakai (80-90%)</option>
                  <option value="Baru / Segel (100%)">Baru / Segel (100%)</option>
                </select>
              </div>
            </div>

            <!-- Price & Location Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.1rem;">
              <div class="form-group">
                <label class="form-label" for="sell-price">Harga (Rp) *</label>
                <input 
                  type="number" 
                  id="sell-price" 
                  class="form-control" 
                  placeholder="50000" 
                  required 
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="sell-location">Lokasi COD / Kampus *</label>
                <input 
                  type="text" 
                  id="sell-location" 
                  class="form-control" 
                  placeholder="Contoh: COD Kampus Dinamika / Keputih ITS" 
                  required 
                />
              </div>
            </div>

            <!-- Seller Name & Email Fields (Auto-filled or Editable) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.1rem;">
              <div class="form-group">
                <label class="form-label" for="sell-seller-name">Nama Penjual *</label>
                <input 
                  type="text" 
                  id="sell-seller-name" 
                  class="form-control" 
                  value="${defaultSellerName}" 
                  placeholder="Nama Lengkap Penjual" 
                  required 
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="sell-seller-email">Email Penjual *</label>
                <input 
                  type="email" 
                  id="sell-seller-email" 
                  class="form-control" 
                  value="${defaultSellerEmail}" 
                  placeholder="email@kampus.ac.id" 
                  required 
                />
              </div>
            </div>

            <!-- WhatsApp Number -->
            <div class="form-group" style="margin-bottom: 1.1rem;">
              <label class="form-label" for="sell-phone">Nomor WhatsApp Aktif (Format 628...) *</label>
              <input 
                type="text" 
                id="sell-phone" 
                class="form-control" 
                placeholder="6281234567890" 
                required 
              />
            </div>

            <!-- Image URL -->
            <div class="form-group" style="margin-bottom: 1.1rem;">
              <label class="form-label" for="sell-image">Link Foto Barang (URL)</label>
              <input 
                type="url" 
                id="sell-image" 
                class="form-control" 
                placeholder="https://images.unsplash.com/..." 
                value="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
              />
            </div>

            <!-- Description -->
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label" for="sell-description">Deskripsi & Kelengkapan Barang *</label>
              <textarea 
                id="sell-description" 
                class="form-control" 
                rows="3" 
                placeholder="Jelaskan kondisi detail barang, garansi, atau bonus yang didapatkan buyer..." 
                required
              ></textarea>
            </div>

            <!-- 18+ Safety Warning Box -->
            <div class="warning-notice-box" style="background: var(--primary-red-soft); border: 1px solid var(--primary-red); padding: 0.9rem 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--primary-red-dark); font-weight: 800; font-size: 0.85rem; margin-bottom: 0.35rem;">
                <i data-lucide="shield-alert" style="width: 18px; height: 18px; color: var(--primary-red); flex-shrink: 0;"></i>
                <span>ATURAN KESELAMATAN & DILARANG MENJUAL BARANG 18+</span>
              </div>
              <p style="font-size: 0.78rem; color: var(--primary-red-dark); line-height: 1.45; margin: 0 0 0.5rem 0;">
                <b>DILARANG KERAS</b> menjual barang 18+ dan barang berbahaya seperti:
              </p>
              <ul style="font-size: 0.76rem; color: var(--primary-red-dark); padding-left: 1.2rem; margin: 0 0 0.6rem 0; line-height: 1.4;">
                <li>🚫 <b>Minuman Keras / Alkohol</b></li>
                <li>🚫 <b>Rokok / Vape / Liquid / Pods</b></li>
                <li>🚫 <b>Senjata Tajam / Senjata Api / Bahan Berbahaya</b></li>
              </ul>
              
                <label style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.78rem; color: var(--primary-red-dark); font-weight: 700; cursor: pointer; user-select: none;">
                <input type="checkbox" id="sell-compliance-checkbox" required style="accent-color: var(--primary-red); margin-top: 2px; cursor: pointer;" />
                <span>Saya berjanji barang yang saya jual TIDAK BERBAU 18+ (Tanpa Alkohol, Vape/Rokok & Senjata Tajam) serta legal.</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; justify-content: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <i data-lucide="check-circle-2" style="width: 18px; height: 18px;"></i>
              <span>Pasang Iklan Barang Sekarang</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  `;
}

export function initSellItemModalEvents(onSuccess, onClose) {
  const modalOverlay = document.getElementById('sell-item-modal');
  const closeBtn = document.getElementById('close-sell-modal-btn');
  const form = document.getElementById('sell-item-form');

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
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) handleClose();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const authUser = getAuthUser();
      const title = document.getElementById('sell-title').value.trim();
      const subCategory = document.getElementById('sell-subcategory').value;
      const condition = document.getElementById('sell-condition').value;
      const price = parseInt(document.getElementById('sell-price').value, 10) || 0;
      const campusDistance = document.getElementById('sell-location').value.trim();
      const ownerName = document.getElementById('sell-seller-name').value.trim();
      const sellerEmail = document.getElementById('sell-seller-email').value.trim();
      const ownerPhone = document.getElementById('sell-phone').value.trim();
      const image = document.getElementById('sell-image').value.trim();
      const description = document.getElementById('sell-description').value.trim();

      const newItem = addMarketplaceItem({
        title,
        subCategory,
        condition,
        price,
        campusId: 'all',
        campusDistance: `COD ${campusDistance}`,
        address: campusDistance,
        ownerName,
        sellerEmail,
        sellerRole: authUser ? authUser.role : 'Mahasiswa',
        sellerAvatar: authUser ? authUser.avatar : '🎓',
        ownerPhone,
        image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        facilities: ['Siap COD', 'Kondisi Sesuai Deskripsi', 'Nego Halus Accepted'],
        description
      });

      // Audit Log
      logActivity(
        sellerEmail,
        ownerName,
        authUser ? authUser.role : 'Mahasiswa',
        'SELL_ITEM',
        `Memposting barang jualan baru: "${title}" (Rp ${price.toLocaleString()})`,
        'success'
      );

      if (onSuccess) onSuccess(newItem);
    });
  }
}
