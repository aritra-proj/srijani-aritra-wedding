/**
 * Srijani & Aritra - Subho Vivah (Royal Wedding Ceremony) JavaScript
 * Features:
 * 1. Interactive 2-Avatar Gateway (Click Bride to walk to Groom or vice versa)
 * 2. Velvet Silk Curtains & Union Celebration
 * 3. Falling Rose & Marigold Petals Physics Canvas
 * 4. Multi-color Confetti Burst Engine
 * 5. Web Audio API Romantic Shehnai & Harp Synthesizer
 * 6. Live Wedding Countdown & Calendar Integrations (.ics & Google Cal)
 * 7. Live Celebration Blessing Board & Google Sheets RSVP
 * 8. Polaroid Photo Lightbox Modal
 * 9. Scroll-driven Walking Couple Progress Tracker (#SRIARI)
 * 10. WhatsApp and Link Sharing
 */

// ==========================================================================
// CONFIGURATION
// ==========================================================================
const WEDDING_CONFIG = {
  brideName: "Srijani",
  groomName: "Aritra",
  eventTitle: "Subho Vivah of Srijani & Aritra",
  // Target date: Saturday, December 12, 2026, 19:00:00 IST (UTC+5:30)
  targetDate: new Date("2026-12-12T19:00:00+05:30").getTime(),
  venueName: "Vidyasagar Community Hall (VCC 1)",
  venueAddress: "Vidyasagar Community Hall (VCC 1), Ganguly Bagan, Kolkata, West Bengal",
  googleMapsUrl: "https://maps.app.goo.gl/3b4yKrw2qBnKjf5R8",
  timeText: "Auspicious Lagna: 7:00 PM Onwards",
  formattedDate: "Saturday, December 12, 2026",

  // GOOGLE APPS SCRIPT WEB APP URL FOR GUESTBOOK & RSVP
  googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbyykqh2KP9YaLuO9IlxzZL6u7fLi_Me720fm8uH8sspE1HTlqrFbJjSEjJFRTjSI2s/exec"
};

// Global State
let isOverlayOpen = false;
let isAnimatingWalk = false;
let isAudioPlaying = false;
let arePetalsActive = true;
let selectedSticker = "🌸 Subho Vivah!";
let clientIpAddress = "Detecting...";


// ==========================================================================
// DOM INITIALIZATION (Defensive execution to prevent cascade breaks)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const safeInit = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.warn(`[Init] Non-critical warning in ${name}:`, err);
    }
  };

  safeInit("AvatarUnveil", initAvatarUnveil);
  safeInit("Countdown", initCountdown);
  safeInit("PetalCanvas", initPetalCanvas);
  safeInit("ConfettiCanvas", initConfettiCanvas);
  safeInit("ClickSparkles", initClickSparkles);
  safeInit("CalendarIntegrations", initCalendarIntegrations);
  safeInit("Guestbook", initGuestbook);
  safeInit("FooterCoupleUnion", initFooterCoupleUnion);
  safeInit("MusicController", initMusicController);
  safeInit("ShareFeatures", initShareFeatures);
  safeInit("Lightbox", initLightbox);
  safeInit("ScrollAnimations", initScrollAnimations);
});


// ==========================================================================
// 1. INTERACTIVE 2-AVATAR GATEWAY OPENING STAGE
// (Click Bride to walk to Groom or Groom to walk to Bride)
// ==========================================================================
function initAvatarUnveil() {
  const overlay = document.getElementById("unveilOverlay");
  const groomChar = document.getElementById("groomChar");
  const brideChar = document.getElementById("brideChar");
  const groomBubble = document.getElementById("groomBubble");
  const brideBubble = document.getElementById("brideBubble");
  const togetherCard = document.getElementById("togetherCard");
  const bottomHint = document.getElementById("unveilBottomHint");

  if (!overlay || !groomChar || !brideChar) return;

  function handleAvatarClick(chosenAvatar) {
    if (isOverlayOpen || isAnimatingWalk) return;
    isAnimatingWalk = true;

    // Play initial romantic opening harp sound
    try { playHarpChime(); } catch (e) {}

    const isBrideChosen = (chosenAvatar === "bride");
    const walker = isBrideChosen ? brideChar : groomChar;
    const target = isBrideChosen ? groomChar : brideChar;
    const stagePath = document.getElementById("stagePath");

    if (stagePath) {
      stagePath.classList.add("illuminated");
    }

    // Update speech bubbles
    if (isBrideChosen) {
      if (brideBubble) brideBubble.querySelector("span").textContent = "Coming to you, Aritra! 💕";
      if (groomBubble) groomBubble.querySelector("span").textContent = "Waiting for you, my Bride! 💖";
    } else {
      if (groomBubble) groomBubble.querySelector("span").textContent = "Coming to you, Srijani! 💖";
      if (brideBubble) brideBubble.querySelector("span").textContent = "Waiting for you, my Groom! 💕";
    }

    // Update status pills
    const walkerPill = walker.querySelector(".avatar-action-pill");
    const targetPill = target.querySelector(".avatar-action-pill");
    if (walkerPill) walkerPill.textContent = isBrideChosen ? "🌸 Walking to Aritra..." : "💖 Walking to Srijani...";
    if (targetPill) targetPill.textContent = isBrideChosen ? "🤵 Waiting with joy... 💓" : "👰 Waiting with a smile... 💕";

    target.classList.add("waiting-target");
    walker.classList.add("walking-to-target");

    // Measure bounding boxes to calculate horizontal walking distance
    const walkerRect = walker.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const walkerCenter = walkerRect.left + walkerRect.width / 2;
    const targetCenter = targetRect.left + targetRect.width / 2;

    const isMobile = window.innerWidth < 768;
    const targetStopOffset = (isMobile ? 55 : 85) * (isBrideChosen ? 1 : -1);
    const totalDeltaX = (targetCenter + targetStopOffset) - walkerCenter;

    // Smooth, gradual walk duration (2.6 seconds)
    const duration = 2600;

    // Apply hardware-accelerated smooth gradual transition
    walker.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.9, 0.35, 1)`;
    walker.style.transform = `translateX(${totalDeltaX}px)`;

    // Spawn rich blooming petals and glowing hearts along the walking path
    const symbols = isBrideChosen ? ["🌸", "💖", "✨", "🌺", "💕", "🌼"] : ["💖", "✨", "🌸", "💍", "⭐", "🌺"];
    const trailInterval = setInterval(() => {
      const currentRect = walker.getBoundingClientRect();
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      spawnTrailParticle(currentRect.left + currentRect.width / 2, currentRect.bottom - 12, sym);
    }, 75);

    // When the avatars arrive at the destination
    setTimeout(() => {
      clearInterval(trailInterval);
      if (stagePath) stagePath.classList.remove("illuminated");
      onCoupleMeet();
    }, duration);

    function onCoupleMeet() {
      walker.classList.remove("walking-to-target");
      target.classList.remove("waiting-target");

      // Spawn celebratory union effects
      const midX = window.innerWidth / 2;
      const midY = window.innerHeight / 2;
      createSparkleBurst(midX, midY, 50);
      fireConfetti();
      playCelebrationFanfare();

      // Show together celebration card
      if (togetherCard) {
        togetherCard.classList.add("show");
      }

      // After sweet celebration pause, open curtains and reveal page
      setTimeout(() => {
        isOverlayOpen = true;
        overlay.classList.add("opened");
        document.body.classList.add("unveil-opened");
        showToast("🌸 Welcome to Srijani & Aritra's Subho Vivah! ✨");

        // Immediately trigger visibility of sections
        if (typeof revealVisibleElements === "function") {
          revealVisibleElements();
        }

        setTimeout(() => {
          overlay.style.display = "none";
          if (typeof revealVisibleElements === "function") {
            revealVisibleElements();
          }
        }, 1800);
      }, 1600);
    }
  }

  // Click listeners on avatars
  brideChar.addEventListener("click", (e) => {
    e.stopPropagation();
    handleAvatarClick("bride");
  });
  groomChar.addEventListener("click", (e) => {
    e.stopPropagation();
    handleAvatarClick("groom");
  });

  // Stage altar & instruction badge tap triggers union
  const stagePath = document.getElementById("stagePath");
  if (stagePath) {
    stagePath.addEventListener("click", () => handleAvatarClick("bride"));
  }
  const instructionBadge = document.getElementById("instructionBadge");
  if (instructionBadge) {
    instructionBadge.addEventListener("click", () => handleAvatarClick("bride"));
  }

  // Keyboard accessibility (Enter or Space)
  brideChar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAvatarClick("bride");
    }
  });

  groomChar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAvatarClick("groom");
    }
  });

  // Fallback: Click on bottom hint or scroll down triggers the union
  if (bottomHint) {
    bottomHint.addEventListener("click", () => handleAvatarClick("bride"));
  }

  window.addEventListener("wheel", (e) => {
    if (!isOverlayOpen && !isAnimatingWalk && e.deltaY > 25) {
      handleAvatarClick("bride");
    }
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isOverlayOpen && !isAnimatingWalk) {
      const touchEndY = e.touches[0].clientY;
      if (Math.abs(touchStartY - touchEndY) > 35) {
        handleAvatarClick("bride");
      }
    }
  }, { passive: true });

  // If user arrives via direct section anchor (#blessings, #rituals, #venue), smoothly reveal page
  if (window.location.hash && window.location.hash !== "#" && window.location.hash !== "#hero") {
    setTimeout(() => {
      if (!isOverlayOpen && !isAnimatingWalk) {
        isOverlayOpen = true;
        overlay.classList.add("opened");
        document.body.classList.add("unveil-opened");
        overlay.style.display = "none";
        if (typeof revealVisibleElements === "function") {
          revealVisibleElements();
        }
        try {
          const target = document.querySelector(window.location.hash);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        } catch (err) {}
      }
    }, 400);
  }
}

// Spawn heart/petal particle along walking path
function spawnTrailParticle(x, y, symbol) {
  const container = document.getElementById("sparkleContainer");
  if (!container) return;

  const particle = document.createElement("div");
  particle.className = "sparkle-particle";
  particle.textContent = symbol;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
  particle.style.setProperty("--dy", `${-30 - Math.random() * 30}px`);

  container.appendChild(particle);
  setTimeout(() => particle.remove(), 1200);
}


// ==========================================================================
// 2. LIVE WEDDING COUNTDOWN TIMER
// ==========================================================================
function initCountdown() {
  const daysEl = document.getElementById("timerDays");
  const hoursEl = document.getElementById("timerHours");
  const minutesEl = document.getElementById("timerMinutes");
  const secondsEl = document.getElementById("timerSeconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      const subtitle = document.querySelector(".countdown-subtitle");
      if (subtitle) subtitle.textContent = "🎉 Today is the Auspicious Day of Subho Vivah! 🎉";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}


// ==========================================================================
// 3. FALLING ROSE & MARIGOLD PETAL PHYSICS CANVAS
// ==========================================================================
function initPetalCanvas() {
  const canvas = document.getElementById("petalsCanvas");
  const toggleBtn = document.getElementById("petalToggleBtn");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalCount = window.innerWidth < 768 ? 24 : 45;
  const petals = [];

  // Color options: Crimson rose, soft rose pink, and auspicious marigold gold
  const petalColors = [
    { fill: "rgba(184, 29, 36, 0.72)", shadow: "rgba(122, 12, 22, 0.4)" }, // Crimson Rose
    { fill: "rgba(230, 57, 70, 0.68)", shadow: "rgba(184, 29, 36, 0.3)" }, // Bright Sindoor
    { fill: "rgba(244, 162, 97, 0.75)", shadow: "rgba(212, 175, 55, 0.4)" }, // Marigold Orange
    { fill: "rgba(247, 214, 208, 0.75)", shadow: "rgba(232, 165, 152, 0.3)" } // Soft Rose Blush
  ];

  for (let i = 0; i < petalCount; i++) {
    petals.push(createPetal(true));
  }

  function createPetal(randomY) {
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      size: Math.random() * 10 + 9,
      speedY: Math.random() * 1.3 + 0.8,
      speedX: Math.random() * 1.2 - 0.6,
      angle: Math.random() * 360,
      angularSpeed: (Math.random() - 0.5) * 1.8,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.015,
      color: color
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.angle * Math.PI) / 180);
    ctx.scale(Math.sin(p.wobble), 1);

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.3, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.8, -p.size * 0.8, 0, -p.size);

    ctx.fillStyle = p.color.fill;
    ctx.shadowColor = p.color.shadow;
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();
  }

  function renderPetals() {
    if (!arePetalsActive) {
      ctx.clearRect(0, 0, width, height);
      requestAnimationFrame(renderPetals);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 0.8;
      p.angle += p.angularSpeed;
      p.wobble += p.wobbleSpeed;

      if (p.y > height + 20 || p.x < -30 || p.x > width + 30) {
        petals[i] = createPetal(false);
      }

      drawPetal(p);
    }

    requestAnimationFrame(renderPetals);
  }

  renderPetals();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      arePetalsActive = !arePetalsActive;
      toggleBtn.classList.toggle("muted", !arePetalsActive);
      showToast(arePetalsActive ? "🌸 Petal shower enabled" : "🌸 Petal shower paused");
    });
  }
}


// ==========================================================================
// 4. CONFETTI CELEBRATION CANVASES
// ==========================================================================
let triggerConfettiFn = null;

function initConfettiCanvas() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ["#D4AF37", "#E63946", "#B81D24", "#F4A261", "#FFF", "#F7D6D0"];
  let particles = [];

  function spawnConfetti(count = 120) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height * 0.45 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.9) * 18,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 80
      });
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // Gravity
      p.vx *= 0.98; // Drag
      p.rotation += p.rotationSpeed;
      p.life++;
      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      if (p.life >= p.maxLife || p.y > height + 20) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
  triggerConfettiFn = spawnConfetti;
}

function fireConfetti() {
  if (triggerConfettiFn) {
    triggerConfettiFn(140);
  }
}


// ==========================================================================
// 5. INTERACTIVE CLICK & TOUCH SPARKLES
// ==========================================================================
function initClickSparkles() {
  const container = document.getElementById("sparkleContainer");
  if (!container) return;

  const symbols = ["✨", "🌸", "💖", "💍", "🌼", "⭐"];

  window.addEventListener("click", (e) => {
    // Avoid spawning sparkles on buttons to keep clicks clean
    if (e.target.closest("button") || e.target.closest("input") || e.target.closest("textarea") || e.target.closest("select")) {
      return;
    }
    createSparkleBurst(e.clientX, e.clientY, 8);
  });
}

function createSparkleBurst(x, y, count = 12) {
  const container = document.getElementById("sparkleContainer");
  if (!container) return;

  const symbols = ["✨", "🌸", "💖", "💍", "⭐"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "sparkle-particle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 70 + 20;
    el.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);

    container.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}


// ==========================================================================
// 6. CALENDAR INTEGRATIONS (GOOGLE CALENDAR & .ICS DOWNLOAD)
// ==========================================================================
function initCalendarIntegrations() {
  const googleBtn = document.getElementById("googleCalBtn");
  const iCalBtn = document.getElementById("iCalBtn");

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      // Event: Saturday Dec 12, 2026 19:00 to 23:59 IST (UTC: 20261212T133000Z to 20261212T182900Z)
      const startUtc = "20261212T133000Z";
      const endUtc = "20261212T183000Z";
      const title = encodeURIComponent(WEDDING_CONFIG.eventTitle);
      const details = encodeURIComponent(
        `Join us for the auspicious Subho Vivah (Wedding Ceremony) of Srijani & Aritra!\n\n` +
        `Date: Saturday, December 12, 2026\n` +
        `Auspicious Lagna: 7:00 PM Onwards\n` +
        `Venue: ${WEDDING_CONFIG.venueName}\n` +
        `Address: ${WEDDING_CONFIG.venueAddress}\n\n` +
        `We eagerly await your presence & blessings! 🌸💍`
      );
      const location = encodeURIComponent(WEDDING_CONFIG.venueAddress);

      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
      window.open(url, "_blank");
      showToast("📅 Opening Google Calendar...");
    });
  }

  if (iCalBtn) {
    iCalBtn.addEventListener("click", () => {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Srijani & Aritra Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:srijani-aritra-wedding-2026@wedding.com",
        "DTSTAMP:20261212T133000Z",
        "DTSTART:20261212T133000Z",
        "DTEND:20261212T183000Z",
        `SUMMARY:${WEDDING_CONFIG.eventTitle}`,
        `DESCRIPTION:Auspicious Subho Vivah of Srijani & Aritra. Lagna: 7:00 PM Onwards. Feast: 8:00 PM Onwards.`,
        `LOCATION:${WEDDING_CONFIG.venueAddress}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "Srijani_Aritra_Subho_Vivah.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("🍏 Apple / Outlook Calendar (.ics) downloaded!");
    });
  }
}


// ==========================================================================
// 7. GUESTBOOK & RSVP WITH GOOGLE SHEETS
// ==========================================================================
function initGuestbook() {
  const form = document.getElementById("blessingForm");
  const cardsList = document.getElementById("blessingCardsList");
  const countBadge = document.getElementById("blessingCountBadge");
  const stickerBtns = document.querySelectorAll(".sticker-btn");
  const submitBtn = document.getElementById("submitBlessingBtn");

  // Fetch client IP in background
  detectClientIp();

  // Sticker Selector
  stickerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      stickerBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSticker = btn.dataset.sticker;
    });
  });

  // Purge any legacy sample blessings from local cache
  try {
    localStorage.removeItem("srijani_wedding_blessings");
  } catch (err) {}

  const isSampleTestBlessing = (b) => {
    const testNames = [
      "dev & priya",
      "ananya & subrata",
      "sourav & riya",
      "kakali & debashis",
      "kakali & debashis mukherjee",
      "poulomi banerjee",
      "soumya & ritu"
    ];
    const name = (b.name || "").trim().toLowerCase();
    return testNames.some((t) => name.includes(t));
  };

  let allBlessings = [];
  try {
    const cached = localStorage.getItem("srijani_wedding_blessings_v2");
    if (cached) {
      const parsed = JSON.parse(cached);
      allBlessings = Array.isArray(parsed) ? parsed.filter((b) => !isSampleTestBlessing(b)) : [];
    }
  } catch (err) {}

  if (Array.isArray(allBlessings) && allBlessings.length > 0) {
    renderBlessings(allBlessings);
  } else {
    renderLoadingState();
  }

  // Populate exclusively from Google Sheet on load (excluding early test samples)
  fetchLiveBlessingsFromSheet((remoteBlessings) => {
    if (Array.isArray(remoteBlessings)) {
      allBlessings = remoteBlessings.filter((b) => !isSampleTestBlessing(b));
      try {
        localStorage.setItem("srijani_wedding_blessings_v2", JSON.stringify(allBlessings));
      } catch (err) {}
      renderBlessings(allBlessings);
    } else if (!allBlessings || allBlessings.length === 0) {
      renderBlessings([]);
    }
  });

  // Form submit -> Store in Google Sheet
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("guestName").value.trim();
      const status = document.getElementById("attendanceStatus").value;
      const message = document.getElementById("blessingMessage").value.trim();

      if (!name || !message) return;

      const deviceType = await detectDeviceDetails();
      const nowFormatted = "Just now";

      const newBlessing = {
        name: name,
        status: status,
        sticker: selectedSticker,
        message: message,
        time: nowFormatted,
        timestamp: nowFormatted,
        device: deviceType,
        ip: clientIpAddress,
        userAgent: navigator.userAgent
      };

      // Add instantly to top of list for immediate feedback
      allBlessings.unshift(newBlessing);
      renderBlessings(allBlessings);

      try {
        localStorage.setItem("srijani_wedding_blessings_v2", JSON.stringify(allBlessings));
      } catch (err) {}

      // Fire celebratory confetti & fanfare
      fireConfetti();
      playCelebrationFanfare();

      // UI button state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="btn-icon">⏳</span> Saving to Google Sheet...`;
      }

      await saveBlessingToGoogleSheet(newBlessing);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="btn-icon">🎉</span> Post Blessing & Trigger Confetti`;
      }

      showToast("🌸 Your blessing has been saved to our Google Sheet celebration wall! ✨");
      form.reset();

      // Re-fetch from Google Sheet after 1.5s to keep list synchronized
      setTimeout(() => {
        fetchLiveBlessingsFromSheet((freshList) => {
          if (Array.isArray(freshList)) {
            allBlessings = freshList.filter((b) => !isSampleTestBlessing(b));
            renderBlessings(allBlessings);
          }
        });
      }, 1500);
    });
  }

  function renderLoadingState() {
    if (!cardsList) return;
    if (countBadge) {
      countBadge.textContent = "Loading...";
    }
    cardsList.innerHTML = `
      <div style="text-align:center; padding:35px 15px; color:var(--text-muted);">
        <span style="font-size:2rem; display:inline-block; margin-bottom:10px; animation: pulseGlow 1.5s infinite ease-in-out;">🌸</span>
        <p style="font-size:0.95rem; font-weight:500;">Loading blessings from Google Sheet wall...</p>
      </div>
    `;
  }

  function renderBlessings(list) {
    if (!cardsList) return;
    cardsList.innerHTML = "";

    if (countBadge) {
      countBadge.textContent = `${list.length} Wishes`;
    }

    if (!list || list.length === 0) {
      cardsList.innerHTML = `
        <div style="text-align:center; padding:30px 15px; color:var(--text-muted);">
          <span style="font-size:2rem; display:block; margin-bottom:8px;">🌸</span>
          <p>Be the first to shower Srijani & Aritra with your sweet blessings! ✨</p>
        </div>
      `;
      return;
    }

    list.forEach((b) => {
      const item = document.createElement("div");
      item.className = "blessing-wall-item";
      item.innerHTML = `
        <div class="blessing-item-top">
          <span class="blessing-author">${escapeHtml(b.name)}</span>
          <span class="blessing-time">${escapeHtml(b.timestamp || b.time || "Recently")}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
          <span class="blessing-status-tag">${escapeHtml(b.status || "Joyfully Attending")}</span>
          ${b.sticker ? `<span style="display:inline-block; font-size:0.75rem; font-weight:600; color:var(--primary-crimson); background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.35); padding:2px 10px; border-radius:12px;">${escapeHtml(b.sticker)}</span>` : ""}
        </div>
        <p class="blessing-text">"${escapeHtml(b.message)}"</p>
      `;
      cardsList.appendChild(item);
    });
  }
}

/**
 * Fetch live blessings from Google Sheet Web App
 */
async function fetchLiveBlessingsFromSheet(callback) {
  const url = WEDDING_CONFIG.googleAppsScriptUrl;
  if (!url) return;

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.status === "success" && Array.isArray(data.blessings)) {
      callback(data.blessings);
    } else {
      callback([]);
    }
  } catch (err) {
    console.warn("Could not fetch remote blessings from Google Sheet:", err);
    callback(null);
  }
}

/**
 * Save blessing data to Google Sheet Web App
 */
async function saveBlessingToGoogleSheet(blessingData) {
  const url = WEDDING_CONFIG.googleAppsScriptUrl;
  if (!url) return;

  try {
    // Send with text/plain payload to bypass CORS pre-flight restriction in Google Apps Script Web App
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(blessingData),
      mode: "no-cors"
    });
  } catch (err) {
    console.error("Failed to send blessing to Google Sheet:", err);
  }
}

/**
 * Detect rich client Device details (Specific Brand/Model, Form Factor, OS, Browser, Screen & Hardware Specs)
 * Exactly matched from marriage_card_page/app.js
 */
async function detectDeviceDetails() {
  const ua = navigator.userAgent || "";
  let brandModel = "";
  let formFactor = "Desktop / Laptop";
  let os = "Unknown OS";
  let browser = "Browser";

  // 1. Check Modern UserAgentData Client Hints (Chromium: Chrome, Edge, Samsung Internet, Opera)
  let hintModel = "";
  let hintPlatform = "";
  let hintPlatformVersion = "";
  if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === "function") {
    try {
      const hints = await navigator.userAgentData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion"
      ]);
      if (hints.model) hintModel = hints.model.trim();
      if (hints.platform) hintPlatform = hints.platform;
      if (hints.platformVersion) hintPlatformVersion = hints.platformVersion;
    } catch (e) {
      // Fallback to UA string
    }
  }

  // 2. Determine Operating System & Version
  if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS (\d+[_\.]\d+)/i);
    os = match ? `iOS ${match[1].replace(/_/g, ".")}` : "iOS";
  } else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s+([0-9\.]+)/i);
    os = match ? `Android ${match[1]}` : (hintPlatform === "Android" ? "Android" : "Android");
  } else if (/Windows NT/i.test(ua) || hintPlatform === "Windows") {
    if (hintPlatformVersion) {
      const major = parseInt(hintPlatformVersion.split(".")[0], 10);
      os = major >= 13 ? "Windows 11" : "Windows 10";
    } else if (/Windows NT 10.0/i.test(ua)) {
      os = "Windows 10/11";
    } else if (/Windows NT 6.3/i.test(ua)) {
      os = "Windows 8.1";
    } else if (/Windows NT 6.1/i.test(ua)) {
      os = "Windows 7";
    } else {
      os = "Windows";
    }
  } else if (/Mac OS X/i.test(ua) || hintPlatform === "macOS") {
    const match = ua.match(/Mac OS X (\d+[_\.]\d+)/i);
    os = match ? `macOS ${match[1].replace(/_/g, ".")}` : "macOS";
  } else if (/CrOS/i.test(ua)) {
    os = "Chrome OS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  // 3. Detect Form Factor & Specific Brand / Model
  const isTouch = navigator.maxTouchPoints > 0;
  const screenW = window.screen.width;
  const screenH = window.screen.height;
  const ratio = window.devicePixelRatio || 1;
  const minDim = Math.min(screenW, screenH);
  const maxDim = Math.max(screenW, screenH);

  // Apple iPad
  if (/iPad/i.test(ua) || (os.includes("iOS") && minDim >= 600) || (/MacIntel/i.test(navigator.platform) && isTouch)) {
    formFactor = "📟 Tablet";
    brandModel = "Apple iPad";
  }
  // Apple iPhone
  else if (/iPhone/i.test(ua)) {
    formFactor = "📱 Mobile";
    if (maxDim >= 932 && ratio >= 3) {
      brandModel = "Apple iPhone (14/15/16 Pro Max / Plus)";
    } else if (maxDim >= 852 && ratio >= 3) {
      brandModel = "Apple iPhone (14/15/16 Pro / 15/16)";
    } else if (maxDim >= 844 && ratio >= 3) {
      brandModel = "Apple iPhone (12/13/14 Series)";
    } else if (maxDim >= 926 && ratio >= 3) {
      brandModel = "Apple iPhone (12/13 Pro Max / 14 Plus)";
    } else if (maxDim >= 896) {
      brandModel = ratio >= 3 ? "Apple iPhone (11 Pro Max / XS Max)" : "Apple iPhone (11 / XR)";
    } else if (maxDim >= 812) {
      brandModel = "Apple iPhone (X / XS / 11 Pro / Mini)";
    } else if (maxDim >= 667) {
      brandModel = "Apple iPhone (SE / 8 / 7)";
    } else {
      brandModel = "Apple iPhone";
    }
  }
  // Android Phone / Tablet
  else if (/Android/i.test(ua) || hintPlatform === "Android") {
    const isTablet = /Tablet/i.test(ua) || minDim >= 600;
    formFactor = isTablet ? "📟 Tablet" : "📱 Mobile";

    let rawModel = hintModel;
    if (!rawModel) {
      const match = ua.match(/Android[^;]+;\s*([^;)]+)\s*(?:Build|[;)])/i);
      if (match && match[1]) {
        rawModel = match[1].trim();
      }
    }

    if (rawModel) {
      if (/^SM-|^GT-|^SCH-/i.test(rawModel)) {
        brandModel = `Samsung Galaxy (${rawModel})`;
      } else if (/Pixel/i.test(rawModel)) {
        brandModel = `Google ${rawModel}`;
      } else if (/CPH|OnePlus|IN20|GM19|KB20|NE22/i.test(rawModel)) {
        brandModel = `OnePlus (${rawModel})`;
      } else if (/Redmi|POCO|Xiaomi|220|221|230|231|240|241/i.test(rawModel)) {
        brandModel = `Xiaomi / Redmi (${rawModel})`;
      } else if (/^V2|^V1|vivo/i.test(rawModel)) {
        brandModel = `Vivo (${rawModel})`;
      } else if (/^RMX/i.test(rawModel)) {
        brandModel = `Realme (${rawModel})`;
      } else if (/moto|^XT/i.test(rawModel)) {
        brandModel = `Motorola (${rawModel})`;
      } else {
        brandModel = rawModel;
      }
    } else {
      brandModel = isTablet ? "Android Tablet" : "Android Smartphone";
    }
  }
  // Laptops / Desktops
  else {
    const isMac = os.includes("macOS");
    if (isMac) {
      formFactor = "💻 Mac";
      brandModel = ratio >= 2 ? "Apple MacBook (Retina)" : "Apple Mac / iMac";
    } else if (os.includes("Chrome OS")) {
      formFactor = "💻 Chromebook";
      brandModel = hintModel ? `Chromebook (${hintModel})` : "Chromebook";
    } else {
      formFactor = isTouch ? "💻 Laptop / 2-in-1 (Touchscreen)" : "🖥️ Desktop / Laptop";
      brandModel = hintModel ? `PC (${hintModel})` : `${os} PC`;
    }
  }

  // 4. Browser detection
  if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";
  else if (/UCBrowser/i.test(ua)) browser = "UC Browser";

  // 5. Hardware Specs (Screen Resolution, CPU Cores)
  const screenStr = `${screenW}x${screenH}`;
  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}-Core` : "";
  const hwInfo = [screenStr, cores].filter(Boolean).join(" • ");

  return `${formFactor} — ${brandModel} [${os} • ${browser} • ${hwInfo}]`;
}

// Backwards-compatible aliases
const detectDeviceType = detectDeviceDetails;
const fetchClientIp = detectClientIp;

/**
 * Detect Client Public IP Address
 * Exactly matched from marriage_card_page/app.js
 */
async function detectClientIp() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        clientIpAddress = data.ip;
      }
    }
  } catch (e) {
    // Fallback attempt
    try {
      const res2 = await fetch("https://api64.ipify.org?format=json");
      const data2 = await res2.json();
      if (data2 && data2.ip) clientIpAddress = data2.ip;
    } catch (err) {
      clientIpAddress = "IP Not Available";
    }
  }
}


// ==========================================================================
// 8. FOOTER WALKING COUPLE STAGE (SRIJANI & ARITRA -> #SRIARI AT BOTTOM)
// ==========================================================================
function initFooterCoupleUnion() {
  const footer = document.querySelector(".footer-section");
  const srijaniEl = document.getElementById("footerSrijani");
  const aritraEl = document.getElementById("footerAritra");
  const heartEl = document.getElementById("footerWalkerHeart");
  const mergedEl = document.getElementById("footerMergedSriAri");

  if (!footer || !srijaniEl || !aritraEl || !mergedEl) return;

  const triggerBottomCelebration = () => {
    showToast("🌸 #SRIARI — Srijani & Aritra Forever & Always! 💍💖");
    fireConfetti();
  };
  mergedEl.addEventListener("click", triggerBottomCelebration);
  srijaniEl.addEventListener("click", triggerBottomCelebration);
  aritraEl.addEventListener("click", triggerBottomCelebration);

  function updateFooterCouple() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - windowHeight;

    const footerRect = footer.getBoundingClientRect();
    const distFromBottom = Math.max(0, docHeight - scrollTop);

    let progress = 0;
    if (footerRect.top < windowHeight) {
      // User is scrolling into/through the footer
      const travel = Math.min(windowHeight * 0.7, Math.max(1, docHeight));
      const footerProgress = 1 - (distFromBottom / travel);
      progress = Math.min(1, Math.max(0, footerProgress));
    }

    const isMobile = window.innerWidth < 768;
    const mergeThreshold = isMobile ? 0.68 : 0.82;
    const distThreshold = isMobile ? 70 : 30;
    const maxWalkPercent = isMobile ? 18 : 34;

    // Merge threshold: near the bottom of the page
    const isAtBottom = (progress >= mergeThreshold) || (distFromBottom <= distThreshold);

    if (!isAtBottom) {
      const walkProgress = Math.min(1, progress / mergeThreshold); // 0 to 1
      const srijaniPos = 4 + walkProgress * maxWalkPercent;
      const aritraPos = 4 + walkProgress * maxWalkPercent;

      srijaniEl.style.opacity = `${(0.45 + walkProgress * 0.55).toFixed(2)}`;
      srijaniEl.style.left = `${srijaniPos.toFixed(1)}%`;
      srijaniEl.style.transform = `translateY(-50%) scale(${(0.92 + walkProgress * 0.08).toFixed(2)})`;

      aritraEl.style.opacity = `${(0.45 + walkProgress * 0.55).toFixed(2)}`;
      aritraEl.style.right = `${aritraPos.toFixed(1)}%`;
      aritraEl.style.transform = `translateY(-50%) scale(${(0.92 + walkProgress * 0.08).toFixed(2)})`;

      if (heartEl) {
        heartEl.style.opacity = `${(0.3 + walkProgress * 0.7).toFixed(2)}`;
        heartEl.style.transform = `translate(-50%, -50%) scale(${(0.85 + walkProgress * 0.35).toFixed(2)})`;
      }

      mergedEl.style.opacity = "0";
      mergedEl.style.transform = "translate(-50%, -50%) scale(0.5)";
      mergedEl.style.pointerEvents = "none";
    } else {
      // Merged state: converted to #SRIARI at the bottom of the page!
      srijaniEl.style.opacity = "0";
      srijaniEl.style.left = `${(4 + maxWalkPercent).toFixed(1)}%`;

      aritraEl.style.opacity = "0";
      aritraEl.style.right = `${(4 + maxWalkPercent).toFixed(1)}%`;

      if (heartEl) {
        heartEl.style.opacity = "0";
      }

      mergedEl.style.opacity = "1";
      mergedEl.style.transform = "translate(-50%, -50%) scale(1.08)";
      mergedEl.style.pointerEvents = "auto";
    }
  }

  window.addEventListener("scroll", updateFooterCouple, { passive: true });
  window.addEventListener("resize", updateFooterCouple, { passive: true });
  updateFooterCouple();
}


// ==========================================================================
// 9. AMBIENT ROMANTIC SHEHNAI & HARP SYNTHESIZER (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let melodyInterval = null;

function initMusicController() {
  const musicBtn = document.getElementById("musicToggleBtn");
  if (!musicBtn) return;

  musicBtn.addEventListener("click", () => {
    if (!isAudioPlaying) {
      startRomanticMelody();
      isAudioPlaying = true;
      musicBtn.classList.add("active");
      showToast("🎵 Soft romantic wedding melody playing...");
    } else {
      stopRomanticMelody();
      isAudioPlaying = false;
      musicBtn.classList.remove("active");
      showToast("🎵 Music paused");
    }
  });
}

function startRomanticMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  // Raag Yaman / Bhupali auspicious pentatonic wedding sequence
  const ragaNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25, // Sa, Re, Ga, Pa, Dha, Sa'
    440.00, 392.00, 329.63, 293.66, 261.63,
    329.63, 392.00, 440.00, 523.25, 587.33, 659.25,
    587.33, 523.25, 440.00, 392.00, 329.63
  ];

  let noteIdx = 0;
  playAcousticPluck(ragaNotes[0]);

  melodyInterval = setInterval(() => {
    noteIdx = (noteIdx + 1) % ragaNotes.length;
    playAcousticPluck(ragaNotes[noteIdx]);
  }, 780);
}

function stopRomanticMelody() {
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}

function playAcousticPluck(freq) {
  if (!audioCtx || audioCtx.state !== "running") return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Warm sitar/shehnai acoustic pluck envelope
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.9);
  } catch (err) {}
}

function playHarpChime() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  // Upward romantic glissando
  const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
  chimeNotes.forEach((f, idx) => {
    setTimeout(() => playAcousticPluck(f), idx * 85);
  });
}

function playCelebrationFanfare() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  // Joyful auspicious chord flourish
  const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  fanfare.forEach((f, idx) => {
    setTimeout(() => playAcousticPluck(f), idx * 110);
  });
}


// ==========================================================================
// 9. POLAROID PHOTO LIGHTBOX MODAL
// ==========================================================================
function initLightbox() {
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxCloseBtn");
  const backdrop = document.getElementById("lightboxBackdrop");
  const polaroids = document.querySelectorAll(".polaroid-card");

  if (!modal || !modalImg) return;

  polaroids.forEach((card) => {
    card.addEventListener("click", () => {
      const fullImg = card.dataset.fullimg || card.querySelector("img").src;
      const caption = card.dataset.caption || "";
      modalImg.src = fullImg;
      if (modalCaption) modalCaption.textContent = caption;
      modal.classList.add("show");
    });
  });

  function closeModal() {
    modal.classList.remove("show");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Love reaction counter on polaroids
  const loveBtns = document.querySelectorAll(".love-reaction-btn");
  loveBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const countEl = btn.querySelector(".like-count");
      if (countEl) {
        let count = parseInt(countEl.textContent, 10) || 0;
        count++;
        countEl.textContent = count;
        btn.style.transform = "scale(1.2)";
        setTimeout(() => (btn.style.transform = ""), 200);

        const rect = btn.getBoundingClientRect();
        createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
      }
    });
  });
}


// ==========================================================================
// 10. SCROLL PROGRESS WALKING COUPLE TRACKER (#SRIARI)
// ==========================================================================
function initScrollTracker() {
  const progressEl = document.getElementById("trackerProgress");
  const brideEl = document.getElementById("trackerBride");
  const groomEl = document.getElementById("trackerGroom");
  const heartEl = document.getElementById("trackerHeart");
  const mergedEl = document.getElementById("trackerMerged");

  if (!progressEl) return;

  function updateTracker() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    progressEl.style.width = `${(progress * 100).toFixed(1)}%`;

    if (progress < 0.94) {
      const posPercent = progress * 46;

      if (brideEl) {
        brideEl.style.opacity = "1";
        brideEl.style.left = `${posPercent.toFixed(2)}%`;
        brideEl.style.transform = `translateY(-50%) scale(1)`;
      }

      if (groomEl) {
        groomEl.style.opacity = "1";
        groomEl.style.right = `${posPercent.toFixed(2)}%`;
        groomEl.style.transform = `translateY(-50%) scale(1)`;
      }

      if (heartEl) {
        heartEl.style.opacity = `${(0.4 + progress * 0.6).toFixed(2)}`;
        heartEl.style.transform = `translate(-50%, -50%) scale(${(0.9 + progress * 0.4).toFixed(2)})`;
      }

      if (mergedEl) {
        mergedEl.style.opacity = "0";
        mergedEl.style.transform = "translate(-50%, -50%) scale(0.6)";
      }
    } else {
      // Merged state at bottom
      if (brideEl) brideEl.style.opacity = "0";
      if (groomEl) groomEl.style.opacity = "0";
      if (heartEl) heartEl.style.opacity = "0";

      if (mergedEl) {
        mergedEl.style.opacity = "1";
        mergedEl.style.transform = "translate(-50%, -50%) scale(1.08)";
      }
    }
  }

  window.addEventListener("scroll", updateTracker, { passive: true });
  window.addEventListener("resize", updateTracker, { passive: true });
  updateTracker();
}


// ==========================================================================
// 11. SHARE & CLIPBOARD FEATURES
// ==========================================================================
function initShareFeatures() {
  const copyAddressBtn = document.getElementById("copyAddressBtn");
  const shareWhatsAppBtn = document.getElementById("shareWhatsAppBtn");
  const shareLinkBtn = document.getElementById("shareLinkBtn");
  const googleMapsBtn = document.getElementById("googleMapsBtn");
  const venueNameText = document.getElementById("venueNameText");
  const venueAddressText = document.getElementById("venueAddressText");

  if (googleMapsBtn && WEDDING_CONFIG.googleMapsUrl) {
    googleMapsBtn.href = WEDDING_CONFIG.googleMapsUrl;
  }
  if (venueNameText) {
    venueNameText.textContent = WEDDING_CONFIG.venueName;
  }
  if (venueAddressText) {
    venueAddressText.innerHTML = `<span>📍</span> ${escapeHtml(WEDDING_CONFIG.venueAddress)}`;
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", () => {
      copyToClipboard(WEDDING_CONFIG.venueAddress);
      showToast("📋 Venue Address copied to clipboard!");
    });
  }

  if (shareWhatsAppBtn) {
    shareWhatsAppBtn.addEventListener("click", () => {
      const text = encodeURIComponent(
        `🌸 *Subho Vivah Invitation* 🌸\n\n` +
        `Dear Friends & Family,\n` +
        `With great joy, you are cordially invited to celebrate the auspicious Wedding Ceremony of *Srijani & Aritra*!\n\n` +
        `📅 *Date:* Saturday, 12th December 2026\n` +
        `⏰ *Time:* Auspicious Lagna: 7:00 PM Onwards\n` +
        `📍 *Venue:* ${WEDDING_CONFIG.venueName}, Kolkata\n` +
        `🗺️ *Google Maps:* ${WEDDING_CONFIG.googleMapsUrl}\n\n` +
        `✨ Open our interactive royal invitation card here:\n${window.location.href}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    });
  }

  if (shareLinkBtn) {
    shareLinkBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: WEDDING_CONFIG.eventTitle,
          text: `Subho Vivah of Srijani & Aritra on Dec 12, 2026.`,
          url: window.location.href
        }).catch(() => {});
      } else {
        copyToClipboard(window.location.href);
        showToast("🔗 Invitation link copied to clipboard!");
      }
    });
  }
}


// ==========================================================================
// 12. SCROLL REVEAL ANIMATIONS
// ==========================================================================
function revealVisibleElements() {
  const reveals = document.querySelectorAll(".reveal:not(.active)");
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= viewportHeight + 120 && rect.bottom >= -80) {
      el.classList.add("active");
    }
  });
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach((r) => r.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));

  // Immediate check for elements currently in or near viewport
  revealVisibleElements();

  // Scroll event fallback to ensure no content stays hidden
  window.addEventListener("scroll", () => {
    revealVisibleElements();
  }, { passive: true });
}


// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
function showToast(msg) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMsg");
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }
}

function escapeHtml(string) {
  const div = document.createElement("div");
  div.textContent = string;
  return div.innerHTML;
}
