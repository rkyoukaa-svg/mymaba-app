import { 
  getActivityLogs, 
  getActiveSessions, 
  clearActivityLogs, 
  getAuthUser, 
  setAuthUser, 
  isDeveloper,
  getSystemSettings, 
  setSystemSettings, 
  getUsersList, 
  updateUserRole, 
  addNewUserRole,
  updateUserDetails,
  toggleUserStatus, 
  getPartnerListings, 
  getMarketplaceItems, 
  updateListingVerification, 
  deleteListingById,
  exportFullDatabase,
  restoreFullDatabase,
  resetFullDatabase,
  purgeSystemCache,
  getStorageDiagnostics,
  logActivity,
  MOCK_USERS 
} from '../utils/storage.js';

export function renderAdminPanelModal(activeTab = 'overview', searchQuery = '', filterAction = 'all') {
  const logs = getActivityLogs();
  const activeSessions = getActiveSessions();
  const currentUser = getAuthUser() || MOCK_USERS[0];
  const isDevUser = isDeveloper(currentUser);
  if (!isDevUser && activeTab === 'users') {
    activeTab = 'overview';
  }
  const settings = getSystemSettings();
  const usersList = getUsersList();
  const partnerListings = getPartnerListings();
  const marketplaceItems = getMarketplaceItems();
  const allListings = [...partnerListings, ...marketplaceItems];

  // Metrics Calculations
  const totalLogs = logs.length;
  const loginSuccessCount = logs.filter(l => l.action === 'LOGIN' && l.status === 'success').length;
  const loginFailedCount = logs.filter(l => l.action === 'LOGIN_FAILED' || l.status === 'warning').length;
  const totalActiveUsers = activeSessions.length;

  // Filter logs based on search and action filter
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return `
    <div class="modal-overlay active" id="admin-panel-modal" style="z-index: 1050; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px);">
      <div class="modal-container admin-panel-box" style="max-width: 1050px; width: 94%; max-height: 90vh; border-radius: var(--radius-xl); overflow: hidden; background: #0f172a; color: #f8fafc; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 1.25rem 1.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.85rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 44px; height: 44px; background: rgba(225, 29, 72, 0.2); border: 1px solid rgba(225, 29, 72, 0.5); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f43f5e;">
              <i data-lucide="shield-check" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h2 style="font-size: 1.35rem; font-weight: 800; color: #ffffff; margin: 0;">Panel Monitoring & Kontrol</h2>
                <span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 50px; display: inline-flex; align-items: center; gap: 0.45rem;">
                  <span class="live-beacon"></span> Live
                </span>
                ${isDevUser ? `<span style="background: rgba(59,130,246,0.3); color: #60a5fa; font-size: 0.7rem; font-weight: 800; padding: 0.1rem 0.5rem; border-radius: 4px;">🛠️ Developer Access</span>` : ''}
              </div>
              <p style="font-size: 0.82rem; color: #94a3b8; margin: 0.15rem 0 0 0;">
                Otoritas: <b style="color: #60a5fa;">${currentUser ? currentUser.name : 'Superadmin'}</b> (<span style="color: #f43f5e; font-weight: 700;">${currentUser ? currentUser.role : 'Superadmin'}</span>)
              </p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- DEVELOPER QUICK ROLE SWITCHER DROPDOWN -->
            <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); padding: 0.35rem 0.6rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.76rem; font-weight: 800; color: #facc15;">🛠️ Switch Role:</span>
              <select id="modal-developer-role-selector" style="background: #1e293b; color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.78rem; font-weight: 700; outline: none; cursor: pointer; max-width: 280px;">
                ${usersList.map(u => `
                  <option value="${u.email}" ${currentUser && currentUser.email.toLowerCase() === u.email.toLowerCase() ? 'selected' : ''}>
                    ${u.avatar || '👤'} ${u.name} (${u.email})
                  </option>
                `).join('')}
              </select>
            </div>

            <button id="close-admin-panel-btn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;" title="Tutup Panel">
              <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="background: #1e293b; padding: 0.5rem 1.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; gap: 0.5rem; overflow-x: auto;">
          <button class="admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'overview' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'overview' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="layout-dashboard" style="width: 16px; height: 16px;"></i>
            <span>Overview & Analytics</span>
          </button>

          <button class="admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'settings' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'settings' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="sliders" style="width: 16px; height: 16px;"></i>
            <span>Opsi Superadmin</span>
          </button>

          ${isDevUser ? `
            <button class="admin-tab-btn ${activeTab === 'users' ? 'active' : ''}" data-tab="users" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'users' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'users' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="user-check" style="width: 16px; height: 16px;"></i>
              <span>Kelola Users (${usersList.length})</span>
            </button>
          ` : ''}

          <button class="admin-tab-btn ${activeTab === 'moderation' ? 'active' : ''}" data-tab="moderation" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'moderation' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'moderation' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="file-check-2" style="width: 16px; height: 16px;"></i>
            <span>Moderasi (${allListings.length})</span>
          </button>
          
          <button class="admin-tab-btn ${activeTab === 'sessions' ? 'active' : ''}" data-tab="sessions" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'sessions' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'sessions' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="users" style="width: 16px; height: 16px;"></i>
            <span>Pengguna Aktif (${totalActiveUsers})</span>
          </button>

          <button class="admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}" data-tab="logs" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'logs' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'logs' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="list-checks" style="width: 16px; height: 16px;"></i>
            <span>Audit Log (${totalLogs})</span>
          </button>

          ${isDevUser ? `
            <button class="admin-tab-btn ${activeTab === 'devtools' ? 'active' : ''}" data-tab="devtools" style="padding: 0.75rem 1.2rem; font-size: 0.85rem; font-weight: 700; border: none; background: none; color: ${activeTab === 'devtools' ? '#f43f5e' : '#94a3b8'}; border-bottom: 3px solid ${activeTab === 'devtools' ? '#f43f5e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="terminal" style="width: 16px; height: 16px;"></i>
              <span>Developer Tools</span>
            </button>
          ` : ''}
        </div>

        <!-- Main Content Area -->
        <div style="flex: 1; overflow-y: auto; padding: 1.5rem 1.75rem; background: #0f172a;">
          
          ${activeTab === 'overview' ? `
            <!-- Overview & Metrics View -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              
              <div class="admin-metric-card" style="background: #1e293b; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.05s;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Sesi Aktif Online</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-top: 0.2rem;">${totalActiveUsers}</div>
                <div style="font-size: 0.75rem; color: #4ade80; margin-top: 0.2rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span class="live-beacon"></span> Terhubung real-time
                </div>
              </div>

              <div class="admin-metric-card" style="background: #1e293b; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.1s;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Total Listings</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-top: 0.2rem;">${allListings.length}</div>
                <div style="font-size: 0.75rem; color: #f43f5e; margin-top: 0.2rem;">Kos & Marketplace Items</div>
              </div>

              <div class="admin-metric-card" style="background: #1e293b; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.15s;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Login Berhasil</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-top: 0.2rem;">${loginSuccessCount}</div>
                <div style="font-size: 0.75rem; color: #60a5fa; margin-top: 0.2rem;">Sesi Mahasiswa & Admin</div>
              </div>

              <div class="admin-metric-card" style="background: #1e293b; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.2s;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Audit Event Logs</div>
                <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-top: 0.2rem;">${totalLogs}</div>
                <div style="font-size: 0.75rem; color: #facc15; margin-top: 0.2rem;">Tersimpan di database</div>
              </div>

            </div>

            <!-- Highlights -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem;">
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 0.85rem 0; color: #ffffff; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="activity" style="width: 16px; height: 16px; color: #f43f5e;"></i>
                <span>Aktivitas Pengguna Terbaru</span>
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                ${logs.slice(0, 4).map(log => `
                  <div class="admin-table-row" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0.85rem; background: #0f172a; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                    <div>
                      <div style="font-weight: 700; font-size: 0.88rem; color: #f8fafc;">${log.name} <span style="font-size: 0.78rem; color: #60a5fa; font-weight: normal;">(${log.email})</span></div>
                      <div style="font-size: 0.78rem; color: #94a3b8;">${log.details}</div>
                    </div>
                    <span style="font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 700; background: ${log.action === 'LOGIN' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}; color: ${log.action === 'LOGIN' ? '#4ade80' : '#60a5fa'};">
                      ${log.action}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${activeTab === 'settings' ? `
            <!-- SUPERADMIN CONTROL PANEL SETTINGS -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem;">
              <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 0.3rem 0; color: #ffffff;">Pengaturan & Kontrol Superadmin</h3>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 0 0 1.25rem 0;">Atur parameter pemeliharaan website, spanduk pengumuman, dan kebijakan posting.</p>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                
                <div style="background: #0f172a; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <h4 style="margin: 0; font-size: 0.92rem; color: #ffffff;">Mode Pemeliharaan Website (Maintenance Mode)</h4>
                    <p style="margin: 0.15rem 0 0 0; font-size: 0.78rem; color: #94a3b8;">Restriksi akses pengguna umum jika sistem dalam perbaikan.</p>
                  </div>
                  <button id="modal-toggle-maint-btn" style="padding: 0.5rem 1rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; border: none; cursor: pointer; background: ${settings.maintenanceMode ? '#ef4444' : '#22c55e'}; color: white;">
                    ${settings.maintenanceMode ? 'Matikan Maintenance' : 'Nyalakan Maintenance'}
                  </button>
                </div>

                <div style="background: #0f172a; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                    <h4 style="margin: 0; font-size: 0.92rem; color: #ffffff;">Spanduk Pengumuman Siaran Global</h4>
                    <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; color: #cbd5e1; cursor: pointer;">
                      <input type="checkbox" id="modal-announce-chk" ${settings.announcementBanner.active ? 'checked' : ''} />
                      Tampilkan Banner
                    </label>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <input 
                      type="text" 
                      id="modal-announce-input" 
                      value="${settings.announcementBanner.text}" 
                      placeholder="Isi pengumuman..."
                      style="flex: 1; padding: 0.55rem 0.75rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; color: white; font-size: 0.82rem;"
                    />
                    <button id="modal-save-announce-btn" style="background: #e11d48; color: white; border: none; padding: 0.55rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer;">
                      Simpan
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ` : ''}

          ${activeTab === 'users' ? `
            <!-- USER ROLE MANAGEMENT -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0; color: #ffffff;">Kelola Otoritas User & Role</h3>
                  <p style="font-size: 0.78rem; color: #94a3b8; margin: 0.15rem 0 0 0;">
                    ${isDevUser ? '🛠️ Hak Akses Developer Aktif (<b>lunar@dev.ac.id</b>) — Penambahan & Perubahan Role Diizinkan.' : '🔒 Penambahan & Perubahan Role hanya dapat diakses oleh Developer (<b>lunar@dev.ac.id</b>).'}
                  </p>
                </div>
              </div>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.76rem; text-transform: uppercase;">
                      <th style="padding: 0.6rem 0.85rem;">Pengguna</th>
                      <th style="padding: 0.6rem 0.85rem;">Email</th>
                      <th style="padding: 0.6rem 0.85rem;">Role saat Ini</th>
                      <th style="padding: 0.6rem 0.85rem;">Ubah Role (Dev Only)</th>
                      <th style="padding: 0.6rem 0.85rem;">Ubah Data (Dev Only)</th>
                      <th style="padding: 0.6rem 0.85rem;">Akses</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${usersList.map(u => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.7rem 0.85rem; font-weight: 700;">${u.avatar || '👤'} ${u.name}</td>
                        <td style="padding: 0.7rem 0.85rem; color: #60a5fa; font-family: monospace;">${u.email}</td>
                        <td style="padding: 0.7rem 0.85rem; color: #f43f5e; font-weight: 700;">${u.role}</td>
                        <td style="padding: 0.7rem 0.85rem;">
                          ${isDevUser ? `
                            <select class="modal-user-role-select" data-email="${u.email}" style="background: #0f172a; color: white; border: 1px solid rgba(59,130,246,0.4); border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.78rem;">
                              <option value="Developer" ${u.role.includes('Developer') ? 'selected' : ''}>🛠️ Developer</option>
                              <option value="Superadmin" ${u.role.includes('Superadmin') ? 'selected' : ''}>👑 Superadmin</option>
                              <option value="Mahasiswa (Universitas Dinamika)" ${u.role.includes('Dinamika') ? 'selected' : ''}>Mhs Dinamika</option>
                              <option value="Mahasiswa Baru (UNAIR)" ${u.role.includes('UNAIR') ? 'selected' : ''}>Mhs UNAIR</option>
                              <option value="Mahasiswa (ITS)" ${u.role.includes('ITS') ? 'selected' : ''}>Mhs ITS</option>
                            </select>
                          ` : `
                            <div style="font-size: 0.75rem; color: #64748b; display: flex; align-items: center; gap: 0.3rem;" title="Perubahan role dikunci untuk Developer (lunar@dev.ac.id)">
                              <i data-lucide="lock" style="width: 14px; height: 14px;"></i>
                              <span>Dikunci (Dev Only)</span>
                            </div>
                          `}
                        </td>
                        <td style="padding: 0.7rem 0.85rem;">
                          ${isDevUser ? `
                            <button class="modal-edit-user-btn" data-email="${u.email}" data-name="${u.name}" style="padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(59,130,246,0.4); background: rgba(59,130,246,0.2); color: #60a5fa; cursor: pointer;">
                              ✏️ Edit
                            </button>
                          ` : `
                            <span style="color: #64748b; font-size: 0.72rem;">🔒 Dikunci</span>
                          `}
                        </td>
                        <td style="padding: 0.7rem 0.85rem;">
                          <button class="modal-toggle-ban-btn" data-email="${u.email}" style="padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; background: ${u.isBanned ? '#ef4444' : 'rgba(34,197,94,0.2)'}; color: ${u.isBanned ? '#ffffff' : '#4ade80'};">
                            ${u.isBanned ? 'Banned' : 'Active'}
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${activeTab === 'moderation' ? `
            <!-- MODERATION -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 1rem 0; color: #ffffff;">Moderasi Listing Kos & Marketplace</h3>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.76rem;">
                      <th style="padding: 0.6rem 0.85rem;">Judul Listing</th>
                      <th style="padding: 0.6rem 0.85rem;">Harga</th>
                      <th style="padding: 0.6rem 0.85rem;">Status Verifikasi</th>
                      <th style="padding: 0.6rem 0.85rem;">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${allListings.length === 0 ? `
                      <tr><td colspan="4" style="text-align: center; padding: 1.5rem; color: #64748b;">Belum ada custom listing.</td></tr>
                    ` : allListings.map(item => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.7rem 0.85rem; font-weight: 700; color: white;">${item.title}</td>
                        <td style="padding: 0.7rem 0.85rem; color: #4ade80;">Rp ${(item.price || 0).toLocaleString('id-ID')}</td>
                        <td style="padding: 0.7rem 0.85rem;">
                          <button class="modal-verify-listing-btn" data-id="${item.id}" data-status="${item.isVerified}" style="padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; background: ${item.isVerified ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}; color: ${item.isVerified ? '#4ade80' : '#facc15'};">
                            ${item.isVerified ? '✓ Verified' : '⏳ Pending'}
                          </button>
                        </td>
                        <td style="padding: 0.7rem 0.85rem;">
                          <button class="modal-delete-listing-btn" data-id="${item.id}" style="padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; border: 1px solid #ef4444; background: rgba(239,68,68,0.15); color: #f87171; cursor: pointer;">
                            🗑️ Hapus
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${activeTab === 'sessions' ? `
            <!-- Active Sessions View -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem;">
              <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 1rem 0; color: #ffffff;">Pengguna Aktif Saat Ini (${activeSessions.length})</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem;">
                ${activeSessions.map(sess => `
                  <div style="background: #0f172a; padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="font-size: 1.8rem;">${sess.avatar || '🎓'}</div>
                      <div>
                        <div style="font-weight: 800; color: #ffffff;">${sess.name}</div>
                        <div style="font-size: 0.78rem; color: #f43f5e;">${sess.email}</div>
                        <div style="font-size: 0.72rem; color: #94a3b8;">${sess.role}</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${activeTab === 'logs' ? `
            <!-- Activity Audit Logs View -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.25rem;">
              <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                <div style="display: flex; gap: 0.5rem; flex: 1; min-width: 240px;">
                  <input 
                    type="text" 
                    id="admin-log-search-input" 
                    placeholder="Cari email/nama/aktivitas..." 
                    value="${searchQuery}"
                    style="flex: 1; padding: 0.55rem 0.75rem; background: #0f172a; border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-md); color: #ffffff; font-size: 0.82rem;"
                  />
                  <select id="admin-log-action-filter" style="padding: 0.55rem 0.75rem; background: #0f172a; border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-md); color: #ffffff; font-size: 0.82rem;">
                    <option value="all" ${filterAction === 'all' ? 'selected' : ''}>Semua Aksi</option>
                    <option value="LOGIN" ${filterAction === 'LOGIN' ? 'selected' : ''}>LOGIN</option>
                    <option value="LOGIN_FAILED" ${filterAction === 'LOGIN_FAILED' ? 'selected' : ''}>LOGIN GAGAL</option>
                  </select>
                </div>

                <button id="admin-clear-logs-btn" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 0.55rem 0.85rem; border-radius: var(--radius-md); font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                  Reset Log
                </button>
              </div>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.82rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.75rem;">
                      <th style="padding: 0.65rem 0.85rem;">Waktu</th>
                      <th style="padding: 0.65rem 0.85rem;">Pengguna</th>
                      <th style="padding: 0.65rem 0.85rem;">Aksi</th>
                      <th style="padding: 0.65rem 0.85rem;">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredLogs.map(log => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.7rem 0.85rem; color: #94a3b8;">${new Date(log.timestamp).toLocaleString([], {dateStyle:'short', timeStyle:'short'})}</td>
                        <td style="padding: 0.7rem 0.85rem;"><b>${log.name}</b><br><span style="color:#60a5fa; font-size:0.74rem;">${log.email}</span></td>
                        <td style="padding: 0.7rem 0.85rem;"><span style="font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: 4px; background: rgba(59,130,246,0.2); color: #60a5fa;">${log.action}</span></td>
                        <td style="padding: 0.7rem 0.85rem; color: #cbd5e1;">${log.details}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

            </div>
          ` : ''}

          ${isDevUser && activeTab === 'devtools' ? `
            <!-- Developer Control Tools in Modal -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              
              <!-- System Diagnostic & Purge -->
              <div style="background: #1e293b; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid rgba(59,130,246,0.3);">
                <h4 style="margin: 0 0 0.85rem 0; font-size: 1rem; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="activity" style="width: 18px; height: 18px; color: #60a5fa;"></i>
                  <span>Diagnostic Storage Radar</span>
                </h4>
                ${(() => {
                  const diag = getStorageDiagnostics();
                  return `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
                      <div style="background: #0f172a; padding: 0.75rem; border-radius: var(--radius-md);">
                        <div style="font-size: 0.72rem; color: #94a3b8;">Penggunaan Storage</div>
                        <div style="font-size: 1.2rem; font-weight: 800; color: #60a5fa;">${diag.kb} KB</div>
                      </div>
                      <div style="background: #0f172a; padding: 0.75rem; border-radius: var(--radius-md);">
                        <div style="font-size: 0.72rem; color: #94a3b8;">Items Terindeks</div>
                        <div style="font-size: 1.2rem; font-weight: 800; color: #4ade80;">${diag.itemsCount} Keys</div>
                      </div>
                    </div>
                  `;
                })()}
                <button id="modal-purge-cache-btn" style="background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #fbbf24; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
                  ⚡ Bersihkan Hard Cache Browser
                </button>
              </div>

              <!-- Database Backup & Restore -->
              <div style="background: #1e293b; padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 0.85rem;">
                <h4 style="margin: 0; font-size: 1rem; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="database" style="width: 18px; height: 18px; color: #facc15;"></i>
                  <span>Backup & Restore System</span>
                </h4>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                  <button id="modal-export-db-btn" style="background: rgba(59,130,246,0.2); border: 1px solid #3b82f6; color: #60a5fa; padding: 0.55rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
                    📥 Export JSON Dump
                  </button>
                  <button id="modal-reset-db-btn" style="background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #f87171; padding: 0.55rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
                    🔥 Factory Reset
                  </button>
                </div>
              </div>

            </div>
          ` : ''}

        </div>

        <!-- Footer Note -->
        <div style="background: #1e293b; padding: 0.85rem 1.75rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: #94a3b8;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="shield-check" style="width: 15px; height: 15px; color: #4ade80;"></i>
            <span>Sistem Pemantauan MyMaba • Superadmin & Developer Mode</span>
          </div>
          <button id="close-admin-panel-footer-btn" class="btn" style="background: #334155; color: #ffffff; border: none; padding: 0.4rem 1rem; font-size: 0.8rem; border-radius: var(--radius-sm); cursor: pointer;">
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  `;
}

export function initAdminPanelEvents(onClose, onUpdateTab) {
  const modalOverlay = document.getElementById('admin-panel-modal');
  const closeBtn = document.getElementById('close-admin-panel-btn');
  const closeFooterBtn = document.getElementById('close-admin-panel-footer-btn');
  const searchInput = document.getElementById('admin-log-search-input');
  const filterSelect = document.getElementById('admin-log-action-filter');
  const clearLogsBtn = document.getElementById('admin-clear-logs-btn');

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
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', handleClose);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) handleClose();
    });
  }

  // Developer Select Role Listener
  const devRoleSelect = document.getElementById('modal-developer-role-selector');
  if (devRoleSelect) {
    devRoleSelect.addEventListener('change', (e) => {
      const selectedEmail = e.target.value;
      const targetUser = getUsersList().find(u => u.email.toLowerCase() === selectedEmail.toLowerCase());
      if (targetUser) {
        const { password: _, ...cleanUser } = targetUser;
        setAuthUser(cleanUser, true);
        logActivity(cleanUser.email, cleanUser.name, cleanUser.role, 'ROLE_SWITCH_DEV', `Developer beralih role ke ${cleanUser.name}`, 'success');
        if (onUpdateTab) onUpdateTab('overview', '', 'all');
      }
    });
  }

  // Developer Edit User Details (Name & Email) Listener
  document.querySelectorAll('.modal-edit-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      const oldName = btn.getAttribute('data-name');
      const newName = prompt(`Ubah Nama Lengkap Pengguna (${email}):`, oldName);
      if (newName === null) return;
      if (!newName.trim()) {
        alert('Nama tidak boleh kosong!');
        return;
      }
      const newEmail = prompt(`Ubah Alamat Email Pengguna (${newName}):`, email);
      if (newEmail === null) return;
      if (!newEmail.trim() || !newEmail.includes('@')) {
        alert('Alamat email tidak valid!');
        return;
      }

      const res = updateUserDetails(email, newName, newEmail, getAuthUser());
      if (res.success) {
        alert(`🎉 Berhasil memperbarui data pengguna!\nNama: "${newName}"\nEmail: "${newEmail}"`);
        if (onUpdateTab) onUpdateTab('users', '', 'all');
      } else {
        alert(res.message);
      }
    });
  });

  // Superadmin Settings Event Handlers
  const maintBtn = document.getElementById('modal-toggle-maint-btn');
  if (maintBtn) {
    maintBtn.addEventListener('click', () => {
      const current = getSystemSettings();
      setSystemSettings({ maintenanceMode: !current.maintenanceMode });
      if (onUpdateTab) onUpdateTab('settings', '', 'all');
    });
  }

  const saveAnnounceBtn = document.getElementById('modal-save-announce-btn');
  if (saveAnnounceBtn) {
    saveAnnounceBtn.addEventListener('click', () => {
      const active = document.getElementById('modal-announce-chk').checked;
      const text = document.getElementById('modal-announce-input').value;
      setSystemSettings({ announcementBanner: { active, text } });
      alert('✅ Spanduk Pengumuman berhasil disimpan!');
      if (onUpdateTab) onUpdateTab('settings', '', 'all');
    });
  }

  // User Management Event Handlers
  document.querySelectorAll('.modal-user-role-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const email = sel.getAttribute('data-email');
      const newRole = e.target.value;
      const res = updateUserRole(email, newRole, getAuthUser());
      if (!res.success) {
        alert(res.message);
      }
      if (onUpdateTab) onUpdateTab('users', '', 'all');
    });
  });

  document.querySelectorAll('.modal-toggle-ban-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      toggleUserStatus(email);
      if (onUpdateTab) onUpdateTab('users', '', 'all');
    });
  });

  // Moderation Event Handlers
  document.querySelectorAll('.modal-verify-listing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const status = btn.getAttribute('data-status') === 'true';
      updateListingVerification(id, !status);
      if (onUpdateTab) onUpdateTab('moderation', '', 'all');
    });
  });

  document.querySelectorAll('.modal-delete-listing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Hapus listing ini?')) {
        deleteListingById(id);
        if (onUpdateTab) onUpdateTab('moderation', '', 'all');
      }
    });
  });

  // Tabs Switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (onUpdateTab) onUpdateTab(tab, searchInput ? searchInput.value : '', filterSelect ? filterSelect.value : 'all');
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (onUpdateTab) onUpdateTab('logs', searchInput.value, filterSelect ? filterSelect.value : 'all');
    });
  }

  // Filter Select Handler
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      if (onUpdateTab) onUpdateTab('logs', searchInput ? searchInput.value : '', filterSelect.value);
    });
  }

  // Clear Logs Handler
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus semua data audit log aktivitas?')) {
        clearActivityLogs();
        if (onUpdateTab) onUpdateTab('logs', '', 'all');
      }
    });
  }

  // Developer Tools Modal Handlers
  const modalPurgeBtn = document.getElementById('modal-purge-cache-btn');
  if (modalPurgeBtn) {
    modalPurgeBtn.addEventListener('click', () => {
      if (confirm('Bersihkan temporary storage & hard cache browser?')) {
        const res = purgeSystemCache();
        alert(`⚡ ${res.message}`);
        if (onUpdateTab) onUpdateTab('devtools', '', 'all');
      }
    });
  }

  const modalExportBtn = document.getElementById('modal-export-db-btn');
  if (modalExportBtn) {
    modalExportBtn.addEventListener('click', () => {
      const fullDump = exportFullDatabase();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDump, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mymaba_full_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert('✅ Backup Database berhasil diunduh!');
    });
  }

  const modalResetBtn = document.getElementById('modal-reset-db-btn');
  if (modalResetBtn) {
    modalResetBtn.addEventListener('click', () => {
      if (confirm('🚨 WARN: Reset seluruh database ke pengaturan awal pabrik? Data kustom akan terhapus.')) {
        resetFullDatabase();
        if (onUpdateTab) onUpdateTab('overview', '', 'all');
      }
    });
  }
}
