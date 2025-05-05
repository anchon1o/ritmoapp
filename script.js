
let figures = [];

function addFigure(filename) {
  figures.push(filename);
  renderFigures();
}

function removeLast() {
  figures.pop();
  renderFigures();
}

function clearFigures() {
  figures = [];
  renderFigures();
}

function renderFigures() {
  const container = document.getElementById("figureDisplay");
  container.innerHTML = '';
  figures.forEach(f => {
    const img = document.createElement("img");
    img.src = "svg/" + f;
    container.appendChild(img);
  });
}

function playRhythm() {
  // Aquí iría el audio real del dictado (de momento es solo informativo)
  alert("🎵 (Reproducir ritmo original aquí)");
}

function checkAnswer() {
  const expected = ["negra.svg", "dos_corcheas.svg", "silencio_negra.svg"];
  const feedback = document.getElementById("feedback");
  if (figures.length !== expected.length) {
    feedback.textContent = "❌ Longitud incorrecta.";
    return;
  }
  let correct = true;
  for (let i = 0; i < expected.length; i++) {
    if (figures[i] !== expected[i]) {
      correct = false;
      break;
    }
  }
  feedback.textContent = correct ? "✅ ¡Correcto!" : "❌ Intenta de nuevo.";
}

const rhythmPattern = [0, 600, 1200, 1800];
let tapTimes = [];
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClick(timeOffset = 0) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 1000;
  gain.gain.setValueAtTime(1, audioCtx.currentTime + timeOffset);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + timeOffset + 0.1);
  osc.start(audioCtx.currentTime + timeOffset);
  osc.stop(audioCtx.currentTime + timeOffset + 0.1);
}

function registerTap() {
  const now = performance.now();
  if (tapTimes.length === 0 || now - tapTimes[0] < 5000) {
    tapTimes.push(now);
    playClick();
  }
  if (tapTimes.length === rhythmPattern.length) {
    const base = tapTimes[0];
    const deltas = tapTimes.map(t => Math.round(t - base));
    let correct = true;
    for (let i = 1; i < deltas.length; i++) {
      const expected = rhythmPattern[i];
      const actual = deltas[i];
      if (Math.abs(expected - actual) > 150) correct = false;
    }
    document.getElementById("feedbackRepite").textContent = correct
      ? "✅ ¡Correcto!"
      : "❌ Intenta de nuevo.";
  }
}

function startMetronome() {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= 4) {
      clearInterval(interval);
      return;
    }
    playClick();
    i++;
  }, 600);
}

function showMode(modeId) {
  document.querySelectorAll('.mode').forEach(el => el.style.display = 'none');
  document.getElementById(modeId).style.display = 'block';
}
