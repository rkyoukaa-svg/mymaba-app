export function renderListingModal(place) {
  if (!place) return '';

  const formattedPrice = typeof place.price === 'number' 
    ? `Rp ${place.price.toLocaleString('id-ID')}` 
    : place.price;

  const waMessage = encodeURIComponent(
    `Halo ${place.ownerName || 'Pemilik/Pengelola'}, saya melihat informasi "${place.title}" di platform MyMaba.\n\n` +
    `Saya mahasiswa baru Surabaya berminat menanyakan ketersediaan dan informasi lebih lanjut. Terima kasih!`
  );

  const waLink = `https://wa.me/${place.ownerPhone || '6281234567890'}?text=${waMessage}`;

  return `
    <div class="modal-overlay active" id="place-detail-modal">
      <div class="modal-container">
        <button class="modal-close-btn" id="close-detail-modal-btn">
          <i data-lucide="x" style="width:20px; height:20px;"></i>
        </button>

        <img src="${place.image}" alt="${place.title}" class="detail-hero-img" />

        <div class="detail-body">
          <div class="detail-header-group">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                <span class="badge-red">${place.subCategory || 'Kebutuhan Maba'}</span>
                ${place.isVerified ? '<span class="badge-gold"><i data-lucide="shield-check" style="width:14px; height:14px;"></i> Terverifikasi MyMaba</span>' : ''}
              </div>
              <h2 class="detail-title">${place.title}</h2>
              <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.25rem;">
                <i data-lucide="map-pin" style="width:14px; height:14px; color:var(--primary-red); display:inline;"></i>
                ${place.address}
              </p>
            </div>

            <div style="text-align:right;">
              <span class="price-amount" style="font-size:1.8rem;">${formattedPrice}</span>
              <span class="price-unit" style="display:block; font-size:0.85rem;">${place.priceUnit || ''}</span>
            </div>
          </div>

          <div class="spec-grid">
            <div class="spec-item">
              <div class="spec-icon">
                <i data-lucide="navigation" style="width:20px; height:20px;"></i>
              </div>
              <div>
                <span style="display:block; font-size:0.75rem; color:var(--text-muted); font-weight:700;">JARAK KAMPUS</span>
                <strong style="font-size:0.9rem;">${place.campusDistance}</strong>
              </div>
            </div>

            <div class="spec-item">
              <div class="spec-icon">
                <i data-lucide="star" style="width:20px; height:20px; color:#F39C12;"></i>
              </div>
              <div>
                <span style="display:block; font-size:0.75rem; color:var(--text-muted); font-weight:700;">RATING MAHASISWA</span>
                <strong style="font-size:0.9rem;">⭐ ${place.rating} / 5.0 (${place.reviewsCount} Ulasan)</strong>
              </div>
            </div>

            <div class="spec-item">
              <div class="spec-icon">
                <i data-lucide="user" style="width:20px; height:20px;"></i>
              </div>
              <div>
                <span style="display:block; font-size:0.75rem; color:var(--text-muted); font-weight:700;">KONTAK PEMILIK</span>
                <strong style="font-size:0.9rem;">${place.ownerName || 'Pemilik Usaha'}</strong>
              </div>
            </div>
          </div>

          <div style="margin-bottom:2rem;">
            <h4 class="font-serif" style="font-size:1.2rem; font-weight:700; margin-bottom:0.75rem; color:var(--primary-red);">
              Deskripsi & Catatan Penting
            </h4>
            <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.7;">
              ${place.description}
            </p>
          </div>

          <div style="margin-bottom:2rem;">
            <h4 class="font-serif" style="font-size:1.2rem; font-weight:700; margin-bottom:0.85rem;">
              Fasilitas & Keunggulan Utama
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:0.75rem;">
              ${place.facilities.map(f => `
                <div style="display:flex; align-items:center; gap:0.5rem; background:var(--off-white); padding:0.6rem 0.9rem; border-radius:10px; font-size:0.88rem; font-weight:600;">
                  <i data-lucide="check-circle-2" style="width:16px; height:16px; color:var(--primary-red);"></i>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Maps Simulation Box -->
          <div style="background:var(--primary-red-soft); border:1px dashed var(--primary-red); padding:1.2rem; border-radius:var(--radius-md); margin-bottom:2rem; display:flex; align-items:center; justify-content:space-between;">
            <div>
              <strong style="display:block; font-size:0.95rem; color:var(--primary-red);">Navigasi Google Maps & Rute Kampus</strong>
              <span style="font-size:0.82rem; color:var(--text-secondary);">Klik untuk membuka lokasi persis di Google Maps Surabaya</span>
            </div>
            <a href="https://maps.google.com/?q=${encodeURIComponent(place.title + ' ' + place.address)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:0.4rem 1rem; font-size:0.8rem;">
              <i data-lucide="map" style="width:14px; height:14px;"></i>
              Buka Maps
            </a>
          </div>

          ${place.category === 'jual-beli' ? `
            <!-- Dedicated Seller Profile Card for Jual Beli -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%); border: 1.5px solid #10b981; padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
              <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #059669; letter-spacing: 0.5px; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
                Informasi & Identitas Penjual (Jual Beli Mahasiswa)
              </div>
              
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 54px; height: 54px; background: #ffffff; border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                    ${place.sellerAvatar || '🎓'}
                  </div>
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">${place.ownerName}</h3>
                    <div style="font-size: 0.85rem; color: var(--primary-red); font-weight: 700;">${place.sellerEmail || 'email@kampus.ac.id'}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${place.sellerRole || 'Mahasiswa'}</div>
                  </div>
                </div>

                <div style="background: #ffffff; padding: 0.6rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); font-size: 0.8rem;">
                  <div style="color: var(--text-muted);">Kondisi Barang:</div>
                  <strong style="color: #059669; font-size: 0.88rem;">${place.condition || 'Preloved Mulus'}</strong>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Direct WhatsApp Connector Callout Box -->
          <div class="wa-cta-box" style="${place.category === 'jual-beli' ? 'background: linear-gradient(135deg, #10b981 0%, #047857 100%);' : ''}">
            <div>
              <h4 style="font-size:1.15rem; font-weight:800; margin-bottom:0.2rem;">${place.category === 'jual-beli' ? 'Hubungi Penjual via WhatsApp' : 'Hubungi Pemilik Langsung'}</h4>
              <p style="font-size:0.85rem; opacity:0.9;">${place.category === 'jual-beli' ? 'Tanyakan barang, ajukan nego halus, atau atur janji COD dengan ' + place.ownerName + ' di kampus.' : 'MyMaba menjembatani kamu langsung dengan penyedia layanan via WhatsApp tanpa biaya perantara.'}</p>
            </div>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="wa-btn" style="${place.category === 'jual-beli' ? 'background: #ffffff; color: #047857;' : ''}">
              <i data-lucide="message-circle" style="width:20px; height:20px;"></i>
              <span>${place.category === 'jual-beli' ? 'Chat Penjual Sekarang' : 'Chat WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initListingModalEvents(onClose) {
  const closeBtn = document.getElementById('close-detail-modal-btn');
  const modalOverlay = document.getElementById('place-detail-modal');

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

  if (closeBtn) {
    closeBtn.classList.add('animated-close-btn');
    closeBtn.addEventListener('click', handleClose);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) handleClose();
    });
  }
}
