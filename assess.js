/* =====================================================
   AnchorPoint IT — Security Assessment App
   ===================================================== */

'use strict';

// ── QUIZ DATA ──────────────────────────────────────────

const CATEGORIES = [
  { id: 'passwords', label: 'Passwords & Auth',  icon: '🔑' },
  { id: 'updates',   label: 'Software Updates',  icon: '🔄' },
  { id: 'backups',   label: 'Backups',           icon: '💾' },
  { id: 'network',   label: 'Network Security',  icon: '🌐' },
  { id: 'email',     label: 'Email & Training',  icon: '📧' },
];

// Each answer has a score: 2 = good, 1 = partial, 0 = bad
const QUESTIONS = [
  // ── Passwords & Auth ──────────────────────────────────
  {
    id: 'q1', category: 'passwords',
    text: 'Do you use a unique password for every account or system?',
    why: 'Reused passwords mean one breach can unlock everything.',
    answers: [
      { label: 'Yes — every account has its own password', score: 2 },
      { label: 'Most accounts, but not all',              score: 1 },
      { label: 'No — I reuse passwords',                  score: 0 },
    ],
  },
  {
    id: 'q2', category: 'passwords',
    text: 'Do you use multi-factor authentication (MFA) on critical accounts?',
    why: 'Email, banking, and cloud services with MFA stop 99% of automated attacks.',
    answers: [
      { label: 'Yes — MFA is on all critical accounts', score: 2 },
      { label: 'On some accounts only',                 score: 1 },
      { label: 'No MFA anywhere',                       score: 0 },
    ],
  },
  {
    id: 'q3', category: 'passwords',
    text: 'Does your organization use a password manager?',
    why: 'Password managers eliminate weak and reused passwords across your whole team.',
    answers: [
      { label: 'Yes — we use a password manager',     score: 2 },
      { label: 'Some staff do, but not everyone',     score: 1 },
      { label: 'No — we don\'t use one',              score: 0 },
    ],
  },

  // ── Software Updates ──────────────────────────────────
  {
    id: 'q4', category: 'updates',
    text: 'Are operating systems and applications kept up to date?',
    why: 'Unpatched software is the #1 attack vector for ransomware and malware.',
    answers: [
      { label: 'Yes — updates are automatic or managed', score: 2 },
      { label: 'We update manually when we remember',    score: 1 },
      { label: 'Updates are often delayed or skipped',   score: 0 },
    ],
  },
  {
    id: 'q5', category: 'updates',
    text: 'Do all workstations have active antivirus or endpoint protection?',
    why: 'Endpoint protection catches threats that slip past other defenses.',
    answers: [
      { label: 'Yes — all devices are covered',     score: 2 },
      { label: 'Most devices, but not all',         score: 1 },
      { label: 'No endpoint protection installed',  score: 0 },
    ],
  },
  {
    id: 'q6', category: 'updates',
    text: 'Have you audited or removed software that is no longer needed?',
    why: 'Unused software is unpatched software — every extra app is a potential door.',
    answers: [
      { label: 'Yes — we regularly review installed software', score: 2 },
      { label: 'Occasionally, but not on a schedule',         score: 1 },
      { label: 'No — we\'ve never done an audit',             score: 0 },
    ],
  },

  // ── Backups ───────────────────────────────────────────
  {
    id: 'q7', category: 'backups',
    text: 'Are critical files and data backed up regularly?',
    why: 'Without backups, ransomware or hardware failure can be unrecoverable.',
    answers: [
      { label: 'Yes — automated backups run daily or more', score: 2 },
      { label: 'Manual backups, done occasionally',         score: 1 },
      { label: 'No regular backups',                        score: 0 },
    ],
  },
  {
    id: 'q8', category: 'backups',
    text: 'Are your backups stored offsite or in the cloud, separate from your main systems?',
    why: 'Backups on the same network can be encrypted by ransomware along with your data.',
    answers: [
      { label: 'Yes — offsite or cloud backups only',            score: 2 },
      { label: 'Partially — some offsite, some on local drives', score: 1 },
      { label: 'No — backups are only on local/same network',    score: 0 },
    ],
  },
  {
    id: 'q9', category: 'backups',
    text: 'Have you actually tested restoring from your backups in the past year?',
    why: 'Untested backups fail when you need them most. A backup you can\'t restore is not a backup.',
    answers: [
      { label: 'Yes — we\'ve tested a restore recently', score: 2 },
      { label: 'Not recently, but we have backups',      score: 1 },
      { label: 'Never tested / no backups',              score: 0 },
    ],
  },

  // ── Network ───────────────────────────────────────────
  {
    id: 'q10', category: 'network',
    text: 'Is your Wi-Fi network protected with WPA2 or WPA3 encryption?',
    why: 'Weak or open Wi-Fi lets anyone on your network intercept traffic or access internal systems.',
    answers: [
      { label: 'Yes — WPA2 or WPA3 with a strong password', score: 2 },
      { label: 'Password protected but not sure of version', score: 1 },
      { label: 'Open or using older WEP security',           score: 0 },
    ],
  },
  {
    id: 'q11', category: 'network',
    text: 'Do you have a separate guest Wi-Fi network for visitors and personal devices?',
    why: 'Guest networks keep untrusted devices isolated from your business systems.',
    answers: [
      { label: 'Yes — guests use a separate network', score: 2 },
      { label: 'Not yet, but it\'s on our list',      score: 1 },
      { label: 'No — everyone uses the same network', score: 0 },
    ],
  },
  {
    id: 'q12', category: 'network',
    text: 'Have you changed the default admin passwords on your routers and network devices?',
    why: 'Default credentials are publicly known and routinely scanned for by attackers.',
    answers: [
      { label: 'Yes — all default passwords have been changed', score: 2 },
      { label: 'Some devices, but not certain about all',       score: 1 },
      { label: 'No — using default or unknown passwords',       score: 0 },
    ],
  },

  // ── Email & Training ──────────────────────────────────
  {
    id: 'q13', category: 'email',
    text: 'Does your email have spam filtering and phishing protection enabled?',
    why: 'Over 90% of cyberattacks start with a phishing email. Filtering stops the majority before anyone sees them.',
    answers: [
      { label: 'Yes — active filtering on all accounts', score: 2 },
      { label: 'Basic spam filtering only',              score: 1 },
      { label: 'No filtering or not sure',               score: 0 },
    ],
  },
  {
    id: 'q14', category: 'email',
    text: 'Have staff received security awareness training in the past 12 months?',
    why: 'The human layer is the hardest to patch. Trained employees are your best firewall.',
    answers: [
      { label: 'Yes — formal training and/or simulated phishing', score: 2 },
      { label: 'Informal guidance but no structured training',    score: 1 },
      { label: 'No security training has been provided',         score: 0 },
    ],
  },
  {
    id: 'q15', category: 'email',
    text: 'Do you have a documented plan for what to do if you suspect a breach?',
    why: 'Organizations without a plan lose 3-4x more time and money when incidents occur.',
    answers: [
      { label: 'Yes — we have a written incident response plan', score: 2 },
      { label: 'Informal plan but nothing written down',         score: 1 },
      { label: 'No plan — we\'d figure it out as we go',         score: 0 },
    ],
  },
];

// ── RECOMMENDATIONS LIBRARY ────────────────────────────

const RECS = {
  q1: {
    icon: '🔑',
    title: 'Adopt unique passwords for every account',
    desc:  'A single reused password exposed in any data breach gives attackers access to every account that shares it. Use a password manager to generate and store unique credentials automatically.',
  },
  q2: {
    icon: '📱',
    title: 'Enable MFA on all critical accounts',
    desc:  'Multi-factor authentication stops account takeovers even when passwords are stolen. Start with email, admin accounts, and cloud services — they\'re the highest-value targets.',
  },
  q3: {
    icon: '🗝️',
    title: 'Deploy a password manager organization-wide',
    desc:  'Solutions like Bitwarden, 1Password, or Keeper make strong, unique passwords the path of least resistance for every employee. IT retains oversight through admin controls.',
  },
  q4: {
    icon: '🔄',
    title: 'Automate software updates across all devices',
    desc:  'Enable automatic updates for operating systems and key applications, or use an RMM tool to push patches on a managed schedule. Unpatched systems are the #1 ransomware entry point.',
  },
  q5: {
    icon: '🛡️',
    title: 'Install endpoint protection on every device',
    desc:  'Modern EDR solutions (e.g., SentinelOne, Malwarebytes for Teams) catch threats missed by signature-based AV. Every unprotected device is a blind spot on your network.',
  },
  q6: {
    icon: '🧹',
    title: 'Audit and remove unused software',
    desc:  'Schedule a quarterly review of installed applications. Remove anything unused — every extra app is a potential vulnerability that needs patching and monitoring.',
  },
  q7: {
    icon: '💾',
    title: 'Set up automated, regular backups',
    desc:  'Manual backups get forgotten under pressure. Automate daily backups of critical data using a solution that requires no human intervention to run consistently.',
  },
  q8: {
    icon: '☁️',
    title: 'Move backups offsite or to the cloud',
    desc:  'Ransomware routinely targets local and network-attached drives. Follow the 3-2-1 rule: 3 copies, 2 different media, 1 offsite or in the cloud.',
  },
  q9: {
    icon: '✅',
    title: 'Test your backup restoration process',
    desc:  'A backup you\'ve never restored is a hypothesis, not a safety net. Schedule a recovery drill twice a year to confirm your backups actually work before you need them.',
  },
  q10: {
    icon: '📡',
    title: 'Upgrade your Wi-Fi to WPA3 (or secure WPA2)',
    desc:  'WPA3 is the current standard for wireless security. If your router only supports WPA2, ensure you\'re using AES encryption with a strong, unique passphrase.',
  },
  q11: {
    icon: '🌐',
    title: 'Create a dedicated guest network',
    desc:  'Network segmentation keeps visitor devices, personal phones, and IoT equipment isolated from your business systems. Most modern routers support this in minutes.',
  },
  q12: {
    icon: '🔧',
    title: 'Change all default device credentials',
    desc:  'Default router and switch passwords are published online. Change them to unique, strong credentials — and document them securely in your password manager, not on a sticky note.',
  },
  q13: {
    icon: '📧',
    title: 'Upgrade email security with advanced filtering',
    desc:  'Basic spam filtering misses targeted phishing. Services like Microsoft Defender for Office 365 or Google Workspace\'s Advanced Protection add link scanning, impersonation detection, and sandboxing.',
  },
  q14: {
    icon: '👥',
    title: 'Launch regular security awareness training',
    desc:  'Combine short monthly training modules with simulated phishing campaigns. When staff can recognize attacks before they click, your risk drops dramatically.',
  },
  q15: {
    icon: '📋',
    title: 'Write a basic incident response plan',
    desc:  'Your plan doesn\'t need to be complex — just documented. Include: who to call, how to isolate affected machines, who to notify (clients, legal, insurance), and how to preserve evidence.',
  },
};

// ── STATE ──────────────────────────────────────────────

const state = {
  currentQ: 0,
  answers: {}, // { qId: answerIndex }
  browserChecks: [],
};

// ── DOM HELPERS ────────────────────────────────────────

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(id);
  if (el) el.classList.add('active');
}

// ── QUIZ ───────────────────────────────────────────────

function renderQuestion() {
  const q = QUESTIONS[state.currentQ];
  const total = QUESTIONS.length;
  const pct = ((state.currentQ) / total) * 100;

  $('progress-fill').style.width = pct + '%';
  $('progress-label').textContent = `Question ${state.currentQ + 1} of ${total}`;

  const cat = CATEGORIES.find(c => c.id === q.category);
  $('category-badge').textContent = cat ? `${cat.icon} ${cat.label}` : '';

  $('q-number').textContent = String(state.currentQ + 1).padStart(2, '0');
  $('q-text').textContent = q.text;
  $('q-why').textContent = q.why;

  const container = $('answer-options');
  container.innerHTML = '';

  q.answers.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-opt' + (state.answers[q.id] === i ? ' selected' : '');
    btn.setAttribute('aria-pressed', state.answers[q.id] === i ? 'true' : 'false');
    btn.innerHTML = `<span class="answer-opt-dot"></span><span>${ans.label}</span>`;
    btn.addEventListener('click', () => selectAnswer(q.id, i));
    container.appendChild(btn);
  });

  $('btn-back').disabled = state.currentQ === 0;
  $('btn-next').disabled = state.answers[q.id] === undefined;

  // Animate card
  const card = $('quiz-card');
  card.style.animation = 'none';
  void card.offsetWidth; // reflow
  card.style.animation = '';
}

function selectAnswer(qId, idx) {
  state.answers[qId] = idx;
  renderQuestion();
}

function initQuiz() {
  state.currentQ = 0;
  state.answers = {};
  state.browserChecks = [];
  showScreen('screen-quiz');
  renderQuestion();
}

$('btn-start').addEventListener('click', initQuiz);

$('btn-next').addEventListener('click', () => {
  if (state.currentQ < QUESTIONS.length - 1) {
    state.currentQ++;
    renderQuestion();
  } else {
    // Done with quiz — run browser checks
    runBrowserChecks();
  }
});

$('btn-back').addEventListener('click', () => {
  if (state.currentQ > 0) {
    state.currentQ--;
    renderQuestion();
  }
});

$('btn-retake').addEventListener('click', () => {
  showScreen('screen-intro');
});

// ── BROWSER CHECKS ─────────────────────────────────────

function runBrowserChecks() {
  showScreen('screen-check');
  $('check-list').innerHTML = '';

  const checks = gatherBrowserChecks();
  state.browserChecks = checks;

  // Stagger display for readability
  checks.forEach((check, i) => {
    setTimeout(() => {
      const li = document.createElement('li');
      li.className = `check-item ${check.status}`;
      li.style.animationDelay = '0s';
      li.innerHTML = `
        <span class="check-item-icon">${statusIcon(check.status)}</span>
        <span>${check.label}</span>
      `;
      $('check-list').appendChild(li);

      // After last check, hide spinner and move to results
      if (i === checks.length - 1) {
        setTimeout(() => {
          $('check-spinner').style.display = 'none';
          showResults();
        }, 800);
      }
    }, 400 + i * 500);
  });
}

function statusIcon(status) {
  if (status === 'pass') return '✅';
  if (status === 'warn') return '⚠️';
  return '❌';
}

function gatherBrowserChecks() {
  const results = [];

  // 1. HTTPS
  const isHttps = location.protocol === 'https:' || location.hostname === 'localhost';
  results.push({
    label: isHttps
      ? 'Connection is encrypted (HTTPS)'
      : 'Connection is NOT encrypted — you\'re browsing over HTTP',
    status: isHttps ? 'pass' : 'fail',
    score: isHttps ? 1 : -1,
  });

  // 2. Cookies enabled
  const cookiesOk = navigator.cookieEnabled;
  results.push({
    label: cookiesOk
      ? 'Browser cookies are enabled (session security functional)'
      : 'Cookies are disabled — some security features may not work',
    status: cookiesOk ? 'pass' : 'warn',
    score: cookiesOk ? 0 : 0, // neutral — both states have tradeoffs
  });

  // 3. Browser up to date (rough check via User Agent version)
  const browserInfo = detectBrowser();
  const browserOld = browserInfo.majorVersion > 0 && browserInfo.majorVersion < browserInfo.minSafe;
  results.push({
    label: browserOld
      ? `${browserInfo.name} ${browserInfo.majorVersion} detected — consider updating to a current version`
      : `${browserInfo.name} appears to be a current version`,
    status: browserOld ? 'warn' : 'pass',
    score: browserOld ? -1 : 1,
  });

  // 4. Do Not Track (privacy awareness indicator)
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
  results.push({
    label: dnt
      ? 'Do Not Track is enabled (privacy-conscious browsing)'
      : 'Do Not Track is not set — some tracking may occur during browsing',
    status: dnt ? 'pass' : 'warn',
    score: 0, // informational only
  });

  // 5. localStorage available (browser storage security)
  let storageOk = false;
  try {
    localStorage.setItem('_ap_test', '1');
    localStorage.removeItem('_ap_test');
    storageOk = true;
  } catch (e) {
    storageOk = false;
  }
  results.push({
    label: storageOk
      ? 'Browser storage is accessible (apps can store session data securely)'
      : 'Browser storage is blocked — may affect web app functionality',
    status: storageOk ? 'pass' : 'warn',
    score: 0,
  });

  return results;
}

function detectBrowser() {
  const ua = navigator.userAgent;
  let name = 'Your browser';
  let majorVersion = 0;
  let minSafe = 999; // default: assume fine

  if (/Edg\/(\d+)/.test(ua)) {
    name = 'Microsoft Edge';
    majorVersion = parseInt(RegExp.$1);
    minSafe = 120;
  } else if (/Chrome\/(\d+)/.test(ua) && !/Edg/.test(ua)) {
    name = 'Google Chrome';
    majorVersion = parseInt(RegExp.$1);
    minSafe = 120;
  } else if (/Firefox\/(\d+)/.test(ua)) {
    name = 'Mozilla Firefox';
    majorVersion = parseInt(RegExp.$1);
    minSafe = 120;
  } else if (/Safari\/(\d+)/.test(ua) && !/Chrome/.test(ua)) {
    name = 'Safari';
    const m = ua.match(/Version\/(\d+)/);
    majorVersion = m ? parseInt(m[1]) : 0;
    minSafe = 17;
  }

  return { name, majorVersion, minSafe };
}

// ── SCORING ────────────────────────────────────────────

function calcScores() {
  // Per-category scores
  const catScores = {};
  CATEGORIES.forEach(c => { catScores[c.id] = { earned: 0, max: 0 }; });

  QUESTIONS.forEach(q => {
    const ansIdx = state.answers[q.id];
    const score = ansIdx !== undefined ? q.answers[ansIdx].score : 0;
    catScores[q.category].earned += score;
    catScores[q.category].max    += 2; // max per question = 2
  });

  // Browser check adjustment (±1 per flagged check, capped)
  let browserAdj = 0;
  state.browserChecks.forEach(c => { browserAdj += (c.score || 0); });
  browserAdj = Math.max(-4, Math.min(4, browserAdj));

  // Overall score (0–100)
  let totalEarned = 0, totalMax = 0;
  Object.values(catScores).forEach(c => {
    totalEarned += c.earned;
    totalMax    += c.max;
  });

  const rawPct = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
  const adjustedPct = Math.max(0, Math.min(100, rawPct + browserAdj));
  const score = Math.round(adjustedPct);

  return { score, catScores };
}

function getTier(score) {
  if (score >= 85) return { id: 'low',  label: 'Low Risk',      cls: 'tier--low',  color: '#22c55e' };
  if (score >= 65) return { id: 'mod',  label: 'Moderate Risk', cls: 'tier--mod',  color: '#eab308' };
  if (score >= 40) return { id: 'elev', label: 'Elevated Risk', cls: 'tier--elev', color: '#f97316' };
  return               { id: 'high', label: 'High Risk',       cls: 'tier--high', color: '#ef4444' };
}

function getTierText(tier) {
  const map = {
    low:  {
      headline: 'Strong security posture',
      summary:  'Your organization has solid fundamentals in place. The recommendations below address remaining gaps — addressing them will move you from "good" to "resilient."',
    },
    mod:  {
      headline: 'Some important gaps to address',
      summary:  'You have a reasonable baseline, but several key controls are missing or inconsistent. Prioritizing the recommendations below will significantly reduce your exposure.',
    },
    elev: {
      headline: 'Significant vulnerabilities present',
      summary:  'Multiple gaps in your security posture leave your organization exposed to common attacks. A structured remediation plan — starting with the items below — is strongly recommended.',
    },
    high: {
      headline: 'Immediate action recommended',
      summary:  'Your organization has critical security gaps that are actively exploited by attackers. We recommend scheduling a consultation to prioritize and address these issues as soon as possible.',
    },
  };
  return map[tier.id];
}

// ── RESULTS ────────────────────────────────────────────

function showResults() {
  showScreen('screen-results');

  const { score, catScores } = calcScores();
  const tier = getTier(score);
  const text = getTierText(tier);

  // Score ring
  const circumference = 326.7;
  const fill = $('score-ring-fill');
  const offset = circumference - (score / 100) * circumference;
  $('score-number').textContent = score;
  fill.style.stroke = tier.color;

  // Trigger animation after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.strokeDashoffset = offset;
    });
  });

  // Tier badge
  const tierEl = $('results-tier');
  tierEl.textContent = tier.label;
  tierEl.className = `results-tier ${tier.cls}`;

  $('results-headline').textContent = text.headline;
  $('results-summary').textContent  = text.summary;

  // Category bars
  const barsEl = $('category-bars');
  barsEl.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const cs    = catScores[cat.id];
    const pct   = cs.max > 0 ? Math.round((cs.earned / cs.max) * 100) : 0;
    const color = pct >= 75 ? '#22c55e' : pct >= 50 ? '#eab308' : pct >= 25 ? '#f97316' : '#ef4444';

    const row = document.createElement('div');
    row.className = 'cat-bar-row';
    row.innerHTML = `
      <span class="cat-bar-label">${cat.icon} ${cat.label}</span>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" data-pct="${pct}" style="background:${color}"></div>
      </div>
      <span class="cat-bar-pct">${pct}%</span>
    `;
    barsEl.appendChild(row);
  });

  // Animate bars after append
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.cat-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    });
  });

  // Recommendations — pick worst answers first, up to 5
  const scored = QUESTIONS.map(q => {
    const idx = state.answers[q.id];
    const s   = idx !== undefined ? q.answers[idx].score : 0;
    return { q, answerScore: s };
  })
  .filter(x => x.answerScore < 2)         // only show items not fully addressed
  .sort((a, b) => a.answerScore - b.answerScore) // worst first
  .slice(0, 5);

  // If they aced everything, show top 3 anyway
  const recItems = scored.length > 0
    ? scored
    : QUESTIONS.slice(0, 3).map(q => ({ q, answerScore: 2 }));

  const recsEl = $('recommendations');
  recsEl.innerHTML = '';

  recItems.forEach(({ q }) => {
    const rec = RECS[q.id];
    if (!rec) return;
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      <div class="rec-icon">${rec.icon}</div>
      <div class="rec-body">
        <div class="rec-title">${rec.title}</div>
        <div class="rec-desc">${rec.desc}</div>
      </div>
    `;
    recsEl.appendChild(card);
  });

  // If all perfect, show a congratulations note
  if (scored.length === 0) {
    recsEl.innerHTML = `
      <div class="rec-card">
        <div class="rec-icon">🏆</div>
        <div class="rec-body">
          <div class="rec-title">Excellent — you've covered the essentials</div>
          <div class="rec-desc">Your responses indicate strong security hygiene across all categories. A professional audit can uncover anything hiding beneath the surface and validate your controls.</div>
        </div>
      </div>
    `;
  }
}

// ── INIT ───────────────────────────────────────────────
// Nothing to do — intro screen is shown by default via HTML class
