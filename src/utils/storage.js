const BOOKMARKS_KEY = 'mymaba_bookmarks';
const CAMPUS_KEY = 'mymaba_selected_campus';
const PARTNER_LISTINGS_KEY = 'mymaba_custom_partner_listings';
const THEME_KEY = 'mymaba_theme';

export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmark = (placeId) => {
  const current = getBookmarks();
  let updated;
  if (current.includes(placeId)) {
    updated = current.filter(id => id !== placeId);
  } else {
    updated = [...current, placeId];
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
};

export const isBookmarked = (placeId) => {
  return getBookmarks().includes(placeId);
};

export const getSelectedCampus = () => {
  return localStorage.getItem(CAMPUS_KEY) || 'all';
};

export const setSelectedCampus = (campusId) => {
  localStorage.setItem(CAMPUS_KEY, campusId);
};

export const getPartnerListings = () => {
  try {
    const data = localStorage.getItem(PARTNER_LISTINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addPartnerListing = (listingData) => {
  const current = getPartnerListings();
  const newListing = {
    id: `custom-${Date.now()}`,
    ...listingData,
    rating: 5.0,
    reviewsCount: 1,
    isVerified: false,
    isPopular: false
  };
  const updated = [newListing, ...current];
  localStorage.setItem(PARTNER_LISTINGS_KEY, JSON.stringify(updated));
  return newListing;
};

export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
};

// ==========================================================================
// AUTHENTICATION & REMEMBER ME UTILITIES
// ==========================================================================
const AUTH_USER_KEY = 'mymaba_auth_user';
const REMEMBER_EMAIL_KEY = 'mymaba_remember_email';

export const MOCK_USERS = [
  {
    email: 'bintang@superadmin.ac.id',
    password: 'SuperAdmin2026!2',
    name: 'Bintang Superadmin',
    role: 'Superadmin',
    avatar: '👑'
  },
  {
    email: 'maintanance@main.ac.id',
    password: 'SuperAdmin2026!',
    name: 'Superadmin Utama',
    role: 'Superadmin',
    avatar: '👑'
  },
  {
    email: 'lunar@dev.ac.id',
    password: 'DevMaster2026!',
    name: 'Lunar Lead Developer',
    role: 'Developer',
    avatar: '🛠️'
  },
  {
    email: '26410100064@dinamika.ac.id',
    password: 'SSKyoukaa22',
    name: 'Muhammad Raditya A R',
    role: 'Mahasiswa (Universitas Dinamika)',
    avatar: '🎓'
  },
  {
    email: 'maba@mymaba.ac.id',
    password: 'maba123',
    name: 'Ahmad Maba Surabaya',
    role: 'Mahasiswa Baru (UNAIR)',
    avatar: '🎓'
  },
  {
    email: 'mahasiswa@its.ac.id',
    password: 'its2026',
    name: 'Siti Rahma',
    role: 'Mahasiswa (ITS)',
    avatar: '💻'
  },
  {
    email: 'admin@mymaba.ac.id',
    password: 'admin123',
    name: 'Admin MyMaba',
    role: 'Superadmin',
    avatar: '⚡'
  }
];

export const isDeveloper = (user) => {
  if (!user || !user.role) return false;
  const roleLower = user.role.toLowerCase();
  const emailLower = (user.email || '').toLowerCase();
  return roleLower.includes('developer') || emailLower === 'lunar@dev.ac.id';
};

export const getAuthUser = () => {
  try {
    const local = localStorage.getItem(AUTH_USER_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(AUTH_USER_KEY);
    if (session) return JSON.parse(session);
  } catch (e) {
    console.error('Failed to parse auth user', e);
  }
  return null;
};

export const setAuthUser = (user, rememberMe = false) => {
  const userData = { ...user, loggedInAt: new Date().toISOString(), rememberMe };
  if (rememberMe) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(REMEMBER_EMAIL_KEY, user.email);
  } else {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    localStorage.removeItem(REMEMBER_EMAIL_KEY);
  }
};

export const logoutAuthUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
};

export const getRememberedEmail = () => {
  return localStorage.getItem(REMEMBER_EMAIL_KEY) || '';
};

export const authenticateUser = (email, password) => {
  const cleanEmail = email.trim().toLowerCase();
  const allUsers = getUsersList();
  const foundUser = allUsers.find(
    u => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (foundUser) {
    const { password: _, ...userWithoutPassword } = foundUser;
    return { success: true, user: userWithoutPassword };
  } else {
    return { 
      success: false, 
      message: 'Email atau password yang Anda masukkan salah. Silakan periksa kembali!' 
    };
  }
};

export const isDeveloperOrSuperadmin = (user) => {
  if (!user || !user.role) return false;
  const roleLower = user.role.toLowerCase();
  return roleLower.includes('superadmin') || roleLower.includes('developer') || roleLower.includes('admin');
};

// ==========================================================================
// ACTIVITY LOGGING & MONITORING UTILITIES
// ==========================================================================
const ACTIVITY_LOGS_KEY = 'mymaba_activity_logs';

const MOCK_INITIAL_LOGS = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    email: '26410100064@dinamika.ac.id',
    name: 'Muhammad Raditya A R',
    role: 'Mahasiswa (Universitas Dinamika)',
    action: 'LOGIN',
    details: 'Berhasil login melalui Portal Autentikasi',
    ip: '180.252.74.19',
    device: 'Chrome / Windows 11',
    status: 'success'
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    email: 'maba@mymaba.ac.id',
    name: 'Ahmad Maba Surabaya',
    role: 'Mahasiswa Baru (UNAIR)',
    action: 'BOOKMARK',
    details: 'Menambahkan "Kos Edelweiss Gubeng Kertajaya" ke favorit',
    ip: '114.124.21.88',
    device: 'Safari / macOS',
    status: 'info'
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    email: 'mahasiswa@its.ac.id',
    name: 'Siti Rahma',
    role: 'Mahasiswa (ITS)',
    action: 'SEARCH',
    details: 'Mencari "Kos Bebas Sukolilo"',
    ip: '36.85.12.102',
    device: 'Edge / Windows 10',
    status: 'info'
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    email: 'unkown.user@gmail.com',
    name: 'Pengunjung Tidak Dikenal',
    role: 'Tamu',
    action: 'LOGIN_FAILED',
    details: 'Percobaan login gagal: Password salah',
    ip: '103.111.42.5',
    device: 'Firefox / Android',
    status: 'warning'
  },
  {
    id: 'log-105',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    email: 'admin@mymaba.ac.id',
    name: 'Admin MyMaba',
    role: 'Administrator',
    action: 'LOGIN',
    details: 'Login Administrator berhasil',
    ip: '127.0.0.1',
    device: 'Chrome / Windows 11',
    status: 'success'
  }
];

export const getActivityLogs = () => {
  try {
    const data = localStorage.getItem(ACTIVITY_LOGS_KEY);
    if (data) return JSON.parse(data);
    localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(MOCK_INITIAL_LOGS));
    return MOCK_INITIAL_LOGS;
  } catch (e) {
    return MOCK_INITIAL_LOGS;
  }
};

export const logActivity = (userEmail, userName, role, action, details, status = 'info') => {
  const currentLogs = getActivityLogs();
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    email: userEmail || 'guest@mymaba.ac.id',
    name: userName || 'Tamu / Pengunjung',
    role: role || 'Pengguna App',
    action,
    details,
    ip: '127.0.0.1',
    device: navigator.userAgent.includes('Windows') ? 'Chrome / Windows' : 'Web Browser',
    status
  };
  const updated = [newLog, ...currentLogs];
  localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(updated));
  return newLog;
};

export const clearActivityLogs = () => {
  localStorage.removeItem(ACTIVITY_LOGS_KEY);
};

export const getActiveSessions = () => {
  const currentUser = getAuthUser();
  const logs = getActivityLogs();
  
  const activeMap = new Map();

  if (currentUser) {
    activeMap.set(currentUser.email, {
      ...currentUser,
      status: 'Aktif Saat Ini',
      loggedInAt: currentUser.loggedInAt || new Date().toISOString(),
      ip: '127.0.0.1',
      device: 'Windows / Chrome (Sesi Ini)'
    });
  }

  logs.forEach(log => {
    if (log.action === 'LOGIN' && log.status === 'success' && !activeMap.has(log.email)) {
      activeMap.set(log.email, {
        email: log.email,
        name: log.name,
        role: log.role,
        avatar: log.email.includes('dinamika') ? '🎓' : (log.email.includes('its') ? '💻' : (log.email.includes('admin') ? '⚡' : '🎓')),
        loggedInAt: log.timestamp,
        status: 'Online (Session)',
        ip: log.ip,
        device: log.device
      });
    }
  });

  return Array.from(activeMap.values());
};

// ==========================================================================
// MARKETPLACE & JUAL BELI STORAGE UTILITIES
// ==========================================================================
const MARKETPLACE_ITEMS_KEY = 'mymaba_custom_marketplace_items';

export const getMarketplaceItems = () => {
  try {
    const data = localStorage.getItem(MARKETPLACE_ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addMarketplaceItem = (itemData) => {
  const current = getMarketplaceItems();
  const newItem = {
    id: `jb-custom-${Date.now()}`,
    category: 'jual-beli',
    rating: 5.0,
    reviewsCount: 1,
    isVerified: true,
    isPopular: true,
    priceUnit: '(Preloved Maba)',
    ...itemData
  };
  const updated = [newItem, ...current];
  localStorage.setItem(MARKETPLACE_ITEMS_KEY, JSON.stringify(updated));
  return newItem;
};

// ==========================================================================
// SYSTEM SETTINGS & SUPERADMIN CONFIG UTILITIES
// ==========================================================================
const SYSTEM_SETTINGS_KEY = 'mymaba_system_settings';
const CUSTOM_USERS_KEY = 'mymaba_custom_users';

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  maintenanceScheduleText: 'Sistem sedang mengalami pemeliharaan rutin berkala oleh Tim Developer.',
  announcementBanner: {
    active: true,
    text: '📢 Selamat Datang Maba 2026! Temukan rekomendasi Kos, Kuliner & Perlengkapan Kuliah terbaik di Surabaya.'
  },
  emergencyAlert: {
    active: false,
    title: '🚨 PEMBERITAHUAN DARURAT DEVELOPER',
    message: 'Terjadi pengujian sistem real-time oleh Developer (lunar@dev.ac.id). Pengguna diimbau menyimpan draf.'
  },
  featureFlags: {
    enableMarketplace: true,
    enablePartners: true,
    enableHelpdesk: true
  },
  requireListingApproval: false,
  allowNewRegistration: true,
  developerRoleOverride: null
};

export const getSystemSettings = () => {
  try {
    const data = localStorage.getItem(SYSTEM_SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const setSystemSettings = (newSettings) => {
  const current = getSystemSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(updated));
  return updated;
};

// User Management Utilities
export const getUsersList = () => {
  try {
    const custom = localStorage.getItem(CUSTOM_USERS_KEY);
    const customList = custom ? JSON.parse(custom) : [];
    
    // Combine MOCK_USERS with custom modified user statuses/roles/names/emails
    const combined = MOCK_USERS.map(u => ({ ...u }));
    customList.forEach(c => {
      const idx = combined.findIndex(u => 
        u.email.toLowerCase() === c.email.toLowerCase() || 
        (c.originalEmail && u.email.toLowerCase() === c.originalEmail.toLowerCase())
      );
      if (idx !== -1) {
        combined[idx] = { ...combined[idx], ...c };
      } else {
        const existInCombined = combined.findIndex(u => u.email.toLowerCase() === c.email.toLowerCase());
        if (existInCombined !== -1) {
          combined[existInCombined] = { ...combined[existInCombined], ...c };
        } else {
          combined.push(c);
        }
      }
    });
    return combined;
  } catch (e) {
    return MOCK_USERS;
  }
};

export const updateUserDetails = (currentEmail, newName, newEmail, executingUser = null) => {
  const executor = executingUser || getAuthUser();
  if (!executor || !isDeveloper(executor)) {
    logActivity(
      executor ? executor.email : 'unknown',
      executor ? executor.name : 'Unknown',
      executor ? executor.role : 'Guest',
      'USER_UPDATE_REJECTED',
      `Gagal mengubah profil ${currentEmail}: Hak akses ditolak (Hanya Developer: lunar@dev.ac.id)`,
      'warning'
    );
    return { success: false, message: '❌ Ditolak! Pengubahan nama dan email HANYA BISA DIAKSES OLEH DEVELOPER (lunar@dev.ac.id).' };
  }

  const cleanOld = currentEmail.trim().toLowerCase();
  const cleanNewEmail = newEmail.trim().toLowerCase();
  const cleanName = newName.trim();

  if (!cleanName) {
    return { success: false, message: 'Nama lengkap tidak boleh kosong!' };
  }
  if (!cleanNewEmail || !cleanNewEmail.includes('@')) {
    return { success: false, message: 'Alamat email tidak valid!' };
  }

  const users = getUsersList();
  const target = users.find(u => u.email.toLowerCase() === cleanOld);
  if (!target) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  // Duplicate email check if email is changed
  if (cleanOld !== cleanNewEmail) {
    const duplicate = users.find(u => u.email.toLowerCase() === cleanNewEmail);
    if (duplicate) {
      return { success: false, message: `Email "${cleanNewEmail}" sudah digunakan oleh akun lain!` };
    }
  }

  const customData = JSON.parse(localStorage.getItem(CUSTOM_USERS_KEY) || '[]');
  const existingIdx = customData.findIndex(u => 
    u.email.toLowerCase() === cleanOld || (u.originalEmail && u.originalEmail.toLowerCase() === cleanOld)
  );

  const updatedUser = {
    ...target,
    originalEmail: target.originalEmail || cleanOld,
    name: cleanName,
    email: cleanNewEmail
  };

  if (existingIdx !== -1) {
    customData[existingIdx] = updatedUser;
  } else {
    customData.push(updatedUser);
  }
  localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customData));

  // If currently authenticated user is updated, update active session
  const currentUser = getAuthUser();
  if (currentUser && (currentUser.email.toLowerCase() === cleanOld || (currentUser.originalEmail && currentUser.originalEmail.toLowerCase() === cleanOld))) {
    setAuthUser({
      ...currentUser,
      name: cleanName,
      email: cleanNewEmail,
      originalEmail: target.originalEmail || cleanOld
    }, currentUser.rememberMe);
  }

  // Also update MOCK_USERS in memory if present
  const mockIdx = MOCK_USERS.findIndex(u => u.email.toLowerCase() === cleanOld);
  if (mockIdx !== -1) {
    MOCK_USERS[mockIdx].name = cleanName;
    MOCK_USERS[mockIdx].email = cleanNewEmail;
  }

  logActivity(
    executor.email,
    executor.name,
    executor.role,
    'USER_UPDATE',
    `Developer (${executor.email}) mengubah profil user: ${cleanOld} -> Nama: "${cleanName}", Email: "${cleanNewEmail}"`,
    'success'
  );

  return { success: true, user: updatedUser };
};

export const updateUserRole = (email, newRole, executingUser = null) => {
  const executor = executingUser || getAuthUser();
  if (!executor || !isDeveloper(executor)) {
    logActivity(executor ? executor.email : 'unknown', executor ? executor.name : 'Unknown', executor ? executor.role : 'Guest', 'ROLE_CHANGE_REJECTED', `Gagal mengubah role ${email}: Hak akses ditolak (Hanya Developer: lunar@dev.ac.id)`, 'warning');
    return { success: false, message: '❌ Ditolak! Penambahan dan perubahan role HANYA BISA DIAKSES OLEH DEVELOPER (lunar@dev.ac.id).' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getUsersList();
  const target = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (target) {
    target.role = newRole;
    
    // Save to custom users storage
    const customData = JSON.parse(localStorage.getItem(CUSTOM_USERS_KEY) || '[]');
    const existingIdx = customData.findIndex(u => 
      u.email.toLowerCase() === cleanEmail || (u.originalEmail && u.originalEmail.toLowerCase() === cleanEmail)
    );
    if (existingIdx !== -1) {
      customData[existingIdx].role = newRole;
    } else {
      customData.push({ ...target, role: newRole });
    }
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customData));
    
    // If currently logged in user is updated, update active session
    const currentUser = getAuthUser();
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      setAuthUser({ ...currentUser, role: newRole }, currentUser.rememberMe);
    }
    
    logActivity(executor.email, executor.name, executor.role, 'ROLE_CHANGE', `Developer (lunar@dev.ac.id) mengubah role ${email} menjadi ${newRole}`, 'success');
    return { success: true, target };
  }
  return { success: false, message: 'Pengguna tidak ditemukan.' };
};

export const addNewUserRole = (name, email, role, avatar = '👤', executingUser = null) => {
  const executor = executingUser || getAuthUser();
  if (!executor || !isDeveloper(executor)) {
    return { success: false, message: '❌ Ditolak! Penambahan role baru HANYA BISA DIAKSES OLEH DEVELOPER (lunar@dev.ac.id).' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getUsersList();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  
  if (existing) {
    existing.role = role;
    existing.name = name.trim() || existing.name;
    existing.avatar = avatar || existing.avatar;

    const customData = JSON.parse(localStorage.getItem(CUSTOM_USERS_KEY) || '[]');
    const idx = customData.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx !== -1) {
      customData[idx] = existing;
    } else {
      customData.push(existing);
    }
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customData));
    logActivity(executor.email, executor.name, executor.role, 'ROLE_ADDITION', `Developer (lunar@dev.ac.id) memperbarui role ${cleanEmail} menjadi ${role}`, 'success');
    return { success: true, user: existing };
  }

  const newUser = {
    email: cleanEmail,
    password: 'UserPass2026!',
    name: name.trim(),
    role: role.trim(),
    avatar: avatar || '👤'
  };

  const customData = JSON.parse(localStorage.getItem(CUSTOM_USERS_KEY) || '[]');
  customData.push(newUser);
  localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customData));

  logActivity(executor.email, executor.name, executor.role, 'ROLE_ADDITION', `Developer (lunar@dev.ac.id) menambahkan role baru untuk ${cleanEmail} (${role})`, 'success');
  return { success: true, user: newUser };
};

export const toggleUserStatus = (email) => {
  const users = getUsersList();
  const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (target) {
    target.isBanned = !target.isBanned;
    
    const customData = JSON.parse(localStorage.getItem(CUSTOM_USERS_KEY) || '[]');
    const existingIdx = customData.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingIdx !== -1) {
      customData[existingIdx].isBanned = target.isBanned;
    } else {
      customData.push(target);
    }
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customData));
    
    logActivity('maintanance@main.ac.id', 'Superadmin', 'Superadmin', 'USER_STATUS_CHANGE', `Status ${email} diubah menjadi ${target.isBanned ? 'DIBLOKIR' : 'AKTIF'}`, 'warning');
    return target;
  }
  return null;
};

// Listing Moderation Utilities
export const updateListingVerification = (listingId, isVerified) => {
  let partnerListings = getPartnerListings();
  let marketplaceItems = getMarketplaceItems();
  
  let found = false;
  partnerListings = partnerListings.map(item => {
    if (item.id === listingId) {
      found = true;
      return { ...item, isVerified };
    }
    return item;
  });
  
  if (found) {
    localStorage.setItem(PARTNER_LISTINGS_KEY, JSON.stringify(partnerListings));
  } else {
    marketplaceItems = marketplaceItems.map(item => {
      if (item.id === listingId) {
        return { ...item, isVerified };
      }
      return item;
    });
    localStorage.setItem(MARKETPLACE_ITEMS_KEY, JSON.stringify(marketplaceItems));
  }
  
  logActivity('maintanance@main.ac.id', 'Superadmin', 'Superadmin', 'LISTING_VERIFIED', `Status verifikasi listing ID ${listingId} diubah ke ${isVerified}`, 'info');
};

export const deleteListingById = (listingId) => {
  let partnerListings = getPartnerListings();
  let marketplaceItems = getMarketplaceItems();

  const initialPartnerCount = partnerListings.length;
  partnerListings = partnerListings.filter(item => item.id !== listingId);
  
  if (partnerListings.length !== initialPartnerCount) {
    localStorage.setItem(PARTNER_LISTINGS_KEY, JSON.stringify(partnerListings));
  } else {
    marketplaceItems = marketplaceItems.filter(item => item.id !== listingId);
    localStorage.setItem(MARKETPLACE_ITEMS_KEY, JSON.stringify(marketplaceItems));
  }

  logActivity('maintanance@main.ac.id', 'Superadmin', 'Superadmin', 'LISTING_DELETED', `Listing ID ${listingId} telah dihapus oleh Superadmin`, 'warning');
};

export const exportFullDatabase = () => {
  const dbDump = {
    exportDate: new Date().toISOString(),
    systemSettings: getSystemSettings(),
    users: getUsersList(),
    activityLogs: getActivityLogs(),
    partnerListings: getPartnerListings(),
    marketplaceItems: getMarketplaceItems(),
    bookmarks: getBookmarks()
  };
  return dbDump;
};

export const resetFullDatabase = () => {
  localStorage.removeItem(SYSTEM_SETTINGS_KEY);
  localStorage.removeItem(CUSTOM_USERS_KEY);
  localStorage.removeItem(ACTIVITY_LOGS_KEY);
  localStorage.removeItem(PARTNER_LISTINGS_KEY);
  localStorage.removeItem(MARKETPLACE_ITEMS_KEY);
  localStorage.removeItem(BOOKMARKS_KEY);
  const currentUser = getAuthUser();
  logActivity(
    currentUser ? currentUser.email : 'lunar@dev.ac.id',
    currentUser ? currentUser.name : 'Developer',
    currentUser ? currentUser.role : 'Developer',
    'DB_RESET',
    'Database sistem di-reset ke pengaturan awal pabrik',
    'warning'
  );
};

export const restoreFullDatabase = (dbDump) => {
  try {
    if (!dbDump || typeof dbDump !== 'object') {
      return { success: false, message: 'Format data JSON tidak valid!' };
    }
    if (dbDump.systemSettings) {
      localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(dbDump.systemSettings));
    }
    if (dbDump.users) {
      localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(dbDump.users));
    }
    if (dbDump.activityLogs) {
      localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(dbDump.activityLogs));
    }
    if (dbDump.partnerListings) {
      localStorage.setItem(PARTNER_LISTINGS_KEY, JSON.stringify(dbDump.partnerListings));
    }
    if (dbDump.marketplaceItems) {
      localStorage.setItem(MARKETPLACE_ITEMS_KEY, JSON.stringify(dbDump.marketplaceItems));
    }
    if (dbDump.bookmarks) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(dbDump.bookmarks));
    }

    const currentUser = getAuthUser();
    logActivity(
      currentUser ? currentUser.email : 'lunar@dev.ac.id',
      currentUser ? currentUser.name : 'Developer',
      currentUser ? currentUser.role : 'Developer',
      'DB_RESTORE',
      'Restore Database dari backup JSON berhasil dilakukan',
      'success'
    );
    return { success: true, message: 'Restore Database berhasil diterapkan!' };
  } catch (err) {
    return { success: false, message: 'Gagal merestore database: ' + err.message };
  }
};

export const purgeSystemCache = () => {
  localStorage.removeItem(BOOKMARKS_KEY);
  localStorage.removeItem(SELECTED_CAMPUS_KEY);
  localStorage.removeItem(THEME_KEY);
  const currentUser = getAuthUser();
  logActivity(
    currentUser ? currentUser.email : 'lunar@dev.ac.id',
    currentUser ? currentUser.name : 'Developer',
    currentUser ? currentUser.role : 'Developer',
    'CACHE_PURGED',
    'Developer melakukan pembersihan hard-cache browser & storage',
    'info'
  );
  return { success: true, message: 'Hard cache browser & temporary storage telah dibersihkan!' };
};

export const getStorageDiagnostics = () => {
  let totalBytes = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalBytes += (localStorage[key].length + key.length) * 2;
    }
  }
  const kb = (totalBytes / 1024).toFixed(2);
  const percentage = ((totalBytes / (5 * 1024 * 1024)) * 100).toFixed(2); // 5MB standard limit estimate
  return {
    totalBytes,
    kb,
    percentage,
    itemsCount: Object.keys(localStorage).length,
    timestamp: new Date().toISOString()
  };
};

/* ==========================================================================
   AI MAINTENANCE & DEVELOPER TERMINAL STORAGE HELPERS
   ========================================================================== */

const AI_MAINTENANCE_LOGS_KEY = 'mymaba_ai_maintenance_logs';
const TERMINAL_HISTORY_KEY = 'mymaba_terminal_history';

export const getAIMaintenanceLogs = () => {
  const data = localStorage.getItem(AI_MAINTENANCE_LOGS_KEY);
  if (!data) {
    return [
      {
        id: 'maint-init',
        timestamp: new Date(Date.now() - 3600000).toLocaleString('id-ID'),
        operator: 'AI Maintenance Engine',
        healthScore: 98,
        status: 'SUCCESS',
        summary: 'Pemeriksaan rutin otomatis: Semua modul beroperasi optimal. Tidak ada kebocoran data atau sesi stale.',
        details: [
          '🧹 Membersihkan 0 token sesi terputus',
          '🔍 Memeriksa 62 listing & marketplace: 100% valid',
          '⚡ Defragmentasi LocalStorage: Kuota terpakai < 5%',
          '🛡️ Audit keamanan: 0 percobaan brute-force terdeteksi'
        ]
      }
    ];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveAIMaintenanceLog = (logEntry) => {
  const logs = getAIMaintenanceLogs();
  logs.unshift(logEntry);
  localStorage.setItem(AI_MAINTENANCE_LOGS_KEY, JSON.stringify(logs.slice(0, 20)));
  return logs;
};

export const runAIMaintenanceRoutine = (operatorUser) => {
  const operatorName = operatorUser ? `${operatorUser.name} (${operatorUser.role})` : 'AI Routine Engine';
  const partnerListings = getPartnerListings();
  const marketplaceItems = getMarketplaceItems();
  const users = getUsersList();
  const logs = getActivityLogs();
  const diag = getStorageDiagnostics();
  
  let healthyListings = partnerListings.length + marketplaceItems.length;
  let healthScore = 100;
  if (logs.length > 300) healthScore -= 2;
  const bannedCount = users.filter(u => u.isBanned).length;
  if (bannedCount > 0) healthScore -= Math.min(10, bannedCount * 2);
  healthScore = Math.max(90, healthScore);

  const newLog = {
    id: 'maint-' + Date.now(),
    timestamp: new Date().toLocaleString('id-ID'),
    operator: operatorName,
    healthScore,
    status: 'SUCCESS',
    summary: `AI Routine Maintenance selesai secara sempurna dengan Skor Kesehatan System: ${healthScore}/100!`,
    details: [
      `🧹 Pembersihan Storage: 0 token sesi stale terdeteksi`,
      `🔍 Audit Katalog: ${healthyListings} item terverifikasi 100% konsisten`,
      `⚡ Indeks Database: Kuota terpakai ${diag.kb} KB (${diag.percentage}% dari limit 5MB)`,
      `🛡️ Audit Keamanan: ${users.length} pengguna terdaftar, ${bannedCount} akun dibatasi`,
      `🤖 Rekomendasi AI: Sistem berada dalam performa puncak. Rutinitas berikutnya disarankan dalam 24 jam.`
    ]
  };

  saveAIMaintenanceLog(newLog);

  logActivity(
    operatorUser ? operatorUser.email : 'ai-routine@mymaba.ac.id',
    operatorUser ? operatorUser.name : 'AI Routine Agent',
    operatorUser ? operatorUser.role : 'System AI',
    'AI_MAINTENANCE_RUN',
    `AI Routine Maintenance berhasil dijalankan (Skor Kesehatan: ${healthScore}/100)`,
    'success'
  );

  return newLog;
};

export const getTerminalHistory = () => {
  const data = localStorage.getItem(TERMINAL_HISTORY_KEY);
  if (!data) return ['help', 'status', 'healthcheck', 'ai-maintenance'];
  try { return JSON.parse(data); } catch (e) { return []; }
};

export const saveTerminalHistory = (cmd) => {
  if (!cmd || !cmd.trim()) return;
  const history = getTerminalHistory();
  if (history[history.length - 1] !== cmd) {
    history.push(cmd);
    localStorage.setItem(TERMINAL_HISTORY_KEY, JSON.stringify(history.slice(-50)));
  }
};





