/* ==========================================================================
   EASILY CONFIGURABLE VARIABLES — edit these
   ========================================================================== */

// The site unlocks on July 30 of the current year (locked before, unlocked
// for 30 days after, then re-locks and counts down to next year's July 30).
// Month is 0-indexed in JS Date, so 6 = July.
const TARGET_MONTH = 6;   // July
const TARGET_DAY = 30;

// Her exact birth date — replace with the real value, format: 'YYYY-MM-DD'
const gfBirthDate = 'YYYY-MM-DD';

// Swap in a different word here if you want ("Gorgeous", "Amazing", etc.)
const UNLOCKED_SWEET_WORD = 'Beautiful';

// 12 reasons — edit the emoji and text for each. Order matters for "Reveal Next".
const REASONS = [
  { emoji: '\u2728', text: 'The way you light up every room you walk into.' },
  { emoji: '\u{1F602}', text: 'Your laugh is honestly my favorite sound in the world.' },
  { emoji: '\u{1F49B}', text: 'How much you care for the people you love, without ever asking for anything back.' },
  { emoji: '\u{1F338}', text: 'The way you notice the little things most people miss.' },
  { emoji: '\u{1F31F}', text: 'You make hard days feel a little lighter just by being there.' },
  { emoji: '\u{1F970}', text: 'Your smile. That\u2019s it. That\u2019s the reason.' },
  { emoji: '\u2600\uFE0F', text: 'You bring warmth into every room, even on the greyest days.' },
  { emoji: '\u{1F3A8}', text: 'The way your mind works \u2014 curious, creative, all your own.' },
  { emoji: '\u{1F98B}', text: 'How much you\u2019ve grown, and how proud that makes me.' },
  { emoji: '\u{1F36F}', text: 'You\u2019re somehow both the softest and the strongest person I know.' },
  { emoji: '\u{1F319}', text: 'Every late-night conversation that turned into a favorite memory.' },
  { emoji: '\u{1F451}', text: 'Simply put \u2014 you. All of you. Exactly as you are.' },
];

// 12 message cards for the grid — edit freely, keep 12 for a clean 4x3 layout.
const MESSAGES = [
  { title: 'My forever favorite \u{1F49B}', text: 'No matter what, you\u2019re always my favorite person to talk to.' },
  { title: 'You\u2019re my world \u{1F30D}', text: 'Everything feels a little brighter with you in it.' },
  { title: 'Keep being amazing \u2728', text: 'Never stop being exactly who you are.' },
  { title: 'My favorite hello \u{1F44B}', text: 'Every message from you is the best part of my day.' },
  { title: 'So proud of you \u{1F31F}', text: 'Watching you grow has been one of my favorite things.' },
  { title: 'Home \u{1F3E1}', text: 'Wherever you are feels like home to me.' },
  { title: 'My person \u{1F49E}', text: 'Out of everyone, I\u2019m so glad it\u2019s you.' },
  { title: 'Always in my corner \u{1F94A}', text: 'Thank you for being there, always.' },
  { title: 'Little things \u{1F338}', text: 'I notice all the little things about you \u2014 and love every one.' },
  { title: 'My favorite laugh \u{1F602}', text: 'Your laugh is my favorite sound, no contest.' },
  { title: 'Endlessly grateful \u{1FAF6}', text: 'Grateful for every single day I get with you.' },
  { title: 'Happy birthday \u{1F382}', text: 'Here\u2019s to another year of being ridiculously lucky to know you.' },
];

/* ==========================================================================
   STATE
   ========================================================================== */
let forceUnlocked = false;
let contentRevealed = false;
let openedReasons = new Set();
let likedMessages = new Set();
let confettiFired = false;
let messagesOrder = MESSAGES.map((_, i) => i);
let ageCounterPlayed = false;

/* ==========================================================================
   TIME LOCK LOGIC
   ========================================================================== */
function getTargetDateForYear(year) {
  return new Date(year, TARGET_MONTH, TARGET_DAY, 0, 0, 0, 0);
}

function computeState(now) {
  const year = now.getFullYear();
  const target = getTargetDateForYear(year);
  const msInDay = 24 * 60 * 60 * 1000;
  const unlockEnd = new Date(target.getTime() + 30 * msInDay);

  if (now < target) {
    return { state: 'locked', countdownTarget: target };
  }
  if (now >= target && now < unlockEnd) {
    return { state: 'unlocked', countdownTarget: target };
  }
  // More than 30 days past this year's date: re-lock, count down to next year.
  return { state: 'locked', countdownTarget: getTargetDateForYear(year + 1) };
}

function getEffectiveState() {
  if (forceUnlocked) return { state: 'unlocked', countdownTarget: null };
  return computeState(new Date());
}

/* ==========================================================================
   LANDING VIEW (countdown <-> reveal)
   ========================================================================== */
const lockedView = document.getElementById('lockedView');
const unlockedView = document.getElementById('unlockedView');
const unlockedHeadline = document.getElementById('unlockedHeadline');

function renderLanding() {
  const { state, countdownTarget } = getEffectiveState();

  if (state === 'unlocked') {
    lockedView.classList.add('hidden');
    unlockedView.classList.remove('hidden');
    unlockedHeadline.textContent = `Happy Birthday, ${UNLOCKED_SWEET_WORD}!`;
    return;
  }

  lockedView.classList.remove('hidden');
  unlockedView.classList.add('hidden');
  updateCountdown(countdownTarget);
}

function updateCountdown(target) {
  const now = new Date();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(renderLanding, 1000);
renderLanding();

/* ==========================================================================
   CONTENT REVEAL ("Start the surprise")
   ========================================================================== */
const startSurpriseBtn = document.getElementById('startSurpriseBtn');

function revealContent() {
  contentRevealed = true;
  document.body.classList.remove('is-locked');
  const milestone = document.getElementById('section-milestone');
  milestone.scrollIntoView({ behavior: 'smooth' });
}

startSurpriseBtn.addEventListener('click', revealContent);

/* ==========================================================================
   SECTION 2 — AGE + DAYS SHINING
   ========================================================================== */
function calculateAge(birthDateStr) {
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function calculateDaysSince(birthDateStr) {
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  return Math.floor((now - birth) / (1000 * 60 * 60 * 24));
}

function animateCountUp(el, target, duration = 1400) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function playAgeCounters() {
  if (ageCounterPlayed) return;
  const age = calculateAge(gfBirthDate);
  const days = calculateDaysSince(gfBirthDate);
  if (age === null || days === null) return; // placeholder date not set yet
  ageCounterPlayed = true;
  document.getElementById('ageNumber').textContent = age;
  animateCountUp(document.getElementById('daysCounter'), days, 1800);
}

const milestoneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) playAgeCounters();
  });
}, { threshold: 0.4 });
milestoneObserver.observe(document.getElementById('section-milestone'));

/* ==========================================================================
   SECTION 4 — ENVELOPE / LETTER
   ========================================================================== */
const envelope = document.getElementById('envelope');
const letterOverlay = document.getElementById('letterOverlay');
const letterCloseBtn = document.getElementById('letterCloseBtn');
const envelopeHint = document.getElementById('envelopeHint');

function openLetter() {
  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');
  letterOverlay.classList.add('visible');
  envelopeHint.textContent = 'tap outside the letter to close it';
}

function closeLetter() {
  letterOverlay.classList.remove('visible');
  envelope.classList.remove('open');
  envelope.setAttribute('aria-expanded', 'false');
  envelopeHint.textContent = 'tap the envelope to open it';
}

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) {
    closeLetter();
  } else {
    openLetter();
  }
});

letterCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLetter();
});

letterOverlay.addEventListener('click', (e) => {
  if (e.target === letterOverlay) closeLetter();
});

/* ==========================================================================
   SECTION 5 — 12 REASONS
   ========================================================================== */
const reasonsGrid = document.getElementById('reasonsGrid');
const reasonsOpenedCount = document.getElementById('reasonsOpenedCount');

function renderReasons() {
  reasonsGrid.innerHTML = '';
  REASONS.forEach((reason, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.dataset.index = String(i);
    if (openedReasons.has(i)) card.classList.add('opened');

    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-face reason-front">
          <span class="reason-emoji">${reason.emoji}</span>
          <span class="reason-number">Reason #${i + 1}</span>
        </div>
        <div class="reason-face reason-back">
          <p>${reason.text}</p>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openReason(i));
    reasonsGrid.appendChild(card);
  });
  updateReasonsCount();
}

function openReason(i) {
  if (openedReasons.has(i)) return;
  openedReasons.add(i);
  const card = reasonsGrid.querySelector(`.reason-card[data-index="${i}"]`);
  if (card) card.classList.add('opened');
  updateReasonsCount();
  if (openedReasons.size === REASONS.length && !confettiFired) {
    confettiFired = true;
    fireConfetti();
  }
}

function updateReasonsCount() {
  reasonsOpenedCount.textContent = String(openedReasons.size);
}

document.getElementById('revealNextBtn').addEventListener('click', () => {
  for (let i = 0; i < REASONS.length; i++) {
    if (!openedReasons.has(i)) {
      openReason(i);
      break;
    }
  }
});

document.getElementById('revealAllBtn').addEventListener('click', () => {
  for (let i = 0; i < REASONS.length; i++) openReason(i);
});

/* ==========================================================================
   SECTION 6 — MESSAGES GRID
   ========================================================================== */
const messagesGrid = document.getElementById('messagesGrid');

function renderMessages() {
  messagesGrid.innerHTML = '';
  messagesOrder.forEach((originalIndex) => {
    const msg = MESSAGES[originalIndex];
    const card = document.createElement('div');
    card.className = 'message-card';

    const liked = likedMessages.has(originalIndex);

    card.innerHTML = `
      <div>
        <h3>${msg.title}</h3>
        <p>${msg.text}</p>
      </div>
      <button class="like-btn ${liked ? 'liked' : ''}" aria-pressed="${liked}" aria-label="Like this message">&#9829;</button>
    `;

    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      if (likedMessages.has(originalIndex)) {
        likedMessages.delete(originalIndex);
      } else {
        likedMessages.add(originalIndex);
      }
      renderMessages();
    });

    messagesGrid.appendChild(card);
  });
}

document.getElementById('shuffleBtn').addEventListener('click', () => {
  for (let i = messagesOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [messagesOrder[i], messagesOrder[j]] = [messagesOrder[j], messagesOrder[i]];
  }
  renderMessages();
});

/* ==========================================================================
   CONFETTI
   ========================================================================== */
const confettiContainer = document.getElementById('confettiContainer');
const CONFETTI_GLYPHS = ['\u2665', '\u2606', '\u2726', '\u2661'];
const CONFETTI_COLORS = ['#E8637A', '#FFB199', '#C9A0DC', '#F4C95D'];

function fireConfetti(count = 70) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.textContent = CONFETTI_GLYPHS[Math.floor(Math.random() * CONFETTI_GLYPHS.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
    const duration = 2.5 + Math.random() * 2;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + 1) * 1000);
  }
}

/* ==========================================================================
   FLOATING HEARTS (Section 1 background)
   ========================================================================== */
const floatingHeartsContainer = document.getElementById('floatingHearts');
const HEART_GLYPHS = ['\u2661', '\u2665'];
const HEART_COLORS = ['#E8637A', '#FFB199', '#C9A0DC', '#F4C95D'];

function spawnFloatingHeart() {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  heart.style.fontSize = `${1 + Math.random() * 1.6}rem`;
  heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
  const duration = 6 + Math.random() * 6;
  heart.style.animationDuration = `${duration}s`;
  floatingHeartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

setInterval(spawnFloatingHeart, 700);
for (let i = 0; i < 6; i++) setTimeout(spawnFloatingHeart, i * 300);

/* ==========================================================================
   SECTION 7 — REPLAY
   ========================================================================== */
document.getElementById('replayBtn').addEventListener('click', () => {
  // Reset opened reasons, likes, confetti, and message order.
  openedReasons = new Set();
  likedMessages = new Set();
  confettiFired = false;
  messagesOrder = MESSAGES.map((_, i) => i);
  ageCounterPlayed = false;
  renderReasons();
  renderMessages();

  // Force the unlocked reveal state regardless of the real date.
  forceUnlocked = true;
  contentRevealed = false;
  document.body.classList.add('is-locked');
  renderLanding();

  // Jump to the top instantly.
  window.scrollTo({ top: 0, behavior: 'auto' });
});

/* ==========================================================================
   INIT
   ========================================================================== */
renderReasons();
renderMessages();
