/* ═══════════════════════════════════════════════════════════
   SmartDash — app.js
   Pure Vanilla JavaScript — No frameworks, no dependencies
   Handles: Auth, Routing, Portals, Favorites, Search,
            Theme, OTP, QR Generator, AI Chat, Animations
═══════════════════════════════════════════════════════════ */

'use strict';

// ── App State ──────────────────────────────────────────────
const STATE = {
  user: null,
  isDark: true,
  favorites: JSON.parse(localStorage.getItem('sd_favorites') || '[]'),
  recent: JSON.parse(localStorage.getItem('sd_recent') || '[]'),
  currentPage: 'dashboard',
  otpInterval: null,
  otpSeconds: 300,
};

// ── Portal Data ────────────────────────────────────────────
const PORTALS = {
  government: [
    { id:'aadhaar',   name:'Aadhaar',       url:'https://uidai.gov.in',            icon:'🪪', color:'#ff8f00' },
    { id:'pan',       name:'PAN Portal',    url:'https://www.incometax.gov.in',    icon:'📄', color:'#1565c0' },
    { id:'digilocker',name:'DigiLocker',    url:'https://digilocker.gov.in',       icon:'🔒', color:'#2e7d32' },
    { id:'passport',  name:'Passport Seva', url:'https://passportindia.gov.in',   icon:'🛂', color:'#4527a0' },
    { id:'incometax', name:'Income Tax',    url:'https://www.incometax.gov.in',    icon:'💰', color:'#00695c' },
    { id:'gst',       name:'GST Portal',    url:'https://www.gst.gov.in',          icon:'🧾', color:'#e65100' },
    { id:'epfo',      name:'EPFO',          url:'https://www.epfindia.gov.in',     icon:'👷', color:'#1a237e' },
    { id:'irctc',     name:'IRCTC',         url:'https://www.irctc.co.in',         icon:'🚆', color:'#b71c1c' },
  ],
  banking: [
    { id:'sbi',     name:'SBI',        url:'https://onlinesbi.sbi',         icon:'🏛️', color:'#1565c0' },
    { id:'hdfc',    name:'HDFC Bank',  url:'https://www.hdfcbank.com',      icon:'🔷', color:'#e53935' },
    { id:'icici',   name:'ICICI Bank', url:'https://www.icicibank.com',     icon:'🔶', color:'#ef6c00' },
    { id:'axis',    name:'Axis Bank',  url:'https://www.axisbank.com',      icon:'🔴', color:'#880e4f' },
    { id:'gpay',    name:'Google Pay', url:'https://pay.google.com',        icon:'💳', color:'#4285f4' },
    { id:'phonepe', name:'PhonePe',    url:'https://www.phonepe.com',       icon:'📱', color:'#5f259f' },
    { id:'paytm',   name:'Paytm',      url:'https://paytm.com',             icon:'💵', color:'#002970' },
    { id:'bhim',    name:'BHIM UPI',   url:'https://www.bhimupi.org.in',    icon:'🇮🇳', color:'#ff6f00' },
  ],
  education: [
    { id:'nptel',    name:'NPTEL',       url:'https://nptel.ac.in',             icon:'📚', color:'#1b5e20' },
    { id:'swayam',   name:'SWAYAM',      url:'https://swayam.gov.in',           icon:'🧑‍🎓', color:'#4a148c' },
    { id:'nsp',      name:'Scholarship', url:'https://scholarships.gov.in',     icon:'🏅', color:'#e65100' },
    { id:'diksha',   name:'DIKSHA',      url:'https://diksha.gov.in',           icon:'🏫', color:'#1565c0' },
    { id:'khan',     name:'Khan Academy',url:'https://www.khanacademy.org',     icon:'🦉', color:'#14bf96' },
    { id:'coursera', name:'Coursera',    url:'https://www.coursera.org',        icon:'🎯', color:'#0056d2' },
  ],
  tools: [
    { id:'converter', name:'File Converter',  url:'https://cloudconvert.com',   icon:'🔄', color:'#00838f', tool:true },
    { id:'compress',  name:'PDF Compressor',  url:'https://smallpdf.com',       icon:'📦', color:'#ad1457', tool:true },
    { id:'resize',    name:'Image Resizer',   url:'https://imageresizer.com',   icon:'🖼️', color:'#558b2f', tool:true },
    { id:'qr',        name:'QR Generator',   url:'#',                            icon:'📲', color:'#6a1b9a', tool:true, action:'showQR' },
    { id:'merger',    name:'PDF Merger',      url:'https://smallpdf.com/merge-pdf', icon:'📑', color:'#0277bd', tool:true },
    { id:'ocr',       name:'OCR Scanner',    url:'https://www.onlineocr.net',   icon:'🔍', color:'#f57f17', tool:true },
    { id:'color',     name:'Color Picker',   url:'https://coolors.co',          icon:'🎨', color:'#c62828', tool:true },
    { id:'word',      name:'Word Counter',   url:'https://wordcounter.net',     icon:'📝', color:'#37474f', tool:true },
  ],
  ai: [
    { id:'claude',      name:'Claude AI',   url:'https://claude.ai',             icon:'🧠', color:'#cc785c' },
    { id:'chatgpt',     name:'ChatGPT',     url:'https://chat.openai.com',       icon:'💬', color:'#10a37f' },
    { id:'gemini',      name:'Gemini',      url:'https://gemini.google.com',     icon:'✨', color:'#4285f4' },
    { id:'midjourney',  name:'Midjourney',  url:'https://www.midjourney.com',    icon:'🎨', color:'#7c3aed' },
    { id:'copilot',     name:'MS Copilot',  url:'https://copilot.microsoft.com', icon:'🤝', color:'#0078d4' },
    { id:'perplexity',  name:'Perplexity',  url:'https://www.perplexity.ai',     icon:'🔮', color:'#1fb8cd' },
  ],
  daily: [
    { id:'gmail',    name:'Gmail',         url:'https://mail.google.com',         icon:'📧', color:'#d93025' },
    { id:'gdrive',   name:'Google Drive',  url:'https://drive.google.com',        icon:'☁️', color:'#1a73e8' },
    { id:'youtube',  name:'YouTube',       url:'https://youtube.com',             icon:'▶️', color:'#ff0000' },
    { id:'whatsapp', name:'WhatsApp Web',  url:'https://web.whatsapp.com',        icon:'💬', color:'#25d366' },
    { id:'calendar', name:'Calendar',      url:'https://calendar.google.com',     icon:'📅', color:'#1a73e8' },
    { id:'notion',   name:'Notion',        url:'https://notion.so',               icon:'📋', color:'#666' },
    { id:'github',   name:'GitHub',        url:'https://github.com',              icon:'🐙', color:'#24292e' },
    { id:'linkedin', name:'LinkedIn',      url:'https://linkedin.com',            icon:'💼', color:'#0077b5' },
  ],
};

// All portals flat
const ALL_PORTALS = Object.entries(PORTALS).flatMap(([cat, items]) =>
  items.map(p => ({ ...p, category: cat }))
);

// Notifications data
const NOTIFICATIONS = [
  { icon:'🔔', title:'Welcome to SmartDash!', text:'Your account is ready. Explore India\'s #1 digital workspace.', time:'Just now', unread:true },
  { icon:'✅', title:'OTP Verified Successfully', text:'Your account has been verified and secured.', time:'2 min ago', unread:true },
  { icon:'🏛️', title:'Income Tax deadline reminder', text:'ITR filing deadline: July 31, 2025. File now on Income Tax Portal.', time:'1 hr ago', unread:true },
  { icon:'🔐', title:'New login detected', text:'New sign-in from Chrome on Windows. Was this you?', time:'3 hr ago', unread:false },
  { icon:'📊', title:'Weekly usage report ready', text:'You visited 12 portals this week. View your analytics.', time:'Yesterday', unread:false },
  { icon:'🇮🇳', title:'New government scheme', text:'PM Awas Yojana 2025 applications open. Check eligibility.', time:'2 days ago', unread:false },
];

// AI Chat responses
const AI_RESPONSES = [
  "To access Aadhaar services, visit **uidai.gov.in**. You can update your address, download e-Aadhaar, and link your mobile number.",
  "For income tax filing (ITR), go to **incometax.gov.in**. You'll need your PAN, Aadhaar, and Form 16 from your employer.",
  "IRCTC train bookings can be done at **irctc.co.in**. Create an account, add travellers, and book tickets up to 120 days in advance.",
  "DigiLocker stores your government documents digitally. Link your Aadhaar to automatically get your driving licence, vehicle registration, and more.",
  "For UPI payments, apps like Google Pay, PhonePe, and BHIM are all linked to your bank. Just enter the UPI ID or scan a QR code.",
  "NPTEL offers free certified online courses from IITs and IISc. Great for engineering and technical certifications.",
  "To open a bank account online (zero-balance), try SBI's YONO app or HDFC's digital account opening — requires just your Aadhaar and PAN.",
  "I'm here to help you navigate India's digital services! Ask me about government portals, banking, education, or any tool on SmartDash.",
];

// ── Canvas Particle Background ─────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      a: Math.random() * 0.6 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = STATE.isDark
        ? `rgba(160,200,255,${p.a})`
        : `rgba(99,102,241,${p.a * 0.5})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Auth Functions ─────────────────────────────────────────
function showTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Hide all forms
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  // Show target form
  const map = { login:'loginForm', signup:'signupForm', otp:'otpForm', forgot:'forgotForm' };
  const formEl = document.getElementById(map[tab]);
  if (formEl) formEl.classList.add('active');

  // Show/hide tabs row
  const tabsEl = document.getElementById('authTabs');
  tabsEl.style.display = (tab === 'login' || tab === 'signup') ? 'flex' : 'none';

  clearError();
}

// Tab button click delegation
document.getElementById('authTabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (btn) showTab(btn.dataset.tab);
});

function togglePass(id, btn) {
  const input = document.getElementById(id);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁️'; }
}

// Password strength checker
document.getElementById('signupPass').addEventListener('input', function() {
  const val = this.value;
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const pct = (score / 4) * 100;
  fill.style.width = pct + '%';
  const colors = ['#ef5350','#ffa726','#ffee58','#66bb6a'];
  const labels = ['Too weak','Fair','Good','Strong 💪'];
  fill.style.background = colors[score - 1] || '#ef5350';
  text.textContent = score > 0 ? labels[score - 1] : 'Password strength';
});

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  if (!email) { showError('⚠️ Please enter your email or mobile.'); return; }
  if (!pass)  { showError('⚠️ Please enter your password.'); return; }

  const btn = document.querySelector('#loginForm .btn-primary');
  btn.innerHTML = '<span>⏳ Signing in…</span>';
  btn.disabled = true;

  setTimeout(() => {
    // Demo: accept any credentials
    const name = email.includes('@') ? email.split('@')[0] : 'User';
    loginSuccess({ name: capitalize(name), email, role: 'user' });
  }, 1200);
}

function handleSignup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPass').value;

  if (!name)  { showError('⚠️ Enter your full name.'); return; }
  if (!email) { showError('⚠️ Enter your email address.'); return; }
  if (pass.length < 8) { showError('⚠️ Password must be at least 8 characters.'); return; }

  const btn = document.querySelector('#signupForm .btn-primary');
  btn.innerHTML = '<span>⏳ Creating account…</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>✨ Create Account</span>';
    btn.disabled = false;
    document.getElementById('otpDesc').textContent =
      `Enter the 6-digit OTP sent to ${email}`;
    showOtp('signup');
  }, 1000);
}

function showOtp(from) {
  showTab('otp');
  startOtpTimer();
  // Pre-fill demo OTP hint
  if (from === 'signup') {
    setTimeout(() => {
      const boxes = document.querySelectorAll('.otp-box');
      const demo = '123456';
      boxes.forEach((b, i) => { b.value = demo[i]; b.style.borderColor = 'var(--accent)'; });
    }, 600);
  }
}

function showForgot() { showTab('forgot'); }

// OTP navigation
function otpNext(input, idx) {
  const boxes = document.querySelectorAll('.otp-box');
  if (input.value && idx < 5) boxes[idx + 1].focus();
  if (!input.value && idx > 0 && event.key === 'Backspace') boxes[idx - 1].focus();
}

function startOtpTimer() {
  STATE.otpSeconds = 300;
  clearInterval(STATE.otpInterval);
  const el = document.getElementById('timerCount');
  const resend = document.getElementById('resendBtn');
  resend.disabled = true;

  STATE.otpInterval = setInterval(() => {
    STATE.otpSeconds--;
    const m = Math.floor(STATE.otpSeconds / 60);
    const s = STATE.otpSeconds % 60;
    el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if (STATE.otpSeconds <= 0) {
      clearInterval(STATE.otpInterval);
      el.textContent = 'Expired';
      resend.disabled = false;
    }
  }, 1000);
}

function resendOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach(b => { b.value = ''; b.style.borderColor = ''; });
  startOtpTimer();
  showToast('📨 New OTP sent successfully!');
}

function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  const otp = [...boxes].map(b => b.value).join('');
  if (otp.length < 6) { showError('⚠️ Enter the complete 6-digit OTP.'); return; }

  const btn = document.querySelector('#otpForm .btn-primary');
  btn.innerHTML = '<span>⏳ Verifying…</span>';
  btn.disabled = true;
  clearInterval(STATE.otpInterval);

  setTimeout(() => {
    loginSuccess({
      name: document.getElementById('signupName').value || 'User',
      email: document.getElementById('signupEmail').value || 'user@email.com',
      role: 'user',
    });
  }, 1000);
}

function loginSuccess(user) {
  STATE.user = user;
  if (document.getElementById('rememberMe')?.checked) {
    localStorage.setItem('sd_user', JSON.stringify(user));
  }
  // Update UI
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  document.getElementById('userName').textContent = user.name.split(' ')[0];
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('infoEmail').textContent = user.email;
  document.getElementById('joinDate').textContent = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
  document.getElementById('welcomeName').textContent = user.name.split(' ')[0];

  // Show app
  document.getElementById('authScreen').classList.remove('active');
  document.getElementById('appScreen').classList.add('active');

  renderAllPortals();
  renderFavorites();
  renderRecent();
  renderNotifications();
  renderDashboardPreview();
  updateFavCount();
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

function handleLogout() {
  STATE.user = null;
  localStorage.removeItem('sd_user');
  document.getElementById('appScreen').classList.remove('active');
  document.getElementById('authScreen').classList.add('active');
  showTab('login');
  document.querySelector('#loginForm .btn-primary').innerHTML = '<span>🚀 Login to Dashboard</span>';
  document.querySelector('#loginForm .btn-primary').disabled = false;
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value = '';
}

function showError(msg) {
  document.getElementById('authError').textContent = msg;
  setTimeout(() => document.getElementById('authError').textContent = '', 4000);
}
function clearError() { document.getElementById('authError').textContent = ''; }

// ── Portal Rendering ───────────────────────────────────────
function createPortalCard(portal, delay = 0) {
  const isFav = STATE.favorites.includes(portal.id);
  const card = document.createElement('a');
  card.className = 'portal-card';
  card.href = portal.url === '#' ? 'javascript:void(0)' : portal.url;
  card.target = portal.url === '#' ? '_self' : '_blank';
  card.rel = 'noopener noreferrer';
  card.style.cssText = `--card-color:${portal.color}; animation-delay:${delay}ms`;
  card.dataset.id = portal.id;

  card.innerHTML = `
    <div class="card-dot"></div>
    <div class="card-shadow"></div>
    <div class="card-icon">${portal.icon}</div>
    <div class="card-name">${portal.name}</div>
    <button class="fav-btn ${isFav ? 'active' : ''}" title="Add to favorites"
      onclick="toggleFav(event,'${portal.id}')">⭐</button>
  `;

  card.addEventListener('click', e => {
    if (e.target.classList.contains('fav-btn')) return;
    addRecent(portal);
    if (portal.action === 'showQR') {
      document.getElementById('qrPanel').style.display = 'block';
      document.getElementById('qrPanel').scrollIntoView({ behavior: 'smooth' });
    }
  });

  return card;
}

function renderGrid(gridId, portals) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  portals.forEach((p, i) => grid.appendChild(createPortalCard(p, i * 40)));
}

function renderAllPortals() {
  renderGrid('govGrid',   PORTALS.government);
  renderGrid('bankGrid',  PORTALS.banking);
  renderGrid('eduGrid',   PORTALS.education);
  renderGrid('toolGrid',  PORTALS.tools);
  renderGrid('aiGrid',    PORTALS.ai);
  renderGrid('dailyGrid', PORTALS.daily);
}

function renderDashboardPreview() {
  const container = document.getElementById('allCategoriesPreview');
  container.innerHTML = '';
  const categories = [
    { key:'government', label:'🏛️ Government Services', page:'government' },
    { key:'banking',    label:'🏦 Banking Services',     page:'banking' },
    { key:'ai',         label:'🤖 AI Tools',             page:'ai' },
    { key:'daily',      label:'🌐 Daily Use',            page:'daily' },
  ];
  categories.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'category-section';
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">${cat.label}</h2>
        <a class="see-all" onclick="switchPage('${cat.page}',document.querySelector('[data-page=${cat.page}]'))">See all →</a>
      </div>
    `;
    const grid = document.createElement('div');
    grid.className = 'portal-grid';
    const portals = PORTALS[cat.key].slice(0, 4);
    portals.forEach((p, i) => grid.appendChild(createPortalCard(p, i * 40)));
    section.appendChild(grid);
    container.appendChild(section);
  });
}

// ── Favorites ──────────────────────────────────────────────
function toggleFav(e, id) {
  e.preventDefault(); e.stopPropagation();
  const btn = e.currentTarget;
  const idx = STATE.favorites.indexOf(id);
  if (idx === -1) {
    STATE.favorites.push(id);
    btn.classList.add('active');
    showToast('⭐ Added to favorites!');
  } else {
    STATE.favorites.splice(idx, 1);
    btn.classList.remove('active');
    showToast('🗑️ Removed from favorites');
  }
  // Update all matching fav buttons
  document.querySelectorAll(`.fav-btn`).forEach(b => {
    const card = b.closest('.portal-card');
    if (card && card.dataset.id === id) {
      b.classList.toggle('active', STATE.favorites.includes(id));
    }
  });
  localStorage.setItem('sd_favorites', JSON.stringify(STATE.favorites));
  renderFavorites();
  updateFavCount();
  document.getElementById('statFav').textContent = `${STATE.favorites.length} Favorites`;
}

function renderFavorites() {
  const grid = document.getElementById('favGrid');
  grid.innerHTML = '';
  if (STATE.favorites.length === 0) {
    grid.innerHTML = '<div class="empty-state">No favorites yet. Click ⭐ on any portal card to add!</div>';
    return;
  }
  const favPortals = ALL_PORTALS.filter(p => STATE.favorites.includes(p.id));
  favPortals.forEach((p, i) => grid.appendChild(createPortalCard(p, i * 40)));
}

function updateFavCount() {
  const badge = document.getElementById('favCount');
  badge.textContent = STATE.favorites.length;
  badge.classList.toggle('visible', STATE.favorites.length > 0);
}

// ── Recent ─────────────────────────────────────────────────
function addRecent(portal) {
  STATE.recent = STATE.recent.filter(p => p.id !== portal.id);
  STATE.recent.unshift(portal);
  STATE.recent = STATE.recent.slice(0, 8);
  localStorage.setItem('sd_recent', JSON.stringify(STATE.recent));
  renderRecent();
  document.getElementById('statRecent').textContent = `${STATE.recent.length} Recent`;
}

function renderRecent() {
  const grid = document.getElementById('recentGrid');
  grid.innerHTML = '';
  if (STATE.recent.length === 0) {
    grid.innerHTML = '<div class="empty-state">No recent activity yet. Start exploring!</div>';
    return;
  }
  STATE.recent.forEach((p, i) => grid.appendChild(createPortalCard(p, i * 30)));
}

// ── Search ─────────────────────────────────────────────────
let searchTimeout;
function handleSearch(query) {
  clearTimeout(searchTimeout);
  const resultsEl = document.getElementById('searchResults');
  if (!query.trim()) { resultsEl.classList.remove('open'); return; }

  searchTimeout = setTimeout(() => {
    const q = query.toLowerCase();
    const matches = ALL_PORTALS.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.includes(q)
    ).slice(0, 8);

    if (matches.length === 0) {
      resultsEl.innerHTML = '<p style="color:var(--muted);padding:12px 0">No results found.</p>';
    } else {
      resultsEl.innerHTML = matches.map(p => `
        <a class="search-result-item" href="${p.url}" target="_blank" rel="noopener"
           onclick="addRecent(${JSON.stringify(p).replace(/"/g,'&quot;')});document.getElementById('globalSearch').value='';document.getElementById('searchResults').classList.remove('open')">
          <span class="sr-icon">${p.icon}</span>
          <div>
            <div class="sr-name">${p.name}</div>
            <div class="sr-cat">${capitalize(p.category)}</div>
          </div>
        </a>
      `).join('');
    }
    resultsEl.classList.add('open');
  }, 200);
}

// Close search when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.search-bar') && !e.target.closest('.search-results')) {
    document.getElementById('searchResults').classList.remove('open');
  }
});

// Keyboard shortcut Ctrl+K
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('globalSearch').focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('searchResults').classList.remove('open');
    document.getElementById('globalSearch').blur();
  }
});

// ── Page Routing ───────────────────────────────────────────
function switchPage(pageId, navEl) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Remove active from nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show target page
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  // Activate nav item
  if (navEl) navEl.classList.add('active');
  else {
    const nav = document.querySelector(`[data-page="${pageId}"]`);
    if (nav) nav.classList.add('active');
  }

  STATE.currentPage = pageId;

  // Close sidebar on mobile
  if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');

  // Close search
  document.getElementById('searchResults').classList.remove('open');
}

// ── Sidebar Mobile Toggle ──────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── Theme Toggle ───────────────────────────────────────────
function toggleTheme() {
  STATE.isDark = !STATE.isDark;
  document.body.classList.toggle('dark-mode', STATE.isDark);
  document.body.classList.toggle('light-mode', !STATE.isDark);
  document.getElementById('themeBtn').textContent = STATE.isDark ? '🌙' : '☀️';
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.checked = STATE.isDark;
  localStorage.setItem('sd_theme', STATE.isDark ? 'dark' : 'light');
}

// ── Notifications ──────────────────────────────────────────
function renderNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item ${n.unread ? 'notif-unread' : ''}">
      <div class="notif-icon">${n.icon}</div>
      <div class="notif-text">
        <div class="notif-title">${n.title}</div>
        <div style="color:var(--text2);font-size:13px;margin-top:3px">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

// ── Date/Time ──────────────────────────────────────────────
function updateDateTime() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  document.getElementById('greeting').textContent = greeting;

  const options = { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' };
  document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-IN', options);
}

// ── QR Generator ───────────────────────────────────────────
function showQR() {
  document.getElementById('qrPanel').style.display = 'block';
}

function generateQR() {
  const text = document.getElementById('qrInput').value.trim();
  if (!text) { showToast('⚠️ Enter text or URL to generate QR'); return; }
  const output = document.getElementById('qrOutput');
  const encoded = encodeURIComponent(text);
  output.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}"
         alt="QR Code" style="width:200px;height:200px"/>
    <p style="margin-top:10px;color:var(--muted);font-size:12px">Right-click to save QR code</p>
  `;
  showToast('✅ QR Code generated!');
}

// ── AI Chat ────────────────────────────────────────────────
function openAIChat() {
  document.getElementById('aiModal').classList.add('open');
}

function closeAIModal(e) {
  if (e.target.id === 'aiModal') document.getElementById('aiModal').classList.remove('open');
}

function sendAIMsg() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const messages = document.getElementById('aiMessages');

  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'ai-msg user-msg';
  userDiv.textContent = msg;
  messages.appendChild(userDiv);

  // Bot typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'ai-msg bot-msg';
  typingDiv.textContent = '⏳ Thinking…';
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    typingDiv.textContent = response;
    messages.scrollTop = messages.scrollHeight;
  }, 900);
}

// ── Compact View Toggle ────────────────────────────────────
function toggleCompact(checkbox) {
  document.querySelectorAll('.portal-card').forEach(card => {
    card.style.padding = checkbox.checked ? '12px 10px' : '';
  });
  document.querySelectorAll('.portal-grid').forEach(g => {
    g.style.gridTemplateColumns = checkbox.checked
      ? 'repeat(auto-fill, minmax(110px, 1fr))'
      : '';
  });
}

// ── Clear Data ─────────────────────────────────────────────
function clearData() {
  if (!confirm('Clear all favorites and recent history?')) return;
  STATE.favorites = [];
  STATE.recent = [];
  localStorage.removeItem('sd_favorites');
  localStorage.removeItem('sd_recent');
  renderFavorites();
  renderRecent();
  updateFavCount();
  document.getElementById('statFav').textContent = '0 Favorites';
  document.getElementById('statRecent').textContent = '0 Recent';
  showToast('🗑️ Data cleared!');
  // Re-render all cards to remove starred state
  renderAllPortals();
  renderDashboardPreview();
}

// ── Edit Profile (demo) ────────────────────────────────────
function editProfile() {
  const name = prompt('Enter new display name:', STATE.user?.name || '');
  if (name && name.trim()) {
    const trimmed = name.trim();
    STATE.user.name = trimmed;
    const initials = trimmed.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    document.getElementById('userName').textContent = trimmed.split(' ')[0];
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('profileAvatar').textContent = initials;
    document.getElementById('profileName').textContent = trimmed;
    document.getElementById('welcomeName').textContent = trimmed.split(' ')[0];
    showToast('✅ Profile updated!');
  }
}

// ── Toast Notification ─────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('sdToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sdToast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      background: 'var(--glass-strong)', backdropFilter: 'blur(20px)',
      border: '1.5px solid var(--border)', borderRadius: '12px',
      padding: '12px 20px', color: 'var(--text)', fontSize: '14px',
      fontWeight: '600', zIndex: '999', transition: 'all 0.3s',
      boxShadow: 'var(--shadow-lg)', transform: 'translateY(80px)',
      opacity: '0', fontFamily: "'Outfit', sans-serif",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity = '0';
  }, 2800);
}

// ── Utility ────────────────────────────────────────────────
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// ── Init ───────────────────────────────────────────────────
(function init() {
  // Load saved theme
  const savedTheme = localStorage.getItem('sd_theme');
  if (savedTheme === 'light') {
    STATE.isDark = false;
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    document.getElementById('themeBtn').textContent = '☀️';
    const dt = document.getElementById('darkToggle');
    if (dt) dt.checked = false;
  }

  // Auto-login if remembered
  const savedUser = localStorage.getItem('sd_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      loginSuccess(user);
    } catch {
      document.getElementById('authScreen').classList.add('active');
    }
  } else {
    document.getElementById('authScreen').classList.add('active');
  }

  // Admin nav item
  const adminLink = document.createElement('a');
  adminLink.className = 'nav-item';
  adminLink.dataset.page = 'admin';
  adminLink.onclick = function() { switchPage('admin', this); };
  adminLink.innerHTML = '<span class="nav-icon">🛡️</span><span class="nav-label">Admin</span>';
  document.querySelector('.sidebar-bottom').prepend(adminLink);

  // Create admin page
  const adminPage = document.createElement('div');
  adminPage.className = 'page';
  adminPage.id = 'page-admin';
  adminPage.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">🛡️ Admin Dashboard</h1>
      <p class="page-sub">System overview and management</p>
    </div>
    <div class="stats-row">
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#4fc3f722">👥</div>
        <div><div class="stat-num">1,248</div><div class="stat-lbl">Total Users</div></div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#66bb6a22">✅</div>
        <div><div class="stat-num">987</div><div class="stat-lbl">Active Today</div></div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#ffa72622">⚡</div>
        <div><div class="stat-num">45.2K</div><div class="stat-lbl">Portal Clicks</div></div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon" style="background:#ef535022">🚨</div>
        <div><div class="stat-num">3</div><div class="stat-lbl">Security Alerts</div></div>
      </div>
    </div>
    <div class="admin-grid">
      <div class="glass-card admin-card">
        <h3>👥 Recent Users</h3>
        <table class="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Abdul M.</td><td>abdul@email.com</td><td><span class="badge badge-green">Active</span></td></tr>
            <tr><td>Priya S.</td><td>priya@email.com</td><td><span class="badge badge-green">Active</span></td></tr>
            <tr><td>Rahul K.</td><td>rahul@email.com</td><td><span class="badge badge-blue">Pending OTP</span></td></tr>
            <tr><td>Meera T.</td><td>meera@email.com</td><td><span class="badge badge-red">Blocked</span></td></tr>
          </tbody>
        </table>
      </div>
      <div class="glass-card admin-card">
        <h3>🔐 Security Logs</h3>
        <div class="log-list">
          <div class="log-item log-warn">⚠️ Failed login — 192.168.1.45 — 2 min ago</div>
          <div class="log-item log-info">ℹ️ New user registered — rahul@email.com — 10 min ago</div>
          <div class="log-item log-danger">🚨 Rate limit triggered — IP 10.0.0.12 — 25 min ago</div>
          <div class="log-item log-success">✅ OTP verified — priya@email.com — 1 hr ago</div>
        </div>
      </div>
    </div>
  `;
  document.querySelector('.page-area').appendChild(adminPage);

  // Start canvas
  initCanvas();
})();
