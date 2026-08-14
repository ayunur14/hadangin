const WASM_ROOT = "/mediapipe";
const POSE_MODEL = "/models/pose_landmarker_lite.task";
const HOLD_DURATION = 900;

let landmarker = null;
let DrawingUtils = null;
let FilesetResolver = null;
let PoseLandmarker = null;
let stream = null;
let active = false;
let mounted = false;
let rafId = 0;
let lastVideoTime = -1;
let holdStartedAt = 0;
let lastCompletionAt = 0;
let calibrationStartedAt = 0;
let calibrated = false;
let completedLines = [];
let lastStatusKey = "";

function status(kind, message) {
  const key = `${kind}:${message}`;
  if (key === lastStatusKey) return;
  lastStatusKey = key;
  window.dispatchEvent(new CustomEvent("hadang:vision-status", { detail: { kind, message } }));
}

async function createLandmarker() {
  if (landmarker) return landmarker;
  status("loading", "Memuat model pose AI...");
  if (!PoseLandmarker) {
    ({ DrawingUtils, FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision"));
  }
  const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
  const options = {
    baseOptions: { modelAssetPath: POSE_MODEL, delegate: "GPU" },
    runningMode: "VIDEO",
    numPoses: 1,
    minPoseDetectionConfidence: 0.55,
    minPosePresenceConfidence: 0.55,
    minTrackingConfidence: 0.5,
  };
  try {
    landmarker = await PoseLandmarker.createFromOptions(vision, options);
  } catch {
    options.baseOptions.delegate = "CPU";
    landmarker = await PoseLandmarker.createFromOptions(vision, options);
  }
  return landmarker;
}

function setHoldProgress(value, label) {
  const meter = document.querySelector("#vision-hold-meter");
  const text = document.querySelector("#vision-motion-label");
  if (meter) meter.style.setProperty("--hold", `${Math.round(value * 100)}%`);
  if (text) text.textContent = label;
}

function setPlayerPosition(landmarks) {
  const marker = document.querySelector("#vision-player-marker");
  if (!marker) return;
  const hipX = (landmarks[23].x + landmarks[24].x) / 2;
  const hipY = (landmarks[23].y + landmarks[24].y) / 2;
  marker.style.left = `${Math.min(92, Math.max(8, (1 - hipX) * 100))}%`;
  marker.style.top = `${Math.min(78, Math.max(22, hipY * 100))}%`;
}

function isHadangPose(points) {
  const leftShoulder = points[11];
  const rightShoulder = points[12];
  const leftWrist = points[15];
  const rightWrist = points[16];
  const hipY = (points[23].y + points[24].y) / 2;
  const visible = [leftShoulder, rightShoulder, leftWrist, rightWrist].every((point) => (point.visibility ?? 1) > 0.45);
  const handsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
  const shoulderSpan = Math.abs(leftShoulder.x - rightShoulder.x);
  const armsWide = Math.abs(leftWrist.x - rightWrist.x) > shoulderSpan * 1.65 && leftWrist.y < hipY && rightWrist.y < hipY;
  return visible && (handsUp || armsWide);
}

function drawPose(result, canvas) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!result.landmarks.length) return;
  const drawing = new DrawingUtils(context);
  drawing.drawConnectors(result.landmarks[0], PoseLandmarker.POSE_CONNECTIONS, { color: "#62e6d5", lineWidth: 3 });
  drawing.drawLandmarks(result.landmarks[0], { color: "#ffffff", fillColor: "#2468ef", lineWidth: 1, radius: 3 });
}

function currentLine() {
  return document.querySelector("[data-current-vision-line]")?.dataset.currentVisionLine || "";
}

function detectFrame() {
  cancelAnimationFrame(rafId);
  const video = document.querySelector("#community-vision-video");
  const canvas = document.querySelector("#community-vision-canvas");
  if (!active || !mounted || !video || !canvas || !landmarker) return;

  if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    const now = performance.now();
    const result = landmarker.detectForVideo(video, now);
    drawPose(result, canvas);

    const points = result.landmarks[0];
    if (!points) {
      calibrated = false;
      calibrationStartedAt = 0;
      holdStartedAt = 0;
      status("searching", "Posisikan satu pemain di dalam bingkai");
      setHoldProgress(0, "Tubuh belum terdeteksi");
    } else {
      setPlayerPosition(points);
      if (!calibrated) {
        calibrationStartedAt ||= now;
        const calibrationProgress = Math.min(1, (now - calibrationStartedAt) / 1000);
        status("calibrating", `Kalibrasi ${Math.round(calibrationProgress * 100)}%`);
        setHoldProgress(calibrationProgress, "Berdiri di tengah dan lihat kamera");
        if (calibrationProgress >= 1) {
          calibrated = true;
          holdStartedAt = 0;
          status("ready", "Tubuh terdeteksi - arena siap");
        }
      } else if (!currentLine()) {
        setHoldProgress(0, "Semua garis berhasil dihadang");
      } else if (isHadangPose(points) && now - lastCompletionAt > 1400) {
        holdStartedAt ||= now;
        const progress = Math.min(1, (now - holdStartedAt) / HOLD_DURATION);
        status("tracking", "Pose Hadang terbaca");
        setHoldProgress(progress, progress < 1 ? "Tahan pose Hadang..." : "Garis berhasil dihadang");
        if (progress >= 1) {
          const line = currentLine();
          lastCompletionAt = now;
          holdStartedAt = 0;
          navigator.vibrate?.(80);
          window.dispatchEvent(new CustomEvent("hadang:vision-line-complete", { detail: { line } }));
        }
      } else {
        holdStartedAt = 0;
        status("ready", "Tubuh terdeteksi - arena siap");
        setHoldProgress(0, "Angkat kedua tangan untuk Hadang");
      }
    }
  }
  rafId = requestAnimationFrame(detectFrame);
}

export function setCommunityVisionProgress(lines = []) {
  completedLines = [...lines];
}

export function suspendCommunityVision() {
  mounted = false;
  cancelAnimationFrame(rafId);
  rafId = 0;
  lastStatusKey = "";
}

export function mountCommunityVision(lines = completedLines) {
  setCommunityVisionProgress(lines);
  const video = document.querySelector("#community-vision-video");
  if (!video || !stream || !active) return;
  mounted = true;
  video.srcObject = stream;
  video.play().catch(() => {});
  status(calibrated ? "ready" : "calibrating", calibrated ? "Tubuh terdeteksi - arena siap" : "Menyiapkan kalibrasi");
  detectFrame();
}

export async function startCommunityVision(lines = []) {
  setCommunityVisionProgress(lines);
  if (!navigator.mediaDevices?.getUserMedia) {
    status("error", "Kamera tidak didukung browser ini");
    return false;
  }
  try {
    status("loading", "Meminta izin kamera...");
    stream ||= await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    await createLandmarker();
    active = true;
    calibrated = false;
    calibrationStartedAt = 0;
    mountCommunityVision(lines);
    return true;
  } catch (error) {
    console.error("Community vision could not start", error?.name || "Error", error?.message || String(error), error?.stack || "");
    const denied = error?.name === "NotAllowedError" || error?.name === "SecurityError";
    stopCommunityVision();
    status("error", denied ? "Izin kamera ditolak. Gunakan kontrol manual." : "Model AI gagal dimuat. Gunakan kontrol manual.");
    return false;
  }
}

export function stopCommunityVision() {
  suspendCommunityVision();
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  active = false;
  calibrated = false;
  calibrationStartedAt = 0;
  holdStartedAt = 0;
  lastVideoTime = -1;
  status("idle", "Kamera tidak aktif");
}

export function isCommunityVisionActive() {
  return active;
}
