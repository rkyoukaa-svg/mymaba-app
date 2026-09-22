import { authenticateUser, setAuthUser, getRememberedEmail, MOCK_USERS, logActivity } from '../utils/storage.js';

export function renderLoginModal() {
  const rememberedEmail = getRememberedEmail();
  const isRemembered = Boolean(rememberedEmail);

  return `
    <div class="modal-overlay active" id="login-modal">
      <div class="modal-container login-modal-box" style="max-width: 480px; border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--card-shadow-hover);">
        
        <!-- Modal Header with Red-Gold Gradient -->
        <div class="popup-anim-1" style="background: var(--red-gradient); padding: 2rem 2rem 1.8rem; color: white; border-bottom: 2px solid var(--gold-accent); position: relative;">
          <button class="modal-close-btn animated-close-btn" id="close-login-modal-btn" style="background: rgba(255,255,255,0.15); color: white;" title="Tutup">
            <i data-lucide="x" style="width:20px; height:20px;"></i>
          </button>

          <div class="badge-gold" style="margin-bottom: 0.6rem;">
            <i data-lucide="shield-check" style="width:14px; height:14px;"></i>
            Portal Autentikasi MyMaba
          </div>
          <h2 class="font-serif" style="font-size: 1.85rem; font-weight: 800; line-height: 1.2;">
            Masuk ke Akun Anda
          </h2>
          <p style="font-size: 0.88rem; opacity: 0.9; margin-top: 0.35rem;">
            Akses rekomendasi kos, kuliner & kebutuhan maba Surabaya secara personalized.
          </p>
        </div>

        <!-- Modal Body & Form -->
        <div style="padding: 2rem 2rem 2.2rem; background: var(--pure-white);">
          
          <!-- Dynamic Alert Feedback Container (Hidden by default or shown on result) -->
          <div id="login-feedback-alert" class="login-alert" style="display: none; margin-bottom: 1.25rem;"></div>

          <form id="login-form">
            <!-- Email Input -->
            <div class="form-group" style="margin-bottom: 1.2rem;">
              <label class="form-label" for="login-email" style="display:flex; align-items:center; justify-content:space-between;">
                <span>Email Mahasiswa / Pengguna *</span>
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Contoh: maba@mymaba.ac.id</span>
              </label>
              <div class="input-with-icon" style="position: relative;">
                <i data-lucide="mail" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="login-email" 
                  class="form-control" 
                  style="padding-left: 2.7rem;" 
                  placeholder="masukkan email anda" 
                  value="${rememberedEmail}"
                  required 
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="form-group" style="margin-bottom: 1.2rem;">
              <label class="form-label" for="login-password">Password *</label>
              <div class="input-with-icon" style="position: relative;">
                <i data-lucide="lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-muted);"></i>
                <input 
                  type="password" 
                  id="login-password" 
                  class="form-control" 
                  style="padding-left: 2.7rem; padding-right: 2.7rem;" 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" id="toggle-password-btn" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px;" title="Tampilkan/Sembunyikan Password">
                  <i data-lucide="eye" style="width: 18px; height: 18px;"></i>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password Row -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-size: 0.88rem;">
              <label class="remember-me-checkbox" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none;">
                <input 
                  type="checkbox" 
                  id="login-remember-me" 
                  ${isRemembered ? 'checked' : ''} 
                  style="width: 17px; height: 17px; accent-color: var(--primary-red); cursor: pointer;"
                />
                <span style="font-weight: 600; color: var(--text-primary);">Ingat Saya (Remember Me)</span>
              </label>
              
              <a href="#" id="forgot-password-link" style="color: var(--primary-red); text-decoration: none; font-weight: 600; font-size: 0.82rem;">
                Lupa Password?
              </a>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary shiny-btn" id="login-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 1rem; justify-content: center; box-shadow: var(--card-shadow);">
              <i data-lucide="log-in" style="width: 18px; height: 18px;"></i>
              <span>Masuk Sekarang</span>
            </button>
          </form>

          <!-- Divider -->
          <div style="display: flex; align-items: center; margin: 1.5rem 0 1.2rem; color: var(--text-muted); font-size: 0.8rem;">
            <div style="flex: 1; height: 1px; background: var(--border-light);"></div>
            <span style="padding: 0 0.8rem; font-weight: 600;">AKUN UJI COBA (DEMO ACCOUNTS)</span>
            <div style="flex: 1; height: 1px; background: var(--border-light);"></div>
          </div>

          <!-- Quick Fill Demo Credentials -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.6rem;">
            ${MOCK_USERS.map(u => `
              <button 
                type="button" 
                class="btn-demo-account" 
                data-demo-email="${u.email}" 
                data-demo-pass="${u.password}"
                style="padding: 0.5rem 0.6rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--off-white); font-size: 0.78rem; text-align: left; cursor: pointer; transition: var(--transition);"
              >
                <div style="font-weight: 700; color: var(--primary-red); display: flex; align-items: center; gap: 4px;">
                  <span>${u.avatar}</span>
                  <span>${u.name.split(' ')[0]}</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${u.email}
                </div>
              </button>
            `).join('')}
          </div>

        </div>
      </div>
    </div>
  `;
}

export function initLoginModalEvents(onLoginSuccess, onClose) {
  const modalOverlay = document.getElementById('login-modal');
  const closeBtn = document.getElementById('close-login-modal-btn');
  const loginForm = document.getElementById('login-form');
  const feedbackAlert = document.getElementById('login-feedback-alert');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const rememberCheckbox = document.getElementById('login-remember-me');
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const forgotLink = document.getElementById('forgot-password-link');

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

  // Toggle Password Visibility
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePassBtn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" style="width:18px; height:18px;"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Demo Accounts Quick Click
  document.querySelectorAll('.btn-demo-account').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-demo-email');
      const pass = btn.getAttribute('data-demo-pass');
      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = pass;
      
      // Clear previous error styles
      if (feedbackAlert) feedbackAlert.style.display = 'none';
      if (emailInput) emailInput.style.borderColor = 'var(--border-light)';
      if (passwordInput) passwordInput.style.borderColor = 'var(--border-light)';
    });
  });

  // Forgot password helper prompt
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('ℹ️ Petunjuk Lupa Password:\n\nGunakan salah satu akun demo berikut untuk mencoba:\n1. Email: 26410100064@dinamika.ac.id | Password: SSKyoukaa22\n2. Email: maba@mymaba.ac.id | Password: maba123\n3. Email: mahasiswa@its.ac.id | Password: its2026\n4. Email: admin@mymaba.ac.id | Password: admin123');
    });
  }

  // Form Submit & Validation Handling
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

      // Reset style indicators
      emailInput.style.borderColor = 'var(--border-light)';
      passwordInput.style.borderColor = 'var(--border-light)';

      // Perform authentication check
      const authResult = authenticateUser(email, password);

      if (authResult.success) {
        // ==========================================
        // 1. PETUNJUK LOGIN BERHASIL (SUCCESS NOTICE)
        // ==========================================
        setAuthUser(authResult.user, rememberMe);
        logActivity(authResult.user.email, authResult.user.name, authResult.user.role, 'LOGIN', 'Berhasil login melalui Web App', 'success');

        if (feedbackAlert) {
          feedbackAlert.className = 'login-alert login-alert-success';
          feedbackAlert.style.display = 'block';
          feedbackAlert.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:0.75rem; background:rgba(34, 197, 94, 0.12); border:1.5px solid #22c55e; color:#15803d; padding:0.9rem 1rem; border-radius:var(--radius-md); font-size:0.88rem;">
              <i data-lucide="check-circle" style="width:20px; height:20px; flex-shrink:0; margin-top:2px;"></i>
              <div>
                <strong style="display:block; font-size:0.95rem;">Login Berhasil!</strong>
                <span>Selamat datang kembali, <b>${authResult.user.name}</b> (${authResult.user.role}).<sup>${rememberMe ? ' [Ingat Saya Aktif]' : ''}</sup></span>
              </div>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
        }

        // Close modal after brief feedback animation delay
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(authResult.user);
        }, 800);

      } else {
        // ==============================================
        // 2. PETUNJUK LOGIN TIDAK BERHASIL (FAILURE NOTICE)
        // ==============================================
        logActivity(email || 'unknown@guest.com', 'Pengunjung Tidak Dikenal', 'Tamu', 'LOGIN_FAILED', 'Percobaan login gagal: Kredensial tidak cocok', 'warning');

        if (feedbackAlert) {
          feedbackAlert.className = 'login-alert login-alert-error shake-animation';
          feedbackAlert.style.display = 'block';
          feedbackAlert.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:0.75rem; background:rgba(239, 68, 68, 0.12); border:1.5px solid #ef4444; color:#b91c1c; padding:0.9rem 1rem; border-radius:var(--radius-md); font-size:0.88rem;">
              <i data-lucide="alert-triangle" style="width:20px; height:20px; flex-shrink:0; margin-top:2px;"></i>
              <div>
                <strong style="display:block; font-size:0.95rem;">Login Tidak Berhasil!</strong>
                <span>${authResult.message}</span>
              </div>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
        }

        // Highlight input fields with red error ring
        if (emailInput) emailInput.style.borderColor = '#ef4444';
        if (passwordInput) passwordInput.style.borderColor = '#ef4444';
      }
    });
  }
}
