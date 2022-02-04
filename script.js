let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let windowHeight = window.outerHeight * 0.4;
let windowWidth = window.outerWidth - 100;
var fps = 30;

var serveHandUpScore = 100;

const detectorConfig = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
};

// var upValue = 150;
// var downValue = 130;

// var threshHoldKneeAnkleDistance = 30;
let detector;

var canCountIncrease = false;
var countValue = 0;

const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: windowWidth, height: windowHeight },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      // document.getElementById("goalCount").innerHTML = goalCount;
    });
};

const detectPose = async () => {
  // alert(document.getElementById("video").offsetWidth)
  const poses = await detector.estimatePoses(document.querySelector("video"));

  // const predictions = await model.estimateHands(document.querySelector("video"));
  console.log(poses);

  // temporary area
  if (poses.length) {
  

    let right_wrist = poses[0].keypoints.find((x) => x.name == "right_wrist");
    let right_hip = poses[0].keypoints.find((x) => x.name == "right_hip");


    let left_wrist = poses[0].keypoints.find((x) => x.name == "left_wrist");
    let left_hip = poses[0].keypoints.find((x) => x.name == "left_hip");

    if (
      right_wrist.score > 0.5 &&
      right_hip.score > 0.5 &&
      left_wrist.score > 0.5 &&
      left_hip.score > 0.5
    ) {
      document.getElementById("message").innerHTML =
        "We are good to count Squarts now ";

      var rightWristAndHeapDistance = distanceBetweenTwo(
        left_wrist.x,
        left_hip.x,
        left_wrist.y,
        left_hip.y
      );
      
      var leftWristAndHeapDistance = distanceBetweenTwo(
        right_wrist.x,
        right_hip.x,
        right_wrist.y,
        right_hip.y
      );
       document.getElementById("rightWristAndHeapDistance").innerHTML = rightWristAndHeapDistance;
       document.getElementById("leftWristAndHeapDistance").innerHTML = leftWristAndHeapDistance;
      
        //if both hands are up
        if(rightWristAndHeapDistance > serveHandUpScore && leftWristAndHeapDistance > serveHandUpScore){

        }

    } else {
      document.getElementById("message").innerHTML =
        "We are not able to see your whole body";
    }
  }

  //temporary area

  // if (poses.length) angleCalculation(poses[0].keypoints);
  // canvas.width = windowWidth;
  // canvas.height = windowHeight;
  ctx.drawImage(video, 0, 0, windowWidth, windowHeight);

  poses.forEach((eachPose) => {
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "blue";
    //  ctx.rect(
    //   eachPose.keypoints.topLeft[0],
    //   eachPose.keypoints.topLeft[1],
    //   eachPose.keypoints.bottomRight[0] -eachPose.keypoints.topLeft[0],
    //   eachPose.keypoints.bottomRight[1] -eachPose.keypoints.topLeft[1]

    //  )

    ctx.fillStyle = "red";
    eachPose.keypoints.forEach((key, index) => {
      ctx.fillRect(key.x, key.y, 5, 5);

      // if(index == 0){
      //   ctx.moveTo(0, 0);
      // }
      // ctx.lineTo(key.x, key.y);
    });
    // ctx.lineTo(1,5,5,100,25,20);

    ctx.stroke();
  });
};

setupCamera();
video.addEventListener("loadeddata", async () => {
  // document.getElementById("video").offsetWidth, document.getElementById("video").offsetHeight

  canvas.width = document.getElementById("video").offsetWidth;
  canvas.height = document.getElementById("video").offsetHeight;
  canvas.setAttribute("width", windowWidth);
  canvas.setAttribute("height", windowHeight);
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );

  document.getElementById("loadingText").innerHTML =
    "Please stand in camera so that it can see full body";

  // document.getElementById("upscoreThreshold").innerHTML =upValue;
  // document.getElementById("downscoreThreshold").innerHTML =downValue;

  setInterval(detectPose, fps);
});

function sendMessagetoFlutter(value) {
  console.log(value);
  // window.CHANNEL_NAME.postMessage('Hello from JS');
}

function distanceBetweenTwo(x2, x1, y2, y1) {
  var a = x2 - x1;
  var b = y2 - y1;

  return Math.sqrt(a * a + b * b);
}
