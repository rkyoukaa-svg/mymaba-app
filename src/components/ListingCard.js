import { isBookmarked } from '../utils/storage.js';

export function renderListingCard(place) {
  const saved = isBookmarked(place.id);
  const formattedPrice = typeof place.price === 'number' 
    ? `Rp ${place.price.toLocaleString('id-ID')}` 
    : place.price;

  return `
    <article class="place-card" data-place-id="${place.id}">
      <div class="card-img-wrapper">
        <img src="${place.image}" alt="${place.title}" loading="lazy" />
        
        <div class="card-badge-container">
          ${place.category === 'jual-beli' ? `
            <span class="badge-gold" style="background: #10b981; color: white; border-color: #059669;">
              <i data-lucide="shopping-bag" style="width:12px; height:12px;"></i>
              Jual Beli Mahasiswa
            </span>
          ` : (place.isVerified ? `
            <span class="badge-gold badge-shimmer">
              <i data-lucide="check-circle" style="width:12px; height:12px;"></i>
              Terverifikasi MyMaba
            </span>
          ` : '')}
          ${place.isPopular ? `
            <span class="badge-red">
              <i data-lucide="flame" class="pulse-flame" style="width:13px; height:13px;"></i>
              Paling Dicari Maba
            </span>
          ` : ''}
        </div>

        <button class="card-bookmark-btn ${saved ? 'saved bookmark-pop' : ''}" data-bookmark-id="${place.id}" title="Simpan Kebutuhan">
          <i data-lucide="bookmark" style="width:18px; height:18px; fill:${saved ? 'currentColor' : 'none'};"></i>
        </button>
      </div>

      <div class="card-content">
        <div class="card-campus-distance">
          <i data-lucide="navigation" style="width:14px; height:14px;"></i>
          <span>${place.campusDistance}</span>
        </div>

        <h3 class="card-title">${place.title}</h3>

        ${place.category === 'jual-beli' ? `
          <!-- Seller Info Box in Card -->
          <div style="background: var(--off-white); border: 1px solid var(--border-light); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;">
            <span style="font-size: 1.1rem;">${place.sellerAvatar || '👤'}</span>
            <div style="line-height: 1.25; overflow: hidden;">
              <div style="font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                Penjual: ${place.ownerName}
              </div>
              <div style="font-size: 0.72rem; color: var(--primary-red); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${place.sellerRole || place.sellerEmail || 'Mahasiswa'}
              </div>
            </div>
          </div>
        ` : `
          <div class="card-location">
            <i data-lucide="map-pin" style="width:13px; height:13px; color:var(--primary-red);"></i>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${place.address}</span>
          </div>
        `}

        <div class="card-facilities">
          ${place.facilities.slice(0, 3).map(f => `
            <span class="facility-chip">${f}</span>
          `).join('')}
          ${place.facilities.length > 3 ? `<span class="facility-chip">+${place.facilities.length - 3} lagi</span>` : ''}
        </div>

        <div class="card-footer">
          <div class="price-tag">
            <span class="price-amount">${formattedPrice}</span>
            <span class="price-unit">${place.priceUnit || ''}</span>
          </div>

          <button class="btn btn-outline card-detail-trigger-btn" data-detail-id="${place.id}" style="padding: 0.45rem 1rem; font-size: 0.82rem;">
            <span>${place.category === 'jual-beli' ? 'Detail & Kontak' : 'Lihat Detail'}</span>
            <i data-lucide="arrow-up-right" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}
