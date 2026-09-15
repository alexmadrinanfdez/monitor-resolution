function getAspectRatio(width, height) {
  const divisor = function greatestCommonDivisor(a, b) {
    return b ? greatestCommonDivisor(b, a % b) : a; // Euclidean algorithm
  }(width, height);

  return `${width / divisor}:${height / divisor}`;
}

function formatDimensions(width, height) {
  return [width, String.fromCodePoint(0x00D7), height, "px"].join(" ");
}

function formatNumber(value, compact = false) {
  const divisor = compact ? 1_000_000 : 1;
  const unit = compact ? "Mpx" : "px";

  return `${(value / divisor).toLocaleString()} ${unit}`;
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
  document.getElementById("resolution").textContent = formatNumber(diagnostics.totalPixels, compact=true)
    + ` = ${formatNumber(diagnostics.totalPixels * diagnostics.devicePixelRatio ** 2, compact=true)} physical (device)`;
  document.getElementById("screen-size").textContent = formatDimensions(diagnostics.screenWidth, diagnostics.screenHeight);
  document.getElementById("available-size").textContent = formatDimensions(diagnostics.availableWidth, diagnostics.availableHeight);
  document.getElementById("viewport-size").textContent = formatDimensions(diagnostics.viewportWidth, diagnostics.viewportHeight);
  document.getElementById("device-pixel-ratio").textContent = diagnostics.devicePixelRatio;
  document.getElementById("aspect-ratio").textContent = diagnostics.aspectRatio;
  document.getElementById("orientation").textContent = diagnostics.orientation;
  document.getElementById("total-pixels").textContent = formatNumber(diagnostics.totalPixels);
  document.getElementById("total-pixels").title = `= ${formatNumber(diagnostics.totalPixels, compact=true)}`;
}

function formatDiagnostics(diagnostics) {
  return [
    `Screen: ${formatDimensions(diagnostics.screenWidth, diagnostics.screenHeight)}`,
    `Available screen: ${formatDimensions(diagnostics.availableWidth, diagnostics.availableHeight)}`,
    `Browser viewport: ${formatDimensions(diagnostics.viewportWidth, diagnostics.viewportHeight)}`,
    `Device pixel ratio: ${diagnostics.devicePixelRatio}`,
    `Aspect ratio: ${diagnostics.aspectRatio}`,
    `Orientation: ${diagnostics.orientation}`,
    `Total screen pixels: ${formatNumber(diagnostics.totalPixels)} (${formatNumber(diagnostics.totalPixels, compact=true)})`
  ].join("\n");
}

async function handleButtonAction(type) {
  const status = document.getElementById("action-status");
  const diagnostics = formatDiagnostics(getDiagnostics());

  try {
    if (type === "copy") {
      await navigator.clipboard.writeText(diagnostics);
    } else if (type === "share") {
      await navigator.share({
        title: "Display diagnostics",
        text: diagnostics
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    if (error.name === "AbortError") return;
    status.textContent = `Unable to ${type} diagnostics.`
  }
  status.textContent = `Diagnostics ${type === "copy" ? "copied" : "shared"}.`;
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

copyButton.addEventListener("click", () => handleButtonAction("copy"));
shareButton.addEventListener("click", () => handleButtonAction("share"));

refreshDiagnostics();
