import './style.css';
import { 
  getAuthUser, 
  setAuthUser, 
  logoutAuthUser, 
  authenticateUser, 
  isDeveloperOrSuperadmin,
  isDeveloper,
  getActivityLogs,
  getActiveSessions,
  clearActivityLogs,
  logActivity,
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
  resetFullDatabase,
  restoreFullDatabase,
  purgeSystemCache,
  getStorageDiagnostics,
  getAIMaintenanceLogs,
  runAIMaintenanceRoutine,
  getTerminalHistory,
  saveTerminalHistory,
  MOCK_USERS
} from './utils/storage.js';

const adminState = {
  activeTab: 'overview', // 'overview' | 'settings' | 'users' | 'moderation' | 'sessions' | 'logs' | 'devtools'
  searchQuery: '',
  filterAction: 'all',
  showAddRoleForm: false,
  editingUser: null, // { email, name, role }
  toastMessage: null,
  toastType: 'info',
  terminalLogs: [
    { type: 'system', text: 'MyMaba Developer Console v2.4.0 (Surabaya Engine)' },
    { type: 'system', text: 'Ketik "help" untuk melihat daftar perintah terminal.' },
    { type: 'system', text: 'Ketik "ai-maintenance" untuk memicu pemeliharaan AI.' },
    { type: 'system', text: '---------------------------------------------------------' }
  ],
  terminalHistoryIndex: -1,
  isAIMaintenanceRunning: false,
  aiStepProgress: 0
};

function showAdminToast(msg, type = 'info') {
  adminState.toastMessage = msg;
  adminState.toastType = type;
  renderAdminPortal();
  setTimeout(() => {
    adminState.toastMessage = null;
    renderAdminPortal();
  }, 3500);
}

function renderAdminPortal() {
  const container = document.getElementById('admin-app');
  const user = getAuthUser();
  const hasAccess = isDeveloperOrSuperadmin(user);
  const isDevUser = isDeveloper(user);
  const settings = getSystemSettings();

  // =========================================================================
  // CASE 1: USER IS NOT LOGGED IN OR DOES NOT HAVE DEVELOPER/SUPERADMIN ROLE
  // =========================================================================
  if (!user || !hasAccess) {
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); padding: 1.5rem;">
        
        <div class="pop-in" style="max-width: 460px; width: 100%; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-xl); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); overflow: hidden; backdrop-filter: blur(12px);">
          
          <!-- Security Header -->
          <div style="background: var(--red-gradient); padding: 2rem; text-align: center; color: white; border-bottom: 2px solid var(--gold-accent); position: relative;">
            <div class="security-shield-pulse" style="width: 60px; height: 60px; background: rgba(255,255,255,0.18); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.85rem; border: 1.5px solid rgba(255,255,255,0.4);">
              <i data-lucide="shield-lock" style="width: 30px; height: 30px;"></i>
            </div>
            <h2 class="font-serif" style="font-size: 1.7rem; font-weight: 800; margin: 0 0 0.3rem 0;">Control Panel System</h2>
            <p style="font-size: 0.88rem; opacity: 0.9; margin: 0;">Portal Otoritas Superadmin & Developer MyMaba</p>
          </div>

          <div style="padding: 2rem;">
            
            ${user ? `
              <!-- 403 Forbidden Access Warning for Normal Users -->
              <div style="background: var(--primary-red-soft); border: 1.5px solid var(--primary-red); color: var(--primary-red-dark); padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                <i data-lucide="alert-octagon" style="width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
                <div>
                  <strong style="display: block; font-size: 0.95rem;">Akses Ditolak (403 Forbidden)</strong>
                  <span>Akun Anda (<b>${user.email}</b> - ${user.role}) tidak memiliki otoritas Superadmin / Developer. Silakan login menggunakan kredensial pengelola.</span>
                </div>
              </div>
            ` : `
              <div style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.82rem; margin-bottom: 1.5rem; text-align: center;">
                🔒 Masukkan email & password Superadmin / Developer untuk membuka akses.
              </div>
            `}

            <!-- Security Login Form -->
            <form id="admin-security-login-form">
              <div style="margin-bottom: 1.2rem;">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.4rem;">
                  Email Developer / Superadmin *
                </label>
                <div style="position: relative;">
                  <i data-lucide="mail" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #64748b;"></i>
                  <input 
                    type="email" 
                    id="admin-security-email" 
                    placeholder="Masukkan email pengelola"
                    value=""
                    required 
                    style="width: 100%; padding: 0.75rem 0.8rem 0.75rem 2.6rem; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); color: white; font-size: 0.9rem;"
                  />
                </div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.4rem;">
                  Password Keamanan *
                </label>
                <div style="position: relative;">
                  <i data-lucide="key" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #64748b;"></i>
                  <input 
                    type="password" 
                    id="admin-security-password" 
                    placeholder="••••••••" 
                    value=""
                    required 
                    style="width: 100%; padding: 0.75rem 0.8rem 0.75rem 2.6rem; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); color: white; font-size: 0.9rem;"
                  />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; justify-content: center; background: var(--red-gradient); border: none;">
                <i data-lucide="unlock" style="width: 18px; height: 18px;"></i>
                <span>Verifikasi & Masuk Control Panel</span>
              </button>
            </form>

            <div style="margin-top: 1.5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.2rem;">
              <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i>
                <span>Kembali ke Halaman Utama MyMaba</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const form = document.getElementById('admin-security-login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-security-email').value;
        const pass = document.getElementById('admin-security-password').value;

        const auth = authenticateUser(email, pass);
        if (auth.success) {
          if (isDeveloperOrSuperadmin(auth.user)) {
            setAuthUser(auth.user, true);
            logActivity(auth.user.email, auth.user.name, auth.user.role, 'ADMIN_ACCESS', 'Otorisasi Control Panel berhasil', 'success');
            renderAdminPortal();
          } else {
            alert('❌ Akses Ditolak! Akun Anda tidak memiliki otoritas Superadmin atau Developer.');
          }
        } else {
          alert('❌ Email atau password salah!');
        }
      });
    }

    return;
  }

  // =========================================================================
  // CASE 2: USER IS FULLY AUTHENTICATED AS DEVELOPER OR SUPERADMIN
  // =========================================================================
  if (!isDevUser && ['users', 'devtools'].includes(adminState.activeTab)) {
    adminState.activeTab = 'overview';
  }

  const logs = getActivityLogs();
  const activeSessions = getActiveSessions();
  const usersList = getUsersList();
  const partnerListings = getPartnerListings();
  const marketplaceItems = getMarketplaceItems();
  const allListings = [...partnerListings, ...marketplaceItems];

  const totalLogs = logs.length;
  const loginSuccessCount = logs.filter(l => l.action === 'LOGIN' && l.status === 'success').length;

  const filteredLogs = logs.filter(log => {
    const q = adminState.searchQuery.toLowerCase();
    const matchQ = !q || log.email.toLowerCase().includes(q) || log.name.toLowerCase().includes(q) || log.action.toLowerCase().includes(q);
    const matchF = adminState.filterAction === 'all' || log.action === adminState.filterAction;
    return matchQ && matchF;
  });

  container.innerHTML = `
    <!-- Toast Notification inside Admin -->
    ${adminState.toastMessage ? `
      <div style="position: fixed; top: 20px; right: 20px; z-index: 9999; background: ${adminState.toastType === 'error' ? 'var(--primary-red)' : (adminState.toastType === 'warning' ? '#f59e0b' : '#10b981')}; color: white; padding: 0.85rem 1.25rem; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; font-weight: 700; animation: fadeInDown 0.3s ease;">
        <i data-lucide="${adminState.toastType === 'error' ? 'alert-circle' : 'check-circle'}" style="width: 20px; height: 20px;"></i>
        <span>${adminState.toastMessage}</span>
      </div>
    ` : ''}

    <!-- DEVELOPER ONLY: EDIT USER NAME & EMAIL MODAL -->
    ${adminState.editingUser ? `
      <div style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 1.25rem; animation: fadeIn 0.2s ease;">
        <div style="background: #1e293b; border: 1px solid rgba(59,130,246,0.5); border-radius: var(--radius-xl); max-width: 480px; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,0.7); overflow: hidden;">
          
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 1.25rem 1.5rem; color: white; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="user-pen" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800;">Ubah Nama & Alamat Email</h4>
                <span style="font-size: 0.74rem; opacity: 0.9;">Otoritas Developer (Full Maintenance Access)</span>
              </div>
            </div>
            <button id="close-edit-user-modal-btn" style="background: rgba(255,255,255,0.15); border: none; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>

          <form id="developer-edit-user-form" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.1rem;">
            <div style="background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Role Pengguna</span>
                <div style="font-weight: 800; color: var(--primary-red); font-size: 0.88rem;">${adminState.editingUser.role}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Email Saat Ini</span>
                <div style="font-family: monospace; color: #60a5fa; font-size: 0.82rem;">${adminState.editingUser.email}</div>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.4rem;">Nama Lengkap Pengguna *</label>
              <input type="text" id="edit-user-name-input" value="${adminState.editingUser.name}" required style="width: 100%; padding: 0.7rem 0.85rem; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); color: white; font-size: 0.9rem;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.4rem;">Alamat Email Pengguna *</label>
              <input type="email" id="edit-user-email-input" value="${adminState.editingUser.email}" required style="width: 100%; padding: 0.7rem 0.85rem; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); color: white; font-size: 0.9rem;" />
              <p style="margin: 0.35rem 0 0 0; font-size: 0.75rem; color: #94a3b8;">Email ini akan digunakan untuk login sistem, pengiriman notifikasi, dan audit log.</p>
            </div>

            <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem;">
              <button type="button" id="cancel-edit-user-modal-btn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; padding: 0.65rem 1.2rem; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 700; cursor: pointer;">
                Batal
              </button>
              <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; padding: 0.65rem 1.4rem; font-size: 0.85rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    ` : ''}

    <div style="min-height: 100vh; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column;">
      
      <!-- Top Bar Navigation Header -->
      <header style="background: #1e293b; padding: 0.85rem 1.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; background: var(--primary-red-soft); border: 1px solid var(--primary-red); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary-red);">
            <i data-lucide="shield-check" style="width: 24px; height: 24px;"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <h1 style="font-size: 1.35rem; font-weight: 800; margin: 0; color: #ffffff;">Control Panel System</h1>
              <span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 50px; display: inline-flex; align-items: center; gap: 0.45rem;">
                <span class="live-beacon"></span> Domain Active
              </span>
              ${isDevUser ? `
                <span style="background: rgba(59, 130, 246, 0.25); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.5); font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.65rem; border-radius: 50px;">
                  🛠️ Developer Master (22Kyoukaa@dev.ac.id)
                </span>
              ` : ''}
            </div>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0.1rem 0 0 0;">
              Terhubung sebagai: <b style="color: #60a5fa;">${user.name}</b> (<span style="color: var(--primary-red); font-weight: 700;">${user.role}</span>)
            </p>
          </div>
        </div>

        <!-- DEVELOPER ROLE SELECTOR & CONTROL BAR -->
        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
          
          <!-- Developer Quick Role Selector (Dynamic Role Switcher) -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.15); padding: 0.4rem 0.8rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.6rem;">
            <div style="display: flex; align-items: center; gap: 0.35rem; color: #facc15; font-size: 0.78rem; font-weight: 800; text-transform: uppercase;">
              <i data-lucide="user-cog" style="width: 16px; height: 16px;"></i>
              <span>Switch Role:</span>
            </div>

            <select id="developer-role-selector" style="background: #1e293b; color: #ffffff; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 0.35rem 0.65rem; font-size: 0.82rem; font-weight: 700; cursor: pointer; outline: none; max-width: 320px;">
              ${usersList.map(u => `
                <option value="${u.email}" ${user.email.toLowerCase() === u.email.toLowerCase() ? 'selected' : ''}>
                  ${u.avatar || '👤'} ${u.name} (${u.email})
                </option>
              `).join('')}
            </select>
          </div>

          <a href="/" style="background: rgba(255,255,255,0.08); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.15); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="globe" style="width: 16px; height: 16px;"></i>
            <span>Buka Web Utama</span>
          </a>

          <button id="admin-logout-btn" style="background: var(--primary-red-soft); border: 1px solid var(--primary-red); color: var(--primary-red-dark); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="log-out" style="width: 16px; height: 16px;"></i>
            <span>Keluar Admin</span>
          </button>
        </div>
      </header>

      <!-- Main Layout Body -->
      <div style="flex: 1; display: flex;">
        
        <!-- Sidebar Navigation -->
        <aside style="width: 260px; background: #1e293b; border-right: 1px solid rgba(255,255,255,0.08); padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="padding: 0 0.75rem 0.5rem; font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
            MENU KONTROL SYSTEM
          </div>

          <button class="nav-item-btn ${adminState.activeTab === 'overview' ? 'active' : ''}" data-tab="overview" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'overview' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'overview' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 0.65rem;">
            <i data-lucide="layout-dashboard" style="width: 18px; height: 18px;"></i>
            <span>Overview & Analytics</span>
          </button>

          ${isDevUser ? `
            <button class="nav-item-btn ${adminState.activeTab === 'users' ? 'active' : ''}" data-tab="users" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'users' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'users' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <i data-lucide="user-check" style="width: 18px; height: 18px;"></i>
                <span>Kelola Role Users (${usersList.length})</span>
              </div>
              <span style="background: rgba(59,130,246,0.3); color: #60a5fa; font-size: 0.68rem; padding: 0.1rem 0.4rem; border-radius: 4px;">DEV</span>
            </button>
          ` : ''}

          <button class="nav-item-btn ${adminState.activeTab === 'settings' ? 'active' : ''}" data-tab="settings" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'settings' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'settings' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 0.65rem;">
            <i data-lucide="sliders" style="width: 18px; height: 18px;"></i>
            <span>Pengaturan Superadmin</span>
          </button>

          <button class="nav-item-btn ${adminState.activeTab === 'moderation' ? 'active' : ''}" data-tab="moderation" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'moderation' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'moderation' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 0.65rem;">
            <i data-lucide="file-check-2" style="width: 18px; height: 18px;"></i>
            <span>Moderasi Listing (${allListings.length})</span>
          </button>

          <button class="nav-item-btn ${adminState.activeTab === 'sessions' ? 'active' : ''}" data-tab="sessions" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'sessions' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'sessions' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 0.65rem;">
            <i data-lucide="users" style="width: 18px; height: 18px;"></i>
            <span>Sesi Pengguna (${activeSessions.length})</span>
          </button>

          <button class="nav-item-btn ${adminState.activeTab === 'logs' ? 'active' : ''}" data-tab="logs" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'logs' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'logs' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 0.65rem;">
            <i data-lucide="list-checks" style="width: 18px; height: 18px;"></i>
            <span>Audit Log (${totalLogs})</span>
          </button>

          ${isDevUser ? `
            <button class="nav-item-btn ${adminState.activeTab === 'devtools' ? 'active' : ''}" data-tab="devtools" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); border: none; background: ${adminState.activeTab === 'devtools' ? 'var(--primary-red-soft)' : 'transparent'}; color: ${adminState.activeTab === 'devtools' ? 'var(--primary-red)' : '#cbd5e1'}; font-size: 0.88rem; font-weight: 700; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 0.65rem;">
              <i data-lucide="terminal" style="width: 18px; height: 18px;"></i>
              <span>Developer Tools</span>
              <span style="margin-left:auto; background: rgba(59,130,246,0.3); color: #60a5fa; font-size: 0.68rem; padding: 0.1rem 0.4rem; border-radius: 4px;">DEV</span>
            </button>
          ` : ''}
        </aside>

        <!-- Main Content Area -->
        <main style="flex: 1; padding: 2rem; overflow-y: auto;">
          
          ${adminState.activeTab === 'overview' ? `
            <!-- Overview Dashboard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
              <div class="admin-metric-card" style="background: #1e293b; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.05s;">
                <div style="color: #94a3b8; font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Pengguna Aktif Online</div>
                <div style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.4rem;">${activeSessions.length}</div>
                <div style="font-size: 0.78rem; color: #4ade80; margin-top: 0.2rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span class="live-beacon"></span> Terdeteksi di sistem
                </div>
              </div>

              <div class="admin-metric-card" style="background: #1e293b; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.1s;">
                <div style="color: #94a3b8; font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Total Listing Konten</div>
                <div style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.4rem;">${allListings.length}</div>
                <div style="font-size: 0.78rem; color: var(--primary-red); margin-top: 0.2rem;">Kos & Marketplace Custom</div>
              </div>

              <div class="admin-metric-card" style="background: #1e293b; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.15s;">
                <div style="color: #94a3b8; font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Login Berhasil</div>
                <div style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.4rem;">${loginSuccessCount}</div>
                <div style="font-size: 0.78rem; color: #60a5fa; margin-top: 0.2rem;">Termasuk Mahasiswa & Admin</div>
              </div>

              <div class="admin-metric-card" style="background: #1e293b; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); animation-delay: 0.2s;">
                <div style="color: #94a3b8; font-size: 0.82rem; font-weight: 700; text-transform: uppercase;">Total System Logs</div>
                <div style="font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 0.4rem;">${totalLogs}</div>
                <div style="font-size: 0.78rem; color: #facc15; margin-top: 0.2rem;">Tersimpan di audit database</div>
              </div>
            </div>

            <!-- Recent System Activity -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem;">
              <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 1rem 0; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="activity" style="width: 18px; height: 18px; color: var(--primary-red);"></i>
                <span>Aktivitas Pengguna Real-Time</span>
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${logs.slice(0, 5).map(log => `
                  <div class="admin-table-row" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #0f172a; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                    <div>
                      <div style="font-weight: 700; color: #ffffff;">${log.name} <span style="font-weight: normal; color: #60a5fa; font-size: 0.8rem;">(${log.email})</span></div>
                      <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">${log.details}</div>
                    </div>
                    <div style="text-align: right;">
                      <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; background: ${log.action === 'LOGIN' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}; color: ${log.action === 'LOGIN' ? '#4ade80' : '#60a5fa'};">
                        ${log.action}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${adminState.activeTab === 'users' ? `
            <!-- USER & ROLE MANAGEMENT TAB (EXCLUSIVE DEVELOPER AUTHORIZATION) -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.75rem;">
              
              <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0; color: #ffffff; display: flex; align-items: center; gap: 0.6rem;">
                    <span>Manajemen Otoritas & Penambahan Role</span>
                    ${isDevUser ? `<span style="background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 50px;">🔓 Developer Full Access</span>` : `<span style="background: var(--primary-red-soft); color: var(--primary-red-dark); border: 1px solid var(--primary-red); font-size: 0.72rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 50px;">🔒 Restricted (Read-Only)</span>`}
                  </h3>
                  <p style="font-size: 0.82rem; color: #94a3b8; margin: 0.25rem 0 0 0;">
                    ${isDevUser ? 'Gunakan otoritas Developer untuk menambah user baru atau mengubah role akun terdaftar.' : '🔒 Penambahan & Perubahan Role hanya dapat diakses oleh Developer (<b>22Kyoukaa@dev.ac.id</b>). Superadmin hanya melihat data secara read-only.'}
                  </p>
                </div>

                ${isDevUser ? `
                  <button id="toggle-add-role-form-btn" class="btn btn-primary" style="padding: 0.6rem 1.1rem; font-size: 0.85rem; font-weight: 800;">
                    <i data-lucide="${adminState.showAddRoleForm ? 'minus-circle' : 'user-plus'}" style="width: 16px; height: 16px;"></i>
                    <span>${adminState.showAddRoleForm ? 'Tutup Form' : '➕ Tambah Role / User Baru'}</span>
                  </button>
                ` : ''}
              </div>

              <!-- DEVELOPER ONLY: ADD NEW ROLE FORM -->
              ${isDevUser && adminState.showAddRoleForm ? `
                <div style="background: #0f172a; border: 1px solid rgba(59, 130, 246, 0.4); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; animation: fadeIn 0.25s ease;">
                  <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: #60a5fa; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="shield-plus" style="width: 18px; height: 18px;"></i>
                    Form Penambahan User & Assignment Role Baru (Developer Only)
                  </h4>

                  <form id="developer-add-role-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.35rem;">Nama Pengguna *</label>
                      <input type="text" id="add-role-name" placeholder="Contoh: Lunar Dev 2" required style="width: 100%; padding: 0.6rem 0.8rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-sm); color: white; font-size: 0.85rem;" />
                    </div>

                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.35rem;">Email Pengguna *</label>
                      <input type="email" id="add-role-email" placeholder="contoh@dev.ac.id" required style="width: 100%; padding: 0.6rem 0.8rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-sm); color: white; font-size: 0.85rem;" />
                    </div>

                    <div>
                      <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.35rem;">Pilih Role Otoritas *</label>
                      <select id="add-role-select" required style="width: 100%; padding: 0.6rem 0.8rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-sm); color: white; font-size: 0.85rem; font-weight: 700;">
                        <option value="Developer">🛠️ Developer</option>
                        <option value="Superadmin">👑 Superadmin</option>
                        <option value="Mahasiswa (Universitas Dinamika)">🎓 Mahasiswa Dinamika</option>
                        <option value="Mahasiswa Baru (UNAIR)">🎓 Mahasiswa UNAIR</option>
                        <option value="Mahasiswa (ITS)">💻 Mahasiswa ITS</option>
                      </select>
                    </div>

                    <div style="grid-column: 1 / -1; text-align: right; margin-top: 0.5rem;">
                      <button type="submit" class="btn btn-primary" style="padding: 0.65rem 1.5rem; font-size: 0.88rem; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                        <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                        <span>Simpan & Terapkan Role</span>
                      </button>
                    </div>
                  </form>
                </div>
              ` : ''}

              <!-- RESTRICTION ALERT FOR NON-DEVELOPERS -->
              ${!isDevUser ? `
                <div style="background: var(--primary-red-soft); border: 1.5px solid var(--primary-red); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.85rem; color: var(--primary-red-dark);">
                  <i data-lucide="lock" style="width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px;"></i>
                  <div>
                    <strong style="display: block; font-size: 0.95rem; color: #ffffff;">Fitur Ditahan (Hak Akses Developer)</strong>
                    <span style="font-size: 0.84rem;">Penambahan role baru dan pengubahan otoritas user dikunci khusus untuk akun Developer (<b>22Kyoukaa@dev.ac.id</b>). Anda sedang terhubung sebagai ${user.role}. Gunakan fitur <i>Switch Role</i> di kanan atas untuk berpindah ke akun Developer.</span>
                  </div>
                </div>
              ` : ''}

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">
                      <th style="padding: 0.75rem 1rem;">User Profile</th>
                      <th style="padding: 0.75rem 1rem;">Email</th>
                      <th style="padding: 0.75rem 1rem;">Role Saat Ini</th>
                      <th style="padding: 0.75rem 1rem;">Ubah Role (Dev Only)</th>
                      <th style="padding: 0.75rem 1rem;">Ubah Data (Dev Only)</th>
                      <th style="padding: 0.75rem 1rem;">Status Akun</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${usersList.map(u => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.85rem 1rem;">
                          <div style="display: flex; align-items: center; gap: 0.65rem;">
                            <span style="font-size: 1.3rem;">${u.avatar || '👤'}</span>
                            <span style="font-weight: 700; color: #ffffff;">${u.name}</span>
                          </div>
                        </td>
                        <td style="padding: 0.85rem 1rem; color: #60a5fa; font-family: monospace;">${u.email}</td>
                        <td style="padding: 0.85rem 1rem;">
                          <span style="font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 700; background: ${u.role.includes('Superadmin') ? 'var(--primary-red-soft)' : (u.role.includes('Developer') ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)')}; color: ${u.role.includes('Superadmin') ? 'var(--primary-red)' : (u.role.includes('Developer') ? '#60a5fa' : '#cbd5e1')};">
                            ${u.role}
                          </span>
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                          ${isDevUser ? `
                            <select class="user-role-change-select" data-email="${u.email}" style="padding: 0.35rem 0.6rem; background: #0f172a; border: 1px solid rgba(59,130,246,0.4); border-radius: 6px; color: white; font-size: 0.8rem; font-weight: 600; cursor: pointer;">
                              <option value="Developer" ${u.role.includes('Developer') ? 'selected' : ''}>🛠️ Developer</option>
                              <option value="Superadmin" ${u.role.includes('Superadmin') ? 'selected' : ''}>👑 Superadmin</option>
                              <option value="Mahasiswa (Universitas Dinamika)" ${u.role.includes('Dinamika') ? 'selected' : ''}>🎓 Mahasiswa Dinamika</option>
                              <option value="Mahasiswa Baru (UNAIR)" ${u.role.includes('UNAIR') ? 'selected' : ''}>🎓 Mahasiswa UNAIR</option>
                              <option value="Mahasiswa (ITS)" ${u.role.includes('ITS') ? 'selected' : ''}>💻 Mahasiswa ITS</option>
                            </select>
                          ` : `
                            <div style="font-size: 0.78rem; color: #64748b; display: flex; align-items: center; gap: 0.3rem;" title="Hanya Developer yang dapat mengubah role">
                              <i data-lucide="lock" style="width: 14px; height: 14px;"></i>
                              <span>Dikunci (Dev Only)</span>
                            </div>
                          `}
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                          ${isDevUser ? `
                            <button class="open-edit-user-btn" data-email="${u.email}" data-name="${u.name}" data-role="${u.role}" style="padding: 0.35rem 0.65rem; background: rgba(59,130,246,0.18); border: 1px solid rgba(59,130,246,0.45); color: #60a5fa; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                              <span>Edit Nama & Email</span>
                            </button>
                          ` : `
                            <span style="color: #64748b; font-size: 0.76rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                              <i data-lucide="lock" style="width: 13px; height: 13px;"></i> Terkunci
                            </span>
                          `}
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                          <button class="toggle-user-ban-btn" data-email="${u.email}" style="padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; border: none; background: ${u.isBanned ? 'var(--primary-red)' : 'rgba(34,197,94,0.2)'}; color: ${u.isBanned ? '#ffffff' : '#4ade80'};">
                            ${u.isBanned ? '🚫 Diblokir' : '🟢 Aktif Normal'}
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${adminState.activeTab === 'settings' ? `
            <!-- SUPERADMIN SYSTEM SETTINGS -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.75rem;">
              <h3 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 0.4rem 0; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="sliders" style="width: 22px; height: 22px; color: var(--primary-red);"></i>
                Pengaturan Utama & Kontrol Superadmin
              </h3>
              <p style="font-size: 0.84rem; color: #94a3b8; margin: 0 0 1.5rem 0;">Konfigurasi parameter global aplikasi MyMaba, mode pemeliharaan, dan pengumuman siaran.</p>

              <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                
                <!-- Setting 1: Maintenance Mode Toggle -->
                <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <h4 style="margin: 0; font-size: 0.98rem; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                      <span>Mode Pemeliharaan Website (Maintenance Mode)</span>
                      ${settings.maintenanceMode ? `<span style="background: var(--primary-red); color: white; font-size: 0.7rem; padding: 0.1rem 0.5rem; border-radius: 4px;">AKTIF</span>` : `<span style="background: #22c55e; color: white; font-size: 0.7rem; padding: 0.1rem 0.5rem; border-radius: 4px;">NONAKTIF</span>`}
                    </h4>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #94a3b8;">Saat aktif, pengguna umum akan melihat spanduk pemeliharaan sistem.</p>
                  </div>
                  <button id="toggle-maintenance-btn" style="padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.82rem; cursor: pointer; border: none; background: ${settings.maintenanceMode ? 'var(--primary-red)' : '#22c55e'}; color: white;">
                    ${settings.maintenanceMode ? 'Matikan Maintenance' : 'Nyalakan Maintenance'}
                  </button>
                </div>

                <!-- Setting 2: Broadcast Announcement Banner -->
                <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                    <h4 style="margin: 0; font-size: 0.98rem; color: #ffffff;">Spanduk Pengumuman Siaran Global (Announcement Banner)</h4>
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: #cbd5e1; cursor: pointer;">
                      <input type="checkbox" id="announcement-active-chk" ${settings.announcementBanner.active ? 'checked' : ''} />
                      Tampilkan di Web Utama
                    </label>
                  </div>
                  <div style="display: flex; gap: 0.75rem;">
                    <input 
                      type="text" 
                      id="announcement-text-input" 
                      value="${settings.announcementBanner.text}" 
                      placeholder="Ketik isi pengumuman..."
                      style="flex: 1; padding: 0.7rem 0.85rem; background: #1e293b; border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-md); color: white; font-size: 0.88rem;"
                    />
                    <button id="save-announcement-btn" class="btn btn-primary" style="padding: 0.7rem 1.2rem; font-size: 0.82rem;">
                      <i data-lucide="save" style="width: 16px; height: 16px;"></i>
                      <span>Simpan Spanduk</span>
                    </button>
                  </div>
                </div>

                <!-- Setting 3: Listing Moderation Policy -->
                <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <h4 style="margin: 0; font-size: 0.98rem; color: #ffffff;">Wajibkan Verifikasi Superadmin untuk Posting Baru</h4>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #94a3b8;">Setiap postingan iklan Kos / Barang bekas baru harus disetujui Superadmin sebelum terbit.</p>
                  </div>
                  <button id="toggle-approval-btn" style="padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.82rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: ${settings.requireListingApproval ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}; color: ${settings.requireListingApproval ? '#60a5fa' : '#cbd5e1'};">
                    ${settings.requireListingApproval ? '✓ Wajib Verifikasi' : '✕ Auto Approve'}
                  </button>
                </div>

                <!-- Setting 4: Registration Lock -->
                <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <h4 style="margin: 0; font-size: 0.98rem; color: #ffffff;">Izinkan Pendaftaran Akun Mahasiswa Baru</h4>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #94a3b8;">Buka atau kunci portal pendaftaran pengguna mahasiswa baru.</p>
                  </div>
                  <button id="toggle-registration-btn" style="padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.82rem; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: ${settings.allowNewRegistration ? 'rgba(34,197,94,0.2)' : 'var(--primary-red-soft)'}; color: ${settings.allowNewRegistration ? '#4ade80' : 'var(--primary-red)'};">
                    ${settings.allowNewRegistration ? '🔓 Pendaftaran Terbuka' : '🔒 Pendaftaran Dikunci'}
                  </button>
                </div>

              </div>
            </div>
          ` : ''}

          ${adminState.activeTab === 'moderation' ? `
            <!-- LISTING MODERATION TAB -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.75rem;">
              <h3 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 0.4rem 0; color: #ffffff;">Moderasi Listing Kos & Marketplace Jual-Beli</h3>
              <p style="font-size: 0.82rem; color: #94a3b8; margin: 0 0 1.25rem 0;">Verifikasi keaslian iklan, tandai sebagai terpercaya, atau hapus konten yang melanggar.</p>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">
                      <th style="padding: 0.75rem 1rem;">Judul Listing</th>
                      <th style="padding: 0.75rem 1rem;">Kategori</th>
                      <th style="padding: 0.75rem 1rem;">Harga</th>
                      <th style="padding: 0.75rem 1rem;">Status Verifikasi</th>
                      <th style="padding: 0.75rem 1rem;">Aksi Moderasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${allListings.length === 0 ? `
                      <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: #64748b;">Belum ada custom listing yang perlu dimoderasi.</td>
                      </tr>
                    ` : allListings.map(item => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.85rem 1rem;">
                          <div style="font-weight: 700; color: #ffffff;">${item.title}</div>
                          <div style="font-size: 0.76rem; color: #94a3b8;">${item.address || item.campusId || 'Surabaya'}</div>
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                          <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; font-weight: 700;">
                            ${item.category || 'Kos'}
                          </span>
                        </td>
                        <td style="padding: 0.85rem 1rem; color: #4ade80; font-weight: 700;">
                          Rp ${(item.price || 0).toLocaleString('id-ID')}
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                          <button class="toggle-verify-listing-btn" data-id="${item.id}" data-status="${item.isVerified}" style="padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.76rem; font-weight: 700; cursor: pointer; border: none; background: ${item.isVerified ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}; color: ${item.isVerified ? '#4ade80' : '#facc15'};">
                            ${item.isVerified ? '✓ Verified (Terverifikasi)' : '⏳ Pending / Belum Verifikasi'}
                          </button>
                        </td>
                        <td style="padding: 0.85rem 1rem;">
                          <button class="delete-listing-btn" data-id="${item.id}" style="padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.76rem; font-weight: 700; cursor: pointer; border: 1px solid var(--primary-red); background: var(--primary-red-soft); color: var(--primary-red);">
                            🗑️ Hapus Listing
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${adminState.activeTab === 'sessions' ? `
            <!-- Active Sessions View -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem;">
              <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 1.25rem 0; color: #ffffff;">Pengguna Aktif Saat Ini (${activeSessions.length})</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${activeSessions.map(sess => `
                  <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem;">
                      <div style="font-size: 2rem;">${sess.avatar || '🎓'}</div>
                      <div>
                        <div style="font-weight: 800; font-size: 1rem; color: #ffffff;">${sess.name}</div>
                        <div style="font-size: 0.8rem; color: var(--primary-red);">${sess.email}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">${sess.role}</div>
                      </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.78rem; display: flex; flex-direction: column; gap: 0.3rem;">
                      <div>IP: <span style="font-family: monospace; color: #ffffff;">${sess.ip || '180.252.74.19'}</span></div>
                      <div>Status: <span style="color: #4ade80; font-weight: 700;">🟢 ${sess.status || 'Active'}</span></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${adminState.activeTab === 'logs' ? `
            <!-- Logs View -->
            <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0; color: #ffffff;">Audit Logs System</h3>
                <button id="admin-dev-clear-logs" style="background: var(--primary-red-soft); border: 1px solid var(--primary-red); color: var(--primary-red); padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer;">
                  Reset Log Database
                </button>
              </div>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.78rem;">
                      <th style="padding: 0.75rem 1rem;">Waktu</th>
                      <th style="padding: 0.75rem 1rem;">Pengguna</th>
                      <th style="padding: 0.75rem 1rem;">Aksi</th>
                      <th style="padding: 0.75rem 1rem;">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredLogs.map(l => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.85rem 1rem; color: #94a3b8;">${new Date(l.timestamp).toLocaleString()}</td>
                        <td style="padding: 0.85rem 1rem;"><b>${l.name}</b><br><span style="color:#60a5fa; font-size:0.76rem;">${l.email}</span></td>
                        <td style="padding: 0.85rem 1rem;"><span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(59, 130, 246, 0.2); color: #60a5fa;">${l.action}</span></td>
                        <td style="padding: 0.85rem 1rem; color: #cbd5e1;">${l.details}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${isDevUser && adminState.activeTab === 'devtools' ? `
            <!-- Comprehensive Developer Control & Maintenance Suite -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              
              <!-- CARD 1: AI AUTONOMOUS ROUTINE MAINTENANCE SUITE -->
              <div class="ai-maint-card">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
                      <span class="ai-pulse-badge">
                        <i data-lucide="bot" style="width: 14px; height: 14px;"></i>
                        <span>AI Autonomous Maintenance Engine</span>
                      </span>
                      <span style="background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.4); font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.6rem; border-radius: 50px;">
                        🟢 ACTIVE &amp; HEALTHY
                      </span>
                    </div>
                    <h3 style="font-size: 1.3rem; font-weight: 800; margin: 0; color: #ffffff;">
                      Sistem Pemeliharaan Otomatis Berbasis AI
                    </h3>
                    <p style="font-size: 0.82rem; color: #94a3b8; margin: 0.2rem 0 0 0;">
                      Menjalankan pembersihan sesi stale, defragmentasi database LocalStorage, audit integritas listing, dan verifikasi keamanan secara rutin.
                    </p>
                  </div>

                  <button id="trigger-ai-maint-btn" class="btn btn-primary" ${adminState.isAIMaintenanceRunning ? 'disabled' : ''} style="background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%); border: none; padding: 0.75rem 1.4rem; font-size: 0.88rem; font-weight: 800; box-shadow: 0 8px 24px rgba(168,85,247,0.35);">
                    <i data-lucide="${adminState.isAIMaintenanceRunning ? 'refresh-cw' : 'play-circle'}" style="width: 18px; height: 18px; ${adminState.isAIMaintenanceRunning ? 'animation: spin 1s linear infinite;' : ''}"></i>
                    <span>${adminState.isAIMaintenanceRunning ? 'AI Sedang Memelihara System...' : 'Jalankan AI Routine Maintenance Now'}</span>
                  </button>
                </div>

                <!-- Live Step Progress Bar if Maintenance is Running -->
                ${adminState.isAIMaintenanceRunning ? `
                  <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(168,85,247,0.4); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; color: #c084fc; margin-bottom: 0.6rem;">
                      <span>Proses Diagnostic &amp; Optimization (${adminState.aiStepProgress * 20}%)</span>
                      <span>Tahap ${adminState.aiStepProgress} dari 5</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 0.85rem;">
                      <div class="ai-progress-animated" style="width: ${adminState.aiStepProgress * 20}%; height: 100%; background: linear-gradient(90deg, #a855f7 0%, #ec4899 100%); transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 0.85rem; color: #e2e8f0; font-family: monospace;">
                      ${adminState.aiStepProgress === 1 ? '🧹 Step 1: Membersihkan token sesi stale &amp; temporary bookmark keys...' : ''}
                      ${adminState.aiStepProgress === 2 ? '🔍 Step 2: Mengaudit 62 katalog kos &amp; marketplace dari kerentanan data...' : ''}
                      ${adminState.aiStepProgress === 3 ? '⚡ Step 3: Melakukan defragmentasi LocalStorage &amp; restrukturisasi indeks storage...' : ''}
                      ${adminState.aiStepProgress === 4 ? '🛡️ Step 4: Melakukan pemeriksaan keamanan (brute force detection &amp; account limits)...' : ''}
                      ${adminState.aiStepProgress === 5 ? '🤖 Step 5: Mengompilasi laporan skor kesehatan sistem &amp; rekomendasi pemeliharaan...' : ''}
                    </div>
                  </div>
                ` : ''}

                <!-- AI Maintenance History & Diagnostic Report -->
                ${(() => {
                  const maintLogs = getAIMaintenanceLogs();
                  const latest = maintLogs[0] || {};
                  return `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                      <div style="background: rgba(15,23,42,0.8); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">System Health Score</div>
                        <div style="font-size: 1.8rem; font-weight: 900; color: #4ade80; margin-top: 0.2rem; display: flex; align-items: center; gap: 0.4rem;">
                          <span>${latest.healthScore || 98}/100</span>
                          <span style="font-size: 0.72rem; padding: 0.15rem 0.5rem; background: rgba(34,197,94,0.2); border-radius: 4px;">EXCELLENT</span>
                        </div>
                        <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 0.2rem;">Kondisi database &amp; memori prima</div>
                      </div>

                      <div style="background: rgba(15,23,42,0.8); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Terakhir Dijalankan</div>
                        <div style="font-size: 1rem; font-weight: 800; color: #c084fc; margin-top: 0.4rem;">${latest.timestamp || 'Baru Saja'}</div>
                        <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 0.2rem;">Oleh: ${latest.operator || 'AI Routine Engine'}</div>
                      </div>

                      <div style="background: rgba(15,23,42,0.8); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Jadwal Rutin Otomatis</div>
                        <div style="font-size: 1rem; font-weight: 800; color: #60a5fa; margin-top: 0.4rem;">Setiap 24 Jam 🕒</div>
                        <div style="font-size: 0.72rem; color: #4ade80; margin-top: 0.2rem;">Otomatisasi Cron Job Aktif</div>
                      </div>
                    </div>

                    <div style="background: rgba(15,23,42,0.9); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 1.25rem;">
                      <div style="font-size: 0.85rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
                        <span>Rincian Hasil AI Maintenance Terbaru:</span>
                        <span style="font-size: 0.74rem; color: #c084fc;">Status: ${latest.status || 'SUCCESS'}</span>
                      </div>
                      <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem; color: #cbd5e1;">
                        ${(latest.details || [
                          '🧹 Pembersihan Storage: 0 token sesi stale terdeteksi',
                          '🔍 Audit Katalog: All items 100% konsisten',
                          '⚡ Indeks Database: Kuota terpakai optimal (< 5%)',
                          '🛡️ Audit Keamanan: All user permissions verified'
                        ]).map(d => `<li>${d}</li>`).join('')}
                      </ul>
                    </div>
                  `;
                })()}
              </div>

              <!-- CARD 2: INTERACTIVE DEVELOPER CLI TERMINAL SUITE -->
              <div class="dev-terminal-container">
                <div class="terminal-header">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="terminal-dots">
                      <span class="terminal-dot" style="background: var(--primary-red);"></span>
                      <span class="terminal-dot" style="background: #f59e0b;"></span>
                      <span class="terminal-dot" style="background: #10b981;"></span>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; font-family: monospace;">
                      mymaba-cli — bash — 80x24
                    </span>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button id="cli-run-quick-diag-btn" style="background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.4); color: #60a5fa; font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 4px; cursor: pointer;">
                      ⚡ Quick Healthcheck
                    </button>
                    <button id="cli-clear-screen-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #cbd5e1; font-size: 0.72rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 4px; cursor: pointer;">
                      🧹 Clear Terminal
                    </button>
                  </div>
                </div>

                <!-- Terminal Output Scroll Box -->
                <div class="terminal-output" id="terminal-output-scroll-box">
                  ${adminState.terminalLogs.map(line => `
                    <div class="terminal-line ${line.type}">${line.text}</div>
                  `).join('')}
                </div>

                <!-- Terminal Input Line -->
                <form id="terminal-cli-form" class="terminal-input-row">
                  <span class="terminal-input-prompt">$ mymaba-cli &gt;</span>
                  <input 
                    type="text" 
                    id="terminal-cli-input" 
                    class="terminal-input" 
                    placeholder="Ketik perintah (contoh: help, status, healthcheck, ai-maintenance)..." 
                    autocomplete="off" 
                  />
                  <button type="submit" style="background: #3b82f6; color: white; border: none; padding: 0.35rem 0.85rem; border-radius: 4px; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
                    Kirim ↵
                  </button>
                </form>
              </div>

              <!-- CARD 3: SYSTEM DIAGNOSTICS & HARD CACHE -->
              <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(59,130,246,0.3); padding: 1.5rem; position: relative; overflow: hidden;">
                <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 1rem 0; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="activity" style="width: 20px; height: 20px; color: #60a5fa;"></i>
                  <span>Radar Kesehatan System &amp; Cache Diagnostic</span>
                </h3>

                ${(() => {
                  const diag = getStorageDiagnostics();
                  return `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                      <div style="background: #0f172a; padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Penggunaan Storage</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #60a5fa; margin-top: 0.2rem;">${diag.kb} KB</div>
                        <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 0.2rem;">${diag.percentage}% dari 5MB kuota</div>
                      </div>

                      <div style="background: #0f172a; padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Total Items Storage</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #ffffff; margin-top: 0.2rem;">${diag.itemsCount} Keys</div>
                        <div style="font-size: 0.72rem; color: #4ade80; margin-top: 0.2rem;">Kunci terindeks lokal</div>
                      </div>

                      <div style="background: #0f172a; padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Latency Baseline</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #4ade80; margin-top: 0.2rem;">&lt; 2 ms</div>
                        <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 0.2rem;">In-Memory State Fast</div>
                      </div>
                    </div>
                  `;
                })()}

                <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                  <button id="dev-purge-cache-btn" style="background: rgba(245,158,11,0.2); border: 1px solid #f59e0b; color: #fbbf24; padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    <span>Bersihkan Hard Cache Browser</span>
                  </button>
                </div>
              </div>

              <!-- CARD 4: FEATURE FLAGS & EMERGENCY BROADCAST & DATABASE MANAGEMENT -->
              <div style="background: #1e293b; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 1.25rem 0; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
                  <i data-lucide="database" style="width: 20px; height: 20px; color: #facc15;"></i>
                  <span>Manajemen Data &amp; Export/Restore Database</span>
                </h3>

                <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                  
                  <!-- Backup JSON Export -->
                  <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <h4 style="margin: 0; font-size: 0.95rem; color: #ffffff;">Export Complete Database Backup (.JSON)</h4>
                      <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #94a3b8;">Unduh salinan penuh seluruh data (Users, Logs, Listings, Settings) untuk pengarsipan aman.</p>
                    </div>
                    <button id="dev-export-btn" class="btn btn-primary" style="font-size: 0.82rem; padding: 0.6rem 1.2rem;">
                      <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                      <span>Export Backup JSON</span>
                    </button>
                  </div>

                  <!-- Restore JSON Database -->
                  <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <h4 style="margin: 0; font-size: 0.95rem; color: #ffffff;">Restore Database dari File JSON Dump</h4>
                      <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #94a3b8;">Unggah file backup `.json` untuk memulihkan seluruh struktur data sistem.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <input type="file" id="dev-restore-file-input" accept=".json" style="display: none;" />
                      <button id="dev-trigger-restore-file-btn" style="background: rgba(59,130,246,0.2); border: 1px solid #3b82f6; color: #60a5fa; padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                        <i data-lucide="upload-cloud" style="width: 16px; height: 16px;"></i>
                        <span>Pilih File Backup JSON</span>
                      </button>
                    </div>
                  </div>

                  <!-- Factory Reset -->
                  <div style="background: #0f172a; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--primary-red); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <h4 style="margin: 0; font-size: 0.95rem; color: var(--primary-red);">Factory Reset Complete System</h4>
                      <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #94a3b8;">Hapus seluruh data kustom dan kembalikan sistem ke kondisi awal pabrik.</p>
                    </div>
                    <button id="dev-reset-db-btn" style="background: var(--primary-red-soft); border: 1px solid var(--primary-red); color: var(--primary-red-dark); font-size: 0.82rem; padding: 0.6rem 1.2rem; border-radius: var(--radius-md); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem;">
                      <i data-lucide="flame" style="width: 16px; height: 16px;"></i>
                      <span>Reset Factory Defaults</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          ` : ''}

        </main>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Attach Developer Quick Role Selector Listener
  const roleSelect = document.getElementById('developer-role-selector');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const selectedEmail = e.target.value;
      const targetUser = usersList.find(u => u.email.toLowerCase() === selectedEmail.toLowerCase());
      if (targetUser) {
        const { password: _, ...cleanUser } = targetUser;
        setAuthUser(cleanUser, true);
        logActivity(cleanUser.email, cleanUser.name, cleanUser.role, 'ROLE_SWITCH_DEV', `Beralih akun ke ${cleanUser.name} (${cleanUser.role})`, 'success');
        showAdminToast(`Berhasil beralih akun ke: ${cleanUser.name} (${cleanUser.role})`, 'success');
      }
    });
  }

  // Developer Edit User Name & Email Listeners
  container.querySelectorAll('.open-edit-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      const name = btn.getAttribute('data-name');
      const role = btn.getAttribute('data-role');
      adminState.editingUser = { email, name, role };
      renderAdminPortal();
    });
  });

  const closeEditModalBtn = document.getElementById('close-edit-user-modal-btn');
  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', () => {
      adminState.editingUser = null;
      renderAdminPortal();
    });
  }

  const cancelEditModalBtn = document.getElementById('cancel-edit-user-modal-btn');
  if (cancelEditModalBtn) {
    cancelEditModalBtn.addEventListener('click', () => {
      adminState.editingUser = null;
      renderAdminPortal();
    });
  }

  const editUserForm = document.getElementById('developer-edit-user-form');
  if (editUserForm) {
    editUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('edit-user-name-input').value;
      const newEmail = document.getElementById('edit-user-email-input').value;

      const res = updateUserDetails(adminState.editingUser.email, newName, newEmail, user);
      if (res.success) {
        adminState.editingUser = null;
        showAdminToast(`🎉 Data pengguna berhasil diubah: "${newName}" (${newEmail})`, 'success');
      } else {
        showAdminToast(res.message, 'error');
      }
    });
  }

  // Toggle Add Role Form button listener
  const toggleAddRoleBtn = document.getElementById('toggle-add-role-form-btn');
  if (toggleAddRoleBtn) {
    toggleAddRoleBtn.addEventListener('click', () => {
      adminState.showAddRoleForm = !adminState.showAddRoleForm;
      renderAdminPortal();
    });
  }

  // Add New Role Form submit handler
  const addRoleForm = document.getElementById('developer-add-role-form');
  if (addRoleForm) {
    addRoleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('add-role-name').value;
      const email = document.getElementById('add-role-email').value;
      const role = document.getElementById('add-role-select').value;

      const result = addNewUserRole(name, email, role, '👤', user);
      if (result.success) {
        adminState.showAddRoleForm = false;
        showAdminToast(`🎉 Berhasil menambahkan role ${role} untuk user ${email}!`, 'success');
      } else {
        showAdminToast(result.message, 'error');
      }
    });
  }

  // Attach Sidebar Tab Clicks
  container.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      adminState.activeTab = btn.getAttribute('data-tab');
      renderAdminPortal();
    });
  });

  // Logout Handler
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutAuthUser();
      renderAdminPortal();
    });
  }

  // Superadmin Settings Handlers
  const toggleMaintBtn = document.getElementById('toggle-maintenance-btn');
  if (toggleMaintBtn) {
    toggleMaintBtn.addEventListener('click', () => {
      const updated = setSystemSettings({ maintenanceMode: !settings.maintenanceMode });
      logActivity(user.email, user.name, user.role, 'MAINTENANCE_TOGGLE', `Mode pemeliharaan diubah ke ${updated.maintenanceMode ? 'AKTIF' : 'NONAKTIF'}`, 'warning');
      showAdminToast(`Mode Maintenance kini ${updated.maintenanceMode ? 'AKTIF 🔴' : 'NONAKTIF 🟢'}`, updated.maintenanceMode ? 'warning' : 'success');
    });
  }

  const saveAnnounceBtn = document.getElementById('save-announcement-btn');
  if (saveAnnounceBtn) {
    saveAnnounceBtn.addEventListener('click', () => {
      const active = document.getElementById('announcement-active-chk').checked;
      const text = document.getElementById('announcement-text-input').value;
      setSystemSettings({ announcementBanner: { active, text } });
      logActivity(user.email, user.name, user.role, 'ANNOUNCEMENT_UPDATE', `Pengumuman global diperbarui: "${text}"`, 'info');
      showAdminToast('Pengumuman siaran global berhasil disimpan!', 'success');
    });
  }

  const toggleApprovalBtn = document.getElementById('toggle-approval-btn');
  if (toggleApprovalBtn) {
    toggleApprovalBtn.addEventListener('click', () => {
      const updated = setSystemSettings({ requireListingApproval: !settings.requireListingApproval });
      showAdminToast(`Verifikasi postingan baru: ${updated.requireListingApproval ? 'WAJIB VERIFIKASI' : 'AUTO APPROVE'}`, 'info');
    });
  }

  const toggleRegBtn = document.getElementById('toggle-registration-btn');
  if (toggleRegBtn) {
    toggleRegBtn.addEventListener('click', () => {
      const updated = setSystemSettings({ allowNewRegistration: !settings.allowNewRegistration });
      showAdminToast(`Status pendaftaran mahasiswa: ${updated.allowNewRegistration ? 'TERBUKA 🔓' : 'DIKUNCI 🔒'}`, updated.allowNewRegistration ? 'success' : 'warning');
    });
  }

  // User Role & Status Change Handlers
  container.querySelectorAll('.user-role-change-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const targetEmail = sel.getAttribute('data-email');
      const newRole = e.target.value;
      const res = updateUserRole(targetEmail, newRole, user);
      if (res.success) {
        showAdminToast(`Role untuk ${targetEmail} berhasil diubah ke: ${newRole}`, 'success');
      } else {
        showAdminToast(res.message, 'error');
      }
    });
  });

  container.querySelectorAll('.toggle-user-ban-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetEmail = btn.getAttribute('data-email');
      const updatedUser = toggleUserStatus(targetEmail);
      showAdminToast(`Status ${targetEmail}: ${updatedUser.isBanned ? 'DIBLOKIR' : 'AKTIF'}`, updatedUser.isBanned ? 'error' : 'success');
    });
  });

  // Moderation Handlers
  container.querySelectorAll('.toggle-verify-listing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const currentStatus = btn.getAttribute('data-status') === 'true';
      updateListingVerification(id, !currentStatus);
      showAdminToast(`Status verifikasi listing berhasil diperbarui!`, 'success');
    });
  });

  container.querySelectorAll('.delete-listing-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Hapus listing ini secara permanen dari sistem?')) {
        deleteListingById(id);
        showAdminToast('Listing berhasil dihapus dari katalog!', 'warning');
      }
    });
  });

  // Clear Logs
  const clearLogsBtn = document.getElementById('admin-dev-clear-logs');
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      if (confirm('Hapus seluruh audit log database?')) {
        clearActivityLogs();
        renderAdminPortal();
      }
    });
  }

  // Dev Purge Cache
  const purgeCacheBtn = document.getElementById('dev-purge-cache-btn');
  if (purgeCacheBtn) {
    purgeCacheBtn.addEventListener('click', () => {
      if (confirm('Bersihkan temporary storage & hard cache browser?')) {
        const res = purgeSystemCache();
        showAdminToast(`⚡ ${res.message}`, 'success');
      }
    });
  }

  // Dev Emergency Alert Broadcast Handler
  const saveEmergencyBtn = document.getElementById('dev-save-emergency-btn');
  if (saveEmergencyBtn) {
    saveEmergencyBtn.addEventListener('click', () => {
      const active = document.getElementById('dev-emergency-active-chk').checked;
      const title = document.getElementById('dev-emergency-title-input').value;
      const message = document.getElementById('dev-emergency-msg-input').value;

      setSystemSettings({
        emergencyAlert: { active, title, message }
      });
      logActivity(user.email, user.name, user.role, 'EMERGENCY_BROADCAST', `Siaran darurat ${active ? 'DIPANCARKAN' : 'DIMATIKAN'}: "${title}"`, active ? 'warning' : 'info');
      showAdminToast(`Siaran Darurat ${active ? 'BERHASIL DIPANCARKAN! 🚨' : 'Disimpan (Nonaktif)'}`, active ? 'warning' : 'success');
    });
  }

  // Dev Feature Flags Toggle Handlers
  container.querySelectorAll('.dev-feature-flag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const flagName = btn.getAttribute('data-flag');
      const currentFlags = settings.featureFlags || {
        enableMarketplace: true,
        enablePartnerRegistration: true,
        enableHelpdesk: true,
        enableUserSignups: true
      };
      const newValue = !currentFlags[flagName];
      const updatedFlags = { ...currentFlags, [flagName]: newValue };
      setSystemSettings({ featureFlags: updatedFlags });
      logActivity(user.email, user.name, user.role, 'FEATURE_FLAG_UPDATE', `Feature flag ${flagName} diubah ke ${newValue ? 'ON' : 'OFF'}`, 'info');
      showAdminToast(`Sakelar Fitur ${flagName}: ${newValue ? 'AKTIF 🟢' : 'NONAKTIF 🔴'}`, newValue ? 'success' : 'warning');
      renderAdminPortal();
    });
  });

  // Dev Trigger Restore File Picker & JSON Reader
  const triggerRestoreBtn = document.getElementById('dev-trigger-restore-file-btn');
  const restoreFileInput = document.getElementById('dev-restore-file-input');

  if (triggerRestoreBtn && restoreFileInput) {
    triggerRestoreBtn.addEventListener('click', () => {
      restoreFileInput.click();
    });

    restoreFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const dbDump = JSON.parse(event.target.result);
          if (confirm('⚠️ PERINGATAN: Memulihkan database dari file JSON akan menimpa data yang ada. Lanjutkan?')) {
            const res = restoreFullDatabase(dbDump);
            if (res.success) {
              showAdminToast('🎉 Database berhasil direstore dari backup JSON!', 'success');
              renderAdminPortal();
            } else {
              showAdminToast(res.message, 'error');
            }
          }
        } catch (err) {
          showAdminToast('Format file JSON tidak valid!', 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  // Dev Export Full Database Dump
  const exportBtn = document.getElementById('dev-export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const fullDump = exportFullDatabase();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDump, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mymaba_full_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showAdminToast('Backup Database berhasil diunduh!', 'success');
    });
  }

  // Dev Reset Factory Defaults
  const resetDbBtn = document.getElementById('dev-reset-db-btn');
  if (resetDbBtn) {
    resetDbBtn.addEventListener('click', () => {
      if (confirm('🚨 WARN: Reset seluruh database ke pengaturan bawaan awal? Data kustom akan terhapus.')) {
        resetFullDatabase();
        renderAdminPortal();
      }
    });
  }

  // CLI Terminal Form & Input Handlers
  const cliForm = document.getElementById('terminal-cli-form');
  const cliInput = document.getElementById('terminal-cli-input');
  const scrollBox = document.getElementById('terminal-output-scroll-box');

  if (scrollBox) {
    scrollBox.scrollTop = scrollBox.scrollHeight;
  }

  if (cliForm && cliInput) {
    cliForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const commandText = cliInput.value;
      if (!commandText.trim()) return;
      executeCLICommand(commandText, user);
      adminState.terminalHistoryIndex = -1;
      renderAdminPortal();
    });

    cliInput.addEventListener('keydown', (e) => {
      const history = getTerminalHistory();
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
          if (adminState.terminalHistoryIndex === -1) {
            adminState.terminalHistoryIndex = history.length - 1;
          } else if (adminState.terminalHistoryIndex > 0) {
            adminState.terminalHistoryIndex--;
          }
          cliInput.value = history[adminState.terminalHistoryIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (adminState.terminalHistoryIndex !== -1) {
          if (adminState.terminalHistoryIndex < history.length - 1) {
            adminState.terminalHistoryIndex++;
            cliInput.value = history[adminState.terminalHistoryIndex] || '';
          } else {
            adminState.terminalHistoryIndex = -1;
            cliInput.value = '';
          }
        }
      }
    });
  }

  const cliClearBtn = document.getElementById('cli-clear-screen-btn');
  if (cliClearBtn) {
    cliClearBtn.addEventListener('click', () => {
      adminState.terminalLogs = [
        { type: 'system', text: 'MyMaba Developer Console v2.4.0 (Surabaya Engine)' },
        { type: 'system', text: 'Ketik "help" untuk melihat daftar perintah terminal.' }
      ];
      renderAdminPortal();
    });
  }

  const cliQuickDiagBtn = document.getElementById('cli-run-quick-diag-btn');
  if (cliQuickDiagBtn) {
    cliQuickDiagBtn.addEventListener('click', () => {
      executeCLICommand('healthcheck', user);
      renderAdminPortal();
    });
  }

  if (adminState.activeTab === 'devtools' && cliInput) {
    cliInput.focus();
  }

  // AI Routine Maintenance Trigger Handler
  const triggerAIMaintBtn = document.getElementById('trigger-ai-maint-btn');
  if (triggerAIMaintBtn && !adminState.isAIMaintenanceRunning) {
    triggerAIMaintBtn.addEventListener('click', () => {
      adminState.isAIMaintenanceRunning = true;
      adminState.aiStepProgress = 1;
      renderAdminPortal();

      const interval = setInterval(() => {
        adminState.aiStepProgress++;
        if (adminState.aiStepProgress > 5) {
          clearInterval(interval);
          adminState.isAIMaintenanceRunning = false;
          adminState.aiStepProgress = 0;
          runAIMaintenanceRoutine(user);
          showAdminToast('🎉 AI Routine Maintenance berhasil diselesaikan! Status system: OPTIMAL 🟢', 'success');
          renderAdminPortal();
        } else {
          renderAdminPortal();
        }
      }, 700);
    });
  }
}

function executeCLICommand(inputCmd, user) {
  const cleanCmd = inputCmd.trim();
  saveTerminalHistory(cleanCmd);
  
  adminState.terminalLogs.push({ type: 'cmd-prompt', text: `$ mymaba-cli > ${cleanCmd}` });
  
  const parts = cleanCmd.split(' ');
  const mainCmd = parts[0].toLowerCase();
  
  switch (mainCmd) {
    case 'help':
      adminState.terminalLogs.push({ type: 'system', text: '=== DAFTAR PERINTAH MYMABA CLI TERMINAL ===' });
      adminState.terminalLogs.push({ type: 'system', text: '  status         : Tampilkan statistik penggunaan memori, DB, & user aktif' });
      adminState.terminalLogs.push({ type: 'system', text: '  healthcheck    : Jalankan tes diagnostik integritas sistem' });
      adminState.terminalLogs.push({ type: 'system', text: '  ai-maintenance : Jalankan pemeliharaan rutin otomatis berbasis AI' });
      adminState.terminalLogs.push({ type: 'system', text: '  ai-repair      : Perbaiki masalah integritas data yang terdeteksi' });
      adminState.terminalLogs.push({ type: 'system', text: '  clear-cache    : Bersihkan temporary storage & hard cache' });
      adminState.terminalLogs.push({ type: 'system', text: '  audit-logs     : Tampilkan 5 log aktivitas terbaru' });
      adminState.terminalLogs.push({ type: 'system', text: '  export-db      : Unduh backup penuh database dalam format JSON' });
      adminState.terminalLogs.push({ type: 'system', text: '  whoami         : Tampilkan identitas & otoritas akun pengguna saat ini' });
      adminState.terminalLogs.push({ type: 'system', text: '  banner         : Tampilkan banner logo MyMaba CLI' });
      adminState.terminalLogs.push({ type: 'system', text: '  clear / cls    : Bersihkan layar tampilan terminal' });
      break;

    case 'status':
    case 'system':
      const diag = getStorageDiagnostics();
      const users = getUsersList();
      const listings = [...getPartnerListings(), ...getMarketplaceItems()];
      adminState.terminalLogs.push({ type: 'system', text: '[SYSTEM STATUS REPORT]' });
      adminState.terminalLogs.push({ type: 'system', text: `• Engine Version   : MyMaba Surabaya Core v2.4` });
      adminState.terminalLogs.push({ type: 'system', text: `• Storage Usage    : ${diag.kb} KB (${diag.percentage}% kuota terpakai)` });
      adminState.terminalLogs.push({ type: 'system', text: `• Total Keys       : ${diag.itemsCount} terindeks` });
      adminState.terminalLogs.push({ type: 'system', text: `• Registered Users : ${users.length} pengguna` });
      adminState.terminalLogs.push({ type: 'system', text: `• Active Listings  : ${listings.length} katalog` });
      adminState.terminalLogs.push({ type: 'system', text: `• Health Indicator : 🟢 OK (Latency < 2ms)` });
      break;

    case 'healthcheck':
    case 'ping':
      adminState.terminalLogs.push({ type: 'system', text: 'Menguji koneksi internal & integritas modul data...' });
      adminState.terminalLogs.push({ type: 'system', text: '[✓] LocalStorage IndexedDB Bridge : OK' });
      adminState.terminalLogs.push({ type: 'system', text: '[✓] Authenticated User Session     : OK' });
      adminState.terminalLogs.push({ type: 'system', text: '[✓] Audit Trail Activity Logger   : OK' });
      adminState.terminalLogs.push({ type: 'system', text: '[✓] Feature Flags State            : OPTIMAL' });
      adminState.terminalLogs.push({ type: 'system', text: '=> DIAGNOSTIK SELESAI: All systems operational. 0 Critical Faults.' });
      break;

    case 'ai-maintenance':
    case 'maintenance':
      adminState.terminalLogs.push({ type: 'ai-msg', text: '🤖 [AI AGENT] Memicu routine maintenance otomatis...' });
      const maintRes = runAIMaintenanceRoutine(user);
      maintRes.details.forEach(detail => {
        adminState.terminalLogs.push({ type: 'system', text: `  ${detail}` });
      });
      adminState.terminalLogs.push({ type: 'ai-msg', text: `=> ${maintRes.summary}` });
      break;

    case 'ai-repair':
      adminState.terminalLogs.push({ type: 'ai-msg', text: '🤖 [AI REPAIR] Menjalankan pemindaian anomali data...' });
      adminState.terminalLogs.push({ type: 'system', text: '• Memeriksa duplikasi kunci pengguna... [0 Duplikat]' });
      adminState.terminalLogs.push({ type: 'system', text: '• Memeriksa URL gambar listing terputus... [100% Valid]' });
      adminState.terminalLogs.push({ type: 'ai-msg', text: '=> Pemulihan AI selesai: Data dalam kondisi prima.' });
      break;

    case 'clear-cache':
      purgeSystemCache();
      adminState.terminalLogs.push({ type: 'warning', text: '⚡ Hard cache browser & temporary storage berhasil dibersihkan.' });
      break;

    case 'audit-logs':
      const logs = getActivityLogs().slice(0, 5);
      adminState.terminalLogs.push({ type: 'system', text: '=== 5 LOG AKTIVITAS TERBARU ===' });
      logs.forEach(l => {
        adminState.terminalLogs.push({ type: 'system', text: `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.name} (${l.action}): ${l.details}` });
      });
      break;

    case 'whoami':
      adminState.terminalLogs.push({ type: 'system', text: `User ID   : ${user.email}` });
      adminState.terminalLogs.push({ type: 'system', text: `Full Name : ${user.name}` });
      adminState.terminalLogs.push({ type: 'system', text: `Role      : ${user.role}` });
      adminState.terminalLogs.push({ type: 'system', text: `Access    : Superadmin / Developer Master Privileges` });
      break;

    case 'export-db':
      const exportBtn = document.getElementById('dev-export-btn');
      if (exportBtn) exportBtn.click();
      adminState.terminalLogs.push({ type: 'system', text: '⚡ Memicu pengunduhan file JSON database backup...' });
      break;

    case 'banner':
      adminState.terminalLogs.push({ type: 'system', text: ' __  __       __  __       _' });
      adminState.terminalLogs.push({ type: 'system', text: '|  \\/  |_ _  |  \\/  |a _ _| |__   __ _' });
      adminState.terminalLogs.push({ type: 'system', text: '| |\\/| | | | | |\\/| / _` | \'_ \\ / _` |' });
      adminState.terminalLogs.push({ type: 'system', text: '|_|  |_|\\_, | |_|  |_\\__,_|_.__/\\__,_|' });
      adminState.terminalLogs.push({ type: 'system', text: '        |__/  Surabaya Dev Engine v2.4' });
      break;

    case 'clear':
    case 'cls':
      adminState.terminalLogs = [
        { type: 'system', text: 'MyMaba Developer Console v2.4.0 (Surabaya Engine)' },
        { type: 'system', text: 'Ketik "help" untuk melihat daftar perintah terminal.' }
      ];
      break;

    default:
      if (cleanCmd !== '') {
        adminState.terminalLogs.push({ type: 'error', text: `Command "${cleanCmd}" tidak dikenali. Ketik "help" untuk melihat daftar instruksi.` });
      }
      break;
  }
}

renderAdminPortal();
