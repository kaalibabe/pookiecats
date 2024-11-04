function createExplosionEffect() {
  if (document.getElementById("explosion-container")) {
    return;
  }

  // Add explosion effect styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .explosion-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9997;
    }

    .explosion {
      position: absolute;
      pointer-events: none;
      animation: explode 0.8s ease-out forwards;
    }

    .shockwave {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, 
        rgba(255,255,255,0.8) 0%, 
        rgba(255,200,100,0.4) 30%, 
        rgba(255,120,50,0.2) 60%, 
        transparent 70%
      );
      transform: scale(0);
      animation: shockwave 0.5s ease-out forwards;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      pointer-events: none;
    }

    .flash {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
    }

    @keyframes explode {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }

    @keyframes shockwave {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(20);
        opacity: 0;
      }
    }

    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-10px) rotate(-1deg); }
      40% { transform: translateX(10px) rotate(1deg); }
      60% { transform: translateX(-10px) rotate(-1deg); }
      80% { transform: translateX(10px) rotate(1deg); }
    }

    .affected-element {
      transition: all 0.3s ease-out;
      animation: element-affect 0.5s ease-out forwards;
    }

    @keyframes element-affect {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(${Math.random() * 10 - 5}deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  `;
  document.head.appendChild(styleSheet);

  const explosionContainer = document.createElement("div");
  explosionContainer.id = "explosion-container";
  explosionContainer.className = "explosion-container";
  document.body.appendChild(explosionContainer);

  // Create flash effect
  function createFlash() {
    const flash = document.createElement("div");
    flash.className = "flash";
    explosionContainer.appendChild(flash);

    flash.style.opacity = "1";
    setTimeout(() => {
      flash.style.transition = "opacity 0.5s ease-out";
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 500);
    }, 50);
  }

  // Create explosion
  function createExplosion(x, y) {
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;

    const shockwave = document.createElement("div");
    shockwave.className = "shockwave";
    shockwave.style.left = "0";
    shockwave.style.top = "0";
    shockwave.style.width = "10px";
    shockwave.style.height = "10px";
    explosion.appendChild(shockwave);

    // Create particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random particle color
      const colors = ["#ff4400", "#ff8800", "#ffaa00", "#ffff00"];
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      // Random particle animation
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 2 + Math.random() * 3;
      const lifetime = 0.5 + Math.random() * 0.5;

      particle.style.animation = `particle-${i} ${lifetime}s ease-out forwards`;

      // Create unique keyframe animation for each particle
      const keyframes = `
        @keyframes particle-${i} {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.cos(angle) * 100 * velocity}px, ${
        Math.sin(angle) * 100 * velocity
      }px);
            opacity: 0;
          }
        }
      `;
      styleSheet.textContent += keyframes;

      explosion.appendChild(particle);
    }

    explosionContainer.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);
  }

  // Screen shake effect
  function shakeScreen() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);
  }

  // Affect nearby elements
  function affectElements(x, y) {
    const elements = document.querySelectorAll("div, p, img, span, a, button");
    elements.forEach((element) => {
      if (
        !element.closest("#explosion-container") &&
        !element.closest("#gif-container")
      ) {
        const rect = element.getBoundingClientRect();
        const elementX = rect.left + rect.width / 2;
        const elementY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(x - elementX, 2) + Math.pow(y - elementY, 2)
        );

        if (distance < 300) {
          element.classList.add("affected-element");
          setTimeout(() => element.classList.remove("affected-element"), 500);
        }
      }
    });
  }

  // Create multiple explosions
  function startExplosions() {
    let explosionCount = 0;
    const maxExplosions = 8;

    function createRandomExplosion() {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      createFlash();
      createExplosion(x, y);
      shakeScreen();
      affectElements(x, y);

      explosionCount++;

      if (explosionCount < maxExplosions) {
        setTimeout(createRandomExplosion, 300 + Math.random() * 500);
      } else {
        setTimeout(() => {
          explosionContainer.remove();
          styleSheet.remove();
        }, 2000);
      }
    }

    createRandomExplosion();
  }

  startExplosions();
}

function createWaterEffect() {
  if (document.getElementById("water-container")) {
    return;
  }

  const waterContainer = document.createElement("div");
  waterContainer.id = "water-container";
  waterContainer.style.position = "fixed";
  waterContainer.style.bottom = "0";
  waterContainer.style.left = "0";
  waterContainer.style.width = "100%";
  waterContainer.style.height = "0";
  waterContainer.style.zIndex = "9998";
  waterContainer.style.pointerEvents = "none";
  waterContainer.style.overflow = "hidden";

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .water-body {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, transparent, #1e90ff 100%);
      bottom: 0;
      transition: height 20s linear;
    }

    .water-surface {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      overflow: hidden;
    }

    .water-waves {
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 140px; /* Increase height for larger waves */
      animation: waveMove 20s linear infinite;
    }

    .wave {
      position: absolute;
      width: 200%;
      height: 100%;
    }

    .wave-highlight {
      background: linear-gradient(90deg, 
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.4) 25%,
        rgba(255,255,255,0.4) 50%,
        rgba(255,255,255,0) 75%
      );
      height: 4px;
      width: 100%;
      position: absolute;
      top: 0;
      animation: highlightMove 10s linear infinite;
    }

    @keyframes highlightMove {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes waveMove {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes riseWater {
      0% { height: 0; }
      100% { height: 100vh; }
    }

    .floating-element {
      transition: all 0.3s ease-out;
      position: relative !important;
      animation: float-drift 8s ease-in-out infinite;
      will-change: transform;
    }

    @keyframes float-drift {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(20px, -20px) rotate(3deg);
      }
      50% {
        transform: translate(0, -40px) rotate(0deg);
      }
      75% {
        transform: translate(-20px, -20px) rotate(-3deg);
      }
      100% {
        transform: translate(0, 0) rotate(0deg);
      }
    }

    .float-delay-1 { animation-delay: -2s; }
    .float-delay-2 { animation-delay: -4s; }
    .float-delay-3 { animation-delay: -6s; }
  `;
  document.head.appendChild(styleSheet);

  const createWaveSVG = (color, opacity, amplitude) => `
    <svg viewBox="0 0 1200 50" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGradient${amplitude}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color}; stop-opacity:${opacity}"/>
          <stop offset="100%" style="stop-color:${color}; stop-opacity:${
    opacity * 0.7
  }"/>
        </linearGradient>
      </defs>
      <path fill="url(#waveGradient${amplitude})" 
            d="M0,30 
               C300,${30 + amplitude} 400,${30 - amplitude * 0.8} 600,30 
               C800,${30 + amplitude} 900,${30 - amplitude * 1.2} 1200,30 
               V50 H0 Z" />
    </svg>
  `;

  const waterSurface = document.createElement("div");
  waterSurface.className = "water-surface";

  const waveColors = ["#40a6ff", "#1e90ff", "#0066cc"];
  for (let i = 0; i < 3; i++) {
    const waveLayer = document.createElement("div");
    waveLayer.className = "water-waves wave";
    waveLayer.style.animation = `waveMove ${16 + i * 3}s linear infinite`;

    const amplitude = 25 - i * 5;
    waveLayer.innerHTML = createWaveSVG(waveColors[i], 1, amplitude);

    if (i === 0) {
      const highlight = document.createElement("div");
      highlight.className = "wave-highlight";
      waveLayer.appendChild(highlight);
    }

    waterSurface.appendChild(waveLayer);
  }

  const waterBody = document.createElement("div");
  waterBody.className = "water-body";

  waterContainer.appendChild(waterBody);
  waterContainer.appendChild(waterSurface);
  document.body.appendChild(waterContainer);

  function isElementUnderwater(element, waterHeight) {
    const rect = element.getBoundingClientRect();
    const elementMiddle = rect.top + rect.height / 2;
    const windowHeight = window.innerHeight;
    const waterLevel = windowHeight - waterHeight;
    return elementMiddle > waterLevel;
  }

  function updateFloatingElements() {
    const waterHeight = parseInt(waterContainer.style.height);
    const elements = document.querySelectorAll("div, p, img, span, a, button");

    elements.forEach((element, index) => {
      if (element.closest("#water-container")) return;

      if (isElementUnderwater(element, waterHeight)) {
        if (!element.classList.contains("floating-element")) {
          element.classList.add("floating-element");
          element.classList.add(`float-delay-${(index % 3) + 1}`);
          const randomRotation = Math.random() * 6 - 3;
          element.style.transform = `rotate(${randomRotation}deg)`;
        }
      } else {
        element.classList.remove("floating-element");
        element.style.transform = "";
      }
    });
  }

  let currentHeight = 0;
  const targetHeight = window.innerHeight;
  const duration = 20000;
  const startTime = Date.now();

  function animateWaterRise() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    currentHeight = progress * targetHeight;
    waterContainer.style.height = `${currentHeight}px`;

    updateFloatingElements();

    if (progress < 1) {
      requestAnimationFrame(animateWaterRise);
    }
  }

  requestAnimationFrame(animateWaterRise);
}

// Function to start the effect
function startFloatingEffect() {
  createWaterEffect();
}
// Then modify the displayGif function by replacing the "Sad" case:

function createFallingEmoji() {
  const emoji = ["🌸", "💫", "⭐", "🎀"][Math.floor(Math.random() * 4)];
  const emojiElement = document.createElement("div");
  emojiElement.innerHTML = emoji;
  emojiElement.style.position = "fixed";
  emojiElement.style.left = Math.random() * 100 + "vw";
  emojiElement.style.top = "-20px";
  emojiElement.style.fontSize = "20px";
  emojiElement.style.zIndex = "9999";
  emojiElement.style.pointerEvents = "none";

  // Add falling animation
  const fallDuration = Math.random() * 3 + 2; // 2-5 seconds
  emojiElement.style.animation = `fall ${fallDuration}s linear`;

  // Create and add keyframe animation if it doesn't exist
  if (!document.querySelector("#falling-animation")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "falling-animation";
    styleSheet.textContent = `
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
        }
        100% {
          transform: translateY(calc(100vh - 30px)) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  document.body.appendChild(emojiElement);

  // When animation ends, position the emoji at the bottom with a random bounce
  emojiElement.addEventListener("animationend", () => {
    emojiElement.style.animation = "none";
    emojiElement.style.position = "fixed";
    emojiElement.style.top = `calc(100vh - ${20 + Math.random() * 10}px)`;

    // Add a small random horizontal adjustment to create a more natural pile effect
    const currentLeft = parseFloat(emojiElement.style.left);
    const randomShift = (Math.random() - 0.5) * 20; // Shift by up to 10px left or right
    emojiElement.style.left = `${currentLeft + randomShift}vw`;

    // Add a slight random rotation for a more natural look
    const randomRotation = (Math.random() - 0.5) * 40; // Random rotation between -20 and 20 degrees
    emojiElement.style.transform = `rotate(${randomRotation}deg)`;
  });
}

function startEmojiRain() {
  // Create emojis continuously
  return setInterval(() => {
    createFallingEmoji();
  }, 100); // Create a new emoji every 100ms
}

let currentEmojiRainInterval = null;

function stopEmojiRain(intervalId) {
  clearInterval(intervalId);
}
function categorizeTweet(text) {
  const sadKeywords = [
    "sad",
    "unhappy",
    "depressed",
    "down",
    "blue",
    "heartbroken",
    "disappointed",
    "melancholy",
    "mournful",
    "tearful",
    "grieving",
    "sorrowful",
    "miserable",
    "gloomy",
    "distressed",
    "pained",
    "hurt",
    "lonely",
    "weary",
    "forlorn",
    "anguish",
    "regretful",
    "cry",
    "unfulfilled",
    "hopeless",
    "isolated",
    "lost",
    "empty",
    "despair",
  ];

  const happyKeywords = [
    "happy",
    "joy",
    "excited",
    "love",
    "glad",
    "cheerful",
    "delighted",
    "content",
    "ecstatic",
    "thrilled",
    "elated",
    "euphoric",
    "grateful",
    "satisfied",
    "bright",
    "optimistic",
    "positive",
    "blessed",
    "upbeat",
    "jubilant",
    "blissful",
    "radiant",
    "peaceful",
    "relaxed",
    "smiling",
    "cheery",
    "pleasant",
    "wonderful",
    "amazing",
    "great",
    "fantastic",
    "joyful",
    "fun",
    "laugh",
    "sunshine",
    "good vibes",
    "high spirits",
    "carefree",
  ];

  const confusedKeywords = [
    "confused",
    "perplexed",
    "unsure",
    "uncertain",
    "puzzled",
    "lost",
    "baffled",
    "mystified",
    "bewildered",
    "doubt",
    "question",
    "unclear",
    "ambiguous",
    "complex",
    "complicated",
    "confounding",
    "torn",
    "dilemma",
    "debate",
    "struggle",
    "hazy",
    "cloudy",
    "blurred",
    "dazed",
    "hesitant",
    "iffy",
    "muddled",
    "undecided",
  ];

  const angerKeywords = [
    "angry",
    "furious",
    "rage",
    "hate",
    "annoyed",
    "irritated",
    "mad",
    "offended",
    "frustrated",
    "enraged",
    "outraged",
    "resentful",
    "bitter",
    "disgusted",
    "vengeful",
    "upset",
    "hostile",
    "exasperated",
    "livid",
    "infuriated",
    "wrathful",
    "pissed",
    "fuming",
    "incensed",
    "boiling",
    "seething",
    "hateful",
    "scornful",
    "indignant",
    "irate",
    "provoked",
    "aggravated",
    "rebellious",
    "defiant",
    "aggressive",
    "grudge",
  ];
  if (sadKeywords.some((word) => text.toLowerCase().includes(word))) {
    return "Sad";
  } else if (happyKeywords.some((word) => text.toLowerCase().includes(word))) {
    return "Happy";
  } else if (angerKeywords.some((word) => text.toLowerCase().includes(word))) {
    return "Anger";
  } else if (
    confusedKeywords.some((word) => text.toLowerCase().includes(word))
  ) {
    return "Confused";
  } else {
    return "Uncategorized";
  }
}
function displayGif(category) {
  const gifContainer =
    document.getElementById("gif-container") || document.createElement("div");
  gifContainer.id = "gif-container";
  gifContainer.style.position = "fixed";
  gifContainer.style.bottom = "10px";
  gifContainer.style.right = "10px";
  gifContainer.style.zIndex = "9999";
  document.body.appendChild(gifContainer);

  gifContainer.innerHTML = ""; // Clear previous GIFs
  let gifSrc;

  switch (category) {
    case "Sad":
      gifSrc = chrome.runtime.getURL("memeCats/memes/sad.gif");
      if (currentEmojiRainInterval) {
        stopEmojiRain(currentEmojiRainInterval);
      }

      // Create and play the audio element
      const audio1 = new Audio(
        chrome.runtime.getURL("memeCats/memes/crying.mpga")
      );
      audio1.loop = true; // Enable looping
      audio1.play();

      setTimeout(() => startFloatingEffect(), 5000);
      break;

    case "Happy":
      gifSrc = chrome.runtime.getURL("memeCats/memes/happy.gif");
      if (!currentEmojiRainInterval) {
        currentEmojiRainInterval = startEmojiRain();
      }

      const audio2 = new Audio(
        chrome.runtime.getURL("memeCats/memes/happy.mpga")
      );
      audio2.loop = true; // Enable looping
      console.log("Playing audio");
      audio2.play();

      break;

    case "Anger":
      gifSrc = chrome.runtime.getURL("memeCats/memes/angry.gif");
      if (currentEmojiRainInterval) {
        stopEmojiRain(currentEmojiRainInterval);
      }

      const audio3 = new Audio(
        chrome.runtime.getURL("memeCats/memes/bomb.mpga")
      );
      audio3.loop = true; // Enable looping
      console.log("Playing audio");
      audio3.play();
      createExplosionEffect();
      break;

    case "Confused":
      gifSrc = chrome.runtime.getURL("memeCats/memes/confused.gif");
      if (currentEmojiRainInterval) {
        stopEmojiRain(currentEmojiRainInterval);
      }
      // For Confused, add a question mark rain animation
      const audio4 = new Audio(
        chrome.runtime.getURL("memeCats/memes/huh.mpga")
      );
      audio4.loop = true; // Enable looping
      console.log("Playing audio");
      audio4.play();
      break;

    default:
      gifSrc = chrome.runtime.getURL("memeCats/memes/default.gif");
  }

  const gif = document.createElement("img");
  gif.src = gifSrc;
  gif.style.maxWidth = "150px";
  gifContainer.appendChild(gif);

  if (category === "Confused") {
    const questionMark = document.createElement("div");
    gif.style.transform = "scale(1)";
    gif.style.transition = "transform 2s ease-in-out";

    const repeatAnimation = () => {
      gif.style.transform = "scale(10)";
      setTimeout(() => {
        gif.style.transform = "scale(1)";
        setTimeout(repeatAnimation, 2000); // Repeat after the transition duration
      }, 2000); // Duration of the scale-up transition
    };

    setTimeout(repeatAnimation, 2500); // Start after 2.5 seconds
  }
}

function waitForTweetText() {
  let lastText = "";

  const observer = new MutationObserver(() => {
    const tweetTextElement = document.querySelector(
      '[data-testid="tweetText"]'
    );
    if (tweetTextElement) {
      const tweetText = tweetTextElement.innerText;

      if (tweetText !== lastText) {
        const category = categorizeTweet(tweetText);
        console.log(`Tweet: "${tweetText}"`);
        console.log(`Category: ${category}`);
        displayGif(category);
        lastText = tweetText;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Call the function to start observing
waitForTweetText();
