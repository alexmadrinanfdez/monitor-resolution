function getAspectRatio(width, height) {
  const divisor = function greatestCommonDivisor(a, b) {
    return b ? greatestCommonDivisor(b, a % b) : a; // Euclidean algorithm
  }(width, height);

  return `${width / divisor}:${height / divisor}`;
}

function getDiagnostics() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  return {
    screenWidth: screenWidth,
    screenHeight: screenHeight,
    availableWidth: screen.availWidth,
    availableHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    aspectRatio: getAspectRatio(screenWidth, screenHeight),
    orientation: screenWidth >= screenHeight ? "Landscape" : "Portrait",
    totalPixels: screenWidth * screenHeight
  };
}

function renderDiagnostics(diagnostics) {
  document.getElementById("width").textContent = diagnostics.screenWidth;
  document.getElementById("height").textContent = diagnostics.screenHeight;
  document.getElementById("resolution").textContent = `${diagnostics.totalPixels}px`;
  document.getElementById("screen-size").textContent = `${diagnostics.screenWidth} x ${diagnostics.screenHeight}`;
  document.getElementById("available-size").textContent = `${diagnostics.availableWidth} x ${diagnostics.availableHeight}`;
  document.getElementById("viewport-size").textContent = `${diagnostics.viewportWidth} x ${diagnostics.viewportHeight}`;
  document.getElementById("device-pixel-ratio").textContent = diagnostics.devicePixelRatio;
  document.getElementById("aspect-ratio").textContent = diagnostics.aspectRatio;
  document.getElementById("orientation").textContent = diagnostics.orientation;
  document.getElementById("total-pixels").textContent = diagnostics.totalPixels.toLocaleString();
}

function formatDiagnostics(diagnostics) {
  return [
    `Screen: ${diagnostics.screenWidth} x ${diagnostics.screenHeight} CSS px`,
    `Available screen: ${diagnostics.availableWidth} x ${diagnostics.availableHeight} CSS px`,
    `Browser viewport: ${diagnostics.viewportWidth} x ${diagnostics.viewportHeight} CSS px`,
    `Device pixel ratio: ${diagnostics.devicePixelRatio}`,
    `Aspect ratio: ${diagnostics.aspectRatio}`,
    `Orientation: ${diagnostics.orientation}`,
    `Total screen pixels: ${diagnostics.totalPixels.toLocaleString()}`
  ].join("\n");
}

async function copyDiagnostics() {
  try {
    await navigator.clipboard.writeText(formatDiagnostics(getDiagnostics()));
    document.getElementById("action-status").textContent = "Diagnostics copied.";
  } catch (error) {
    document.getElementById("action-status").textContent = "Unable to copy diagnostics.";
  }
}

async function shareDiagnostics() {
  try {
    await navigator.share({
      title: "Display diagnostics",
      text: formatDiagnostics(getDiagnostics())
    });
    document.getElementById("action-status").textContent = "Diagnostics shared.";
  } catch (error) {
    if (error.name !== "AbortError") {
      document.getElementById("action-status").textContent = "Unable to share diagnostics.";
    }
  }
}

function refreshDiagnostics() {
  renderDiagnostics(getDiagnostics());
}

let refreshFrameId;

function scheduleRefresh() {
  if (refreshFrameId) {
    return; // throttle updates - one per animation frame
  }
  refreshFrameId = window.requestAnimationFrame(() => {
    refreshFrameId = null;
    refreshDiagnostics();
  });
}

window.addEventListener("resize", scheduleRefresh);
window.addEventListener("orientationchange", scheduleRefresh);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", scheduleRefresh);
}

const copyButton = document.getElementById("copy-diagnostics");
const shareButton = document.getElementById("share-diagnostics");

if (navigator.share) {
  shareButton.hidden = false;
}

copyButton.addEventListener("click", copyDiagnostics);
shareButton.addEventListener("click", shareDiagnostics);

refreshDiagnostics();
