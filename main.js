const statusEl = document.getElementById('status');
const startButton = document.getElementById('start');
const video = document.getElementById('video');
const emojiEl = document.getElementById('emoji');
const emojiLabel = document.getElementById('emoji-label');
const expressionList = document.getElementById('expression-list');

const expressionEmoji = {
  neutral: '😐',
  happy: '😀',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😮'
};

let detectionInterval;
let isModelReady = false;

async function loadModels() {
  const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
  statusEl.textContent = 'Downloading models…';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
  ]);
  statusEl.textContent = 'Models ready. Start the camera to begin!';
  startButton.disabled = false;
  isModelReady = true;
}

async function startCamera() {
  if (!isModelReady) return;
  startButton.disabled = true;
  statusEl.textContent = 'Requesting camera permission…';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    statusEl.textContent = 'Looking for faces…';
    runDetection();
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Camera permission denied or unavailable.';
    startButton.disabled = false;
  }
}

async function runDetection() {
  clearInterval(detectionInterval);
  detectionInterval = setInterval(async () => {
    if (video.readyState < 2) return;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) {
      statusEl.textContent = 'No face detected. Try adjusting lighting or framing.';
      updateDisplay('neutral', {});
      return;
    }

    const { expressions } = detection;
    const [topExpression] = Object.entries(expressions).sort(([, a], [, b]) => b - a);
    const [name, score] = topExpression;

    statusEl.textContent = 'Face detected!';
    updateDisplay(name, expressions, score);
  }, 300);
}

function updateDisplay(expressionName, scores) {
  const emoji = expressionEmoji[expressionName] || '😐';
  emojiEl.textContent = emoji;
  emojiEl.setAttribute('aria-label', `${expressionName} face`);
  emojiLabel.textContent = expressionName;

  expressionList.innerHTML = '';
  Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .forEach(([name, score]) => {
      const row = document.createElement('li');
      row.className = 'expression-row';

      const label = document.createElement('span');
      label.className = 'expression-name';
      label.textContent = name;

      const value = document.createElement('span');
      value.className = 'expression-score';
      value.textContent = `${(score * 100).toFixed(1)}%`;

      row.append(label, value);
      expressionList.appendChild(row);
    });
}

startButton.addEventListener('click', startCamera);
loadModels();
