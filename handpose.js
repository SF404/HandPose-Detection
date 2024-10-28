
// npm install @mediapipe/hands @tensorflow-models/hand-pose-detection @tensorflow/tfjs

import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';  

async function loadHandPoseModel() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: 'mediapipe', 
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    modelType: 'full', 
  };

  const detector = await handPoseDetection.createDetector(model, detectorConfig);
  console.log('Hand pose model loaded');
  return detector;
}

// Start the webcam stream and detect hand poses
async function detectHandPoses(detector) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      const videoElement = document.getElementById('remoteVideo');
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        setInterval(async () => {
          const hands = await detector.estimateHands(videoElement);

          
          if (hands.length > 0) {
            console.log(hands)
            hands.forEach((hand) => {
              console.log(`Handedness: ${hand.handedness}`);
              console.log(`Score: ${hand.score}`);
              hand.keypoints.forEach((keypoint, index) => {
                let translatedText = document.getElementById('translatedText').innerHTML = hand.handedness;

              });
            });
          }
          else {
            document.getElementById('translatedText').innerHTML = "nothing";
          }
        }, 1000 / 30);  
      };
    });
}

async function main() {
  const detector = await loadHandPoseModel();
  detectHandPoses(detector);
}

main();

