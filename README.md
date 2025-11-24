# Emoji Camera

Static GitHub Pages site that uses your webcam and the `face-api.js` expression model to map your live facial expression to a matching emoji.

## How it works

1. On load we download the face detection and expression models directly from the `face-api.js` CDN weights.
2. Click **Start camera** to grant webcam permission (no data leaves your browser).
3. The app finds a face with `TinyFaceDetector` and reads the strongest expression every 300 ms.
4. We display the top expression as a large emoji and list the confidence scores for all detected expressions.

## Running locally

Just open `index.html` in your browser. Because the face-api models are pulled from a CDN, there is nothing to install.

## Deploying to GitHub Pages

1. Commit these files to your repository.
2. Push to GitHub and enable **Pages** to publish from the `work` branch (or `main`, depending on your default).
3. Visit the published URL and grant camera access when prompted.

## Privacy

All inference runs inside the browser. Video frames never leave the device.
