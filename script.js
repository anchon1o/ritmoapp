
let tapTimes = [];
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const rhythmPattern = [0, 600, 1200, 1800];

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

function playRhythm() {
  const startTime = audioCtx.currentTime;
  rhythmPattern.forEach((offset) => {
    playClick(offset / 1000);
  });
  tapTimes = [];
  document.getElementById("feedbackRepite").textContent = "Ahora repite el ritmo pulsando.";
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
      ? "¡Correcto! Ritmo bien reproducido."
      : "Intenta de nuevo. Revisa el pulso.";
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

let inputValues = [];
function addValue(val) {
  inputValues.push(val);
  updateDisplay();
}
function deleteLast() {
  inputValues.pop();
  updateDisplay();
}
function clearAll() {
  inputValues = [];
  updateDisplay();
}
function updateDisplay() {
  document.getElementById("inputDisplay").textContent = inputValues.join(" ");
}

function showMode(modeId) {
  document.querySelectorAll('.mode').forEach(el => el.style.display = 'none');
  document.getElementById(modeId).style.display = 'block';
}
