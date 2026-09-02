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
  document.getElementById("screen-size").textContent = `${diagnostics.screenWidth}  x ${diagnostics.screenHeight}`;
  document.getElementById("available-size").textContent = `${diagnostics.availableWidth} x ${diagnostics.availableHeight}`;
  document.getElementById("viewport-size").textContent = `${diagnostics.viewportWidth} x ${diagnostics.viewportHeight}`;
  document.getElementById("device-pixel-ratio").textContent = diagnostics.devicePixelRatio;
  document.getElementById("aspect-ratio").textContent = diagnostics.aspectRatio;
  document.getElementById("orientation").textContent = diagnostics.orientation;
  document.getElementById("total-pixels").textContent = diagnostics.totalPixels.toLocaleString();
}

renderDiagnostics(getDiagnostics());
