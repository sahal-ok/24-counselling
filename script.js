// ========================================
// MOBILE MENU
// ========================================

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");

  if (mobileMenu.classList.contains("active")) {
    menuButton.textContent = "✕";
  } else {
    menuButton.textContent = "☰";
  }
});


// Close mobile menu when clicking a link

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    menuButton.textContent = "☰";
  });
});


// ========================================
// FAQ ACCORDION
// ========================================

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {

  question.addEventListener("click", () => {

    const currentItem = question.parentElement;

    document.querySelectorAll(".faq-item").forEach((item) => {

      if (item !== currentItem) {
        item.classList.remove("active");
      }

    });

    currentItem.classList.toggle("active");

  });

});


// ========================================
// HEADER SHADOW ON SCROLL
// ========================================

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 20) {
    header.style.boxShadow =
      "0 5px 25px rgba(30, 55, 45, 0.08)";
  } else {
    header.style.boxShadow = "none";
  }

});


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", function (event) {

    const targetId = this.getAttribute("href");

    if (targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {

      event.preventDefault();

      const headerHeight = header.offsetHeight;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    }

  });

});


// ========================================
// SIMPLE SCROLL REVEAL
// ========================================

const revealElements = document.querySelectorAll(
  ".psychologist-card, .service-card, .testimonial, .process-item"
);

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        revealObserver.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.1
  }
);


revealElements.forEach((element) => {

  element.style.opacity = "0";
  element.style.transform = "translateY(25px)";
  element.style.transition =
    "opacity 0.6s ease, transform 0.6s ease";

  revealObserver.observe(element);

});

// ========================================
// VOICE WAVEFORM SWITCH CONTROLLER
// ========================================

function formatVoiceTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function stopAllOtherVoices(currentAudio) {
  document.querySelectorAll(".psychologist-card audio").forEach((otherAudio) => {
    if (otherAudio !== currentAudio) {
      otherAudio.pause();
      otherAudio.currentTime = 0;
      const otherSwitch = document.querySelector(`.voice-waveform-switch[data-audio="${otherAudio.id}"]`);
      if (otherSwitch) {
        otherSwitch.classList.remove("is-playing");
        otherSwitch.setAttribute("aria-checked", "false");
        const statusLabel = otherSwitch.querySelector(".switch-label");
        if (statusLabel) statusLabel.textContent = "Voice Intro";
        const timeDisplay = otherSwitch.querySelector(".switch-time");
        if (timeDisplay) {
          if (otherAudio.duration && !isNaN(otherAudio.duration)) {
            timeDisplay.textContent = formatVoiceTime(otherAudio.duration);
          } else {
            timeDisplay.textContent = "0:00";
          }
        }
        const bars = otherSwitch.querySelectorAll(".wave-bar");
        bars.forEach((bar) => bar.classList.remove("bar-played"));
      }
    }
  });
}

function initVoiceSwitches() {
  const switches = document.querySelectorAll(".voice-waveform-switch");

  switches.forEach((switchEl) => {
    const audioId = switchEl.getAttribute("data-audio");
    const audio = document.getElementById(audioId);
    if (!audio) return;

    const timeDisplay = switchEl.querySelector(".switch-time");
    const track = switchEl.querySelector(".waveform-track");
    const bars = track ? track.querySelectorAll(".wave-bar") : [];
    const statusLabel = switchEl.querySelector(".switch-label");

    // Display duration once audio metadata is available
    const setDurationText = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.currentTime === 0) {
        timeDisplay.textContent = formatVoiceTime(audio.duration);
      }
    };

    if (audio.readyState >= 1) {
      setDurationText();
    } else {
      audio.addEventListener("loadedmetadata", setDurationText);
    }

    // Live update as audio plays
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration || isNaN(audio.duration)) return;

      const progress = audio.currentTime / audio.duration;
      timeDisplay.textContent = formatVoiceTime(audio.currentTime);

      // Highlight waveform bars up to current playback progress
      const totalBars = bars.length;
      const activeBarCount = Math.floor(progress * totalBars);

      bars.forEach((bar, index) => {
        if (index <= activeBarCount && audio.currentTime > 0) {
          bar.classList.add("bar-played");
        } else {
          bar.classList.remove("bar-played");
        }
      });
    });

    // Reset when audio playback finishes
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      switchEl.classList.remove("is-playing");
      switchEl.setAttribute("aria-checked", "false");
      if (statusLabel) statusLabel.textContent = "Voice Intro";
      if (audio.duration && !isNaN(audio.duration)) {
        timeDisplay.textContent = formatVoiceTime(audio.duration);
      } else {
        timeDisplay.textContent = "0:00";
      }
      bars.forEach((bar) => bar.classList.remove("bar-played"));
    });

    // Sync paused state
    audio.addEventListener("pause", () => {
      if (audio.currentTime > 0 && !audio.ended) {
        switchEl.classList.remove("is-playing");
        switchEl.setAttribute("aria-checked", "false");
        if (statusLabel) statusLabel.textContent = "Paused";
      }
    });

    // Sync play state
    audio.addEventListener("play", () => {
      switchEl.classList.add("is-playing");
      switchEl.setAttribute("aria-checked", "true");
      if (statusLabel) statusLabel.textContent = "Playing...";
    });

    // Interactive waveform scrubbing/seeking
    if (track) {
      track.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!audio.duration || isNaN(audio.duration)) return;

        const rect = track.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const seekProgress = clickX / rect.width;
        audio.currentTime = seekProgress * audio.duration;

        if (audio.paused) {
          stopAllOtherVoices(audio);
          audio.play().catch(() => {});
        }
      });
    }
  });
}

function toggleVoiceSwitch(audioId, event) {
  if (event && event.target && event.target.closest(".waveform-track")) {
    return; // Handled by waveform-track seek handler
  }

  const audio = document.getElementById(audioId);
  const switchEl = document.querySelector(`.voice-waveform-switch[data-audio="${audioId}"]`);
  if (!audio || !switchEl) return;

  if (audio.paused) {
    stopAllOtherVoices(audio);
    audio.play().catch((err) => {
      console.warn("Audio playback interrupted or failed:", err);
    });
  } else {
    audio.pause();
  }
}

function handleVoiceSwitchKeydown(audioId, event) {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    toggleVoiceSwitch(audioId);
  }
}

// Backward compatibility alias for any existing callers
function toggleVoice(audioId) {
  toggleVoiceSwitch(audioId);
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVoiceSwitches);
} else {
  initVoiceSwitches();
}