(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;
  let isMovingToButton = false;
  let shouldMoveRandom = false;
  let currentButton = null;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 50;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function getRandomPosition() {
    const margin = 50;
    return {
      x: Math.random() * (window.innerWidth - 2 * margin) + margin,
      y: Math.random() * (window.innerHeight - 2 * margin) + margin,
    };
  }

  function waitForLikeButton() {
    const observer = new MutationObserver((mutations, obs) => {
      const targetButton = document.querySelector(
        'button[aria-label*="like this video"]'
      );
      if (targetButton) {
        obs.disconnect();
        observeLikeButton(targetButton);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function observeLikeButton(targetButton) {
    console.log("Like button found, setting up observer");

    const callback = (mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-pressed" &&
          targetButton.getAttribute("aria-pressed") === "true"
        ) {
          moveToButton(targetButton);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetButton, { attributes: true });

    targetButton.addEventListener("click", () => {
      if (targetButton.getAttribute("aria-pressed") === "true") {
        moveToButton(targetButton);
      }
    });
  }

  function init() {
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;
    nekoEl.style.scale = 2;

    const nekoFile = chrome.runtime.getURL("oneko.js/oneko.gif");
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat;
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;

    document.body.appendChild(nekoEl);
    waitForLikeButton();
    window.requestAnimationFrame(onAnimationFrame);
  }

  function moveToButton(button) {
    const rect = button.getBoundingClientRect();
    mousePosX = rect.left + rect.width / 2;
    mousePosY = rect.top + rect.height / 2;
    isMovingToButton = true;
    currentButton = button;
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      if (isMovingToButton && currentButton) {
        isMovingToButton = false;
        // Click the button after reaching it
        setTimeout(() => {
          currentButton.click();
          // After clicking, wait a moment and then move to random position
          setTimeout(() => {
            const randomPos = getRandomPosition();
            mousePosX = randomPos.x;
            mousePosY = randomPos.y;
            shouldMoveRandom = true;
            currentButton = null;
          }, 500);
        }, 500);
      } else if (shouldMoveRandom) {
        shouldMoveRandom = false;
      }
      return;
    }

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  function idle() {
    idleTime += 1;
    if (!isMovingToButton && !shouldMoveRandom) {
      setSprite("idle", 0);
    }
  }

  init();
})();
