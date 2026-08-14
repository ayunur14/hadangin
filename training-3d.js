import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const GUARDS = [
  {
    key: "J",
    name: "Jeda",
    color: 0xe9a20b,
    position: [-1.8, 0, 1.8],
    scenario: "family-emergency",
    description:
      "Hentikan tekanan waktu sebelum informasi bergerak menuju tindakan.",
  },
  {
    key: "E",
    name: "Emosi",
    color: 0xdb5362,
    position: [1.7, 0, -1.6],
    scenario: "viral-info",
    description:
      "Kenali rasa takut, panik, marah, atau FOMO yang sedang dipancing.",
  },
  {
    key: "D",
    name: "Data",
    color: 0x2d75e8,
    position: [5.7, 0, 1.8],
    scenario: "manipulated-media",
    description:
      "Pisahkan klaim dari bukti yang dapat diperiksa secara independen.",
  },
  {
    key: "A",
    name: "Aksi",
    color: 0x13a391,
    position: [9.1, 0, -1.6],
    scenario: "qr-payment",
    description:
      "Nilai risiko klik, scan, transfer, atau share sebelum bertindak.",
  },
];

let activeExperience = null;

function makeLabel(
  text,
  foreground = "#ffffff",
  background = "#0f172a",
  width = 320,
  height = 112
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  context.fillStyle = background;
  context.roundRect(4, 4, width - 8, height - 8, 24);
  context.fill();
  context.strokeStyle = "rgba(255,255,255,.32)";
  context.lineWidth = 4;
  context.stroke();
  context.fillStyle = foreground;
  context.font = `800 ${Math.round(height * 0.42)}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, width / 2, height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
  );
  sprite.scale.set((width / height) * 1.12, 1.12, 1);
  return sprite;
}

function box(width, height, depth, color, roughness = 0.78) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 })
  );
}

function addCourt(scene) {
  const court = new THREE.Group();
  court.position.set(5.4, 0, 0);

  const ground = box(17.5, 0.24, 10.5, 0x9a6741);
  ground.position.y = -0.16;
  ground.receiveShadow = true;
  court.add(ground);

  const inner = box(16.7, 0.04, 9.7, 0xb68055);
  inner.position.y = -0.015;
  inner.receiveShadow = true;
  court.add(inner);

  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    emissive: 0x2b2014,
    emissiveIntensity: 0.12,
  });
  const line = (width, depth, x, z) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.065, depth),
      lineMaterial
    );
    mesh.position.set(x, 0.05, z);
    mesh.receiveShadow = true;
    court.add(mesh);
  };
  line(16.4, 0.1, 0, -4.55);
  line(16.4, 0.1, 0, 4.55);
  line(0.1, 9.2, -8.15, 0);
  line(0.1, 9.2, 8.15, 0);
  [-5.1, -1.7, 1.7, 5.1].forEach((x) => line(0.1, 9.2, x, 0));
  line(16.4, 0.1, 0, 0);

  [-5.1, -1.7, 1.7, 5.1].forEach((x, index) => {
    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.08, 9.15),
      new THREE.MeshStandardMaterial({
        color: GUARDS[index].color,
        emissive: GUARDS[index].color,
        emissiveIntensity: 1.15,
      })
    );
    glow.position.set(x, 0.08, 0);
    glow.userData.pulseOffset = index * 0.55;
    court.add(glow);
  });

  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0x24465b,
    roughness: 0.85,
  });
  const borders = [
    [17.9, 0.2, 0.25, 0, 0, -5.1],
    [17.9, 0.2, 0.25, 0, 0, 5.1],
    [0.25, 0.2, 10.4, -8.8, 0, 0],
    [0.25, 0.2, 10.4, 8.8, 0, 0],
  ];
  borders.forEach(([w, h, d, x, y, z]) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), borderMaterial);
    mesh.position.set(x, y, z);
    court.add(mesh);
  });
  scene.add(court);
  return court;
}

function createGuard(config, index) {
  const group = new THREE.Group();
  group.position.set(...config.position);
  group.userData.guard = config;
  group.userData.baseY = 0;
  group.userData.phase = index * 0.8;

  const skin = new THREE.MeshStandardMaterial({
    color: index === 3 ? 0xa96543 : 0xd99b70,
    roughness: 0.85,
  });
  const uniform = new THREE.MeshStandardMaterial({
    color: config.color,
    roughness: 0.65,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x142138,
    roughness: 0.8,
  });

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.42, 0.72, 4, 8),
    uniform
  );
  torso.position.y = 1.48;
  torso.castShadow = true;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), skin);
  head.position.y = 2.45;
  head.castShadow = true;
  group.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.56),
    dark
  );
  hair.position.y = 2.56;
  hair.castShadow = true;
  group.add(hair);

  const makeLimb = (x, y, rotation, material, length = 0.82) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    pivot.rotation.z = rotation;
    const limb = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.12, length, 3, 7),
      material
    );
    limb.position.y = -length * 0.46;
    limb.castShadow = true;
    pivot.add(limb);
    group.add(pivot);
    return pivot;
  };
  group.userData.leftArm = makeLimb(-0.48, 1.77, -0.5, uniform, 0.72);
  group.userData.rightArm = makeLimb(0.48, 1.77, 0.5, uniform, 0.72);
  group.userData.leftLeg = makeLimb(-0.23, 1.0, -0.12, dark, 0.82);
  group.userData.rightLeg = makeLimb(0.23, 1.0, 0.12, dark, 0.82);

  const badge = makeLabel(
    config.key,
    "#ffffff",
    `#${config.color.toString(16).padStart(6, "0")}`,
    120,
    120
  );
  badge.position.set(0, 3.22, 0);
  badge.scale.set(0.84, 0.84, 1);
  badge.userData.guard = config;
  group.add(badge);

  const name = makeLabel(
    config.name.toUpperCase(),
    "#e8f1ff",
    "rgba(15,23,42,.88)"
  );
  name.position.set(0, 2.93, 0);
  name.scale.set(1.7, 0.58, 1);
  name.userData.guard = config;
  group.add(name);

  group.traverse((child) => {
    child.userData.guard = config;
  });
  return group;
}

function addVillage(scene) {
  const village = new THREE.Group();
  village.position.set(1.1, 0, -7.1);

  const platform = box(8.6, 0.28, 2.1, 0x4b3328);
  platform.position.set(-1.6, 0.1, 0);
  platform.receiveShadow = true;
  village.add(platform);

  const flag = (x) => {
    const pole = box(0.08, 3.5, 0.08, 0xdddddd);
    pole.position.set(x, 1.75, 1.25);
    village.add(pole);
    const red = box(1.1, 0.42, 0.04, 0xd82f3e);
    red.position.set(x + 0.58, 3.15, 1.25);
    village.add(red);
    const white = box(1.1, 0.42, 0.04, 0xf8fafc);
    white.position.set(x + 0.58, 2.74, 1.25);
    village.add(white);
  };
  flag(7.3);

  [6.4, 7.2].forEach((x, index) => {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.38, 0.45, 8),
      new THREE.MeshStandardMaterial({ color: 0x915037 })
    );
    pot.position.set(x, 0.48, 1.2);
    village.add(pot);
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(0.52 + (index % 2) * 0.12, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x276647, roughness: 1 })
    );
    crown.scale.y = 1.3;
    crown.position.set(x, 1.13, 1.2);
    village.add(crown);
  });
  scene.add(village);
}

function createInfoToken() {
  const group = new THREE.Group();
  const card = box(1.15, 0.82, 0.16, 0xd54756, 0.55);
  card.castShadow = true;
  group.add(card);
  const label = makeLabel("!", "#ffffff", "#d54756", 100, 100);
  label.position.set(0, 0, 0.1);
  label.scale.set(0.58, 0.58, 1);
  group.add(label);
  group.position.set(-7.7, 0.78, 0);
  group.rotation.y = 0.16;
  return group;
}

function createExperience(container) {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x091327);
  scene.fog = new THREE.Fog(0x091327, 18, 36);

  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 80);
  const defaultCamera = new THREE.Vector3(14.5, 12.5, 17.5);
  camera.position.copy(defaultCamera);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "training-3d-canvas";
  container.replaceChildren(renderer.domElement);

  const ambient = new THREE.HemisphereLight(0xb8d9ff, 0x43291f, 1.65);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffedcf, 2.25);
  sun.position.set(-6, 15, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  scene.add(sun);
  const rim = new THREE.PointLight(0x32c7d4, 28, 24, 2);
  rim.position.set(10, 5, -2);
  scene.add(rim);

  const court = addCourt(scene);
  addVillage(scene);
  const guards = GUARDS.map((guard, index) => {
    const figure = createGuard(guard, index);
    scene.add(figure);
    return figure;
  });
  const token = createInfoToken();
  scene.add(token);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableRotate = true;
  controls.enableZoom = false;
  controls.minDistance = 13;
  controls.maxDistance = 27;
  controls.minPolarAngle = 0.58;
  controls.maxPolarAngle = 1.25;
  controls.minAzimuthAngle = -0.62;
  controls.maxAzimuthAngle = 0.62;
  controls.target.set(2.6, 0.75, 0);
  controls.update();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const groundPoint = new THREE.Vector3();
  const clock = new THREE.Clock();
  let paused = reducedMotion;
  let frame = 0;
  let selected = GUARDS[0];
  let hovered = null;
  let dragGuard = null;

  selectGuard(selected);

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function pick(event, commit = false) {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster
      .intersectObjects(guards, true)
      .find((item) => item.object.userData.guard);
    hovered = hit?.object.userData.guard || null;
    renderer.domElement.classList.toggle("is-pointing", Boolean(hovered));
    if (commit && hovered) selectGuard(hovered);
  }

  function selectGuard(guard) {
    selected = guard;
    const inspector = document.querySelector(".training-3d-inspector");
    if (!inspector) return;
    inspector.classList.add("active");
    inspector.querySelector("span").textContent = `Garis ${guard.key}`;
    inspector.querySelector("strong").textContent = guard.name;
    inspector.querySelector("p").textContent = guard.description;
    const button = inspector.querySelector("button");
    button.disabled = false;
    button.dataset.scenario = guard.scenario;
  }

  function moveSelectedGuard(dx, dz) {
    const active = selected || GUARDS[0];
    const guard = guards.find(
      (figure) => figure.userData.guard.key === active.key
    );
    if (!guard) return;

    const xLimit = 11.5;
    const zLimit = 3.2;
    guard.position.x = THREE.MathUtils.clamp(
      guard.position.x + dx,
      -xLimit,
      xLimit
    );
    guard.position.z = THREE.MathUtils.clamp(
      guard.position.z + dz,
      -zLimit,
      zLimit
    );
  }

  function moveGuardToPointer(event) {
    const guard = dragGuard;
    if (!guard) return;
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(groundPlane, groundPoint)) {
      const xLimit = 11.5;
      const zLimit = 3.2;
      guard.position.x = THREE.MathUtils.clamp(groundPoint.x, -xLimit, xLimit);
      guard.position.z = THREE.MathUtils.clamp(groundPoint.z, -zLimit, zLimit);
    }
  }

  function animate() {
    frame = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    if (!paused) {
      const progress = (elapsed * 0.62) % 16.2;
      token.position.x = -7.65 + progress;
      token.position.z = Math.sin(elapsed * 1.25) * 1.1;
      token.position.y = 0.82 + Math.sin(elapsed * 3.2) * 0.09;
      token.rotation.y = Math.sin(elapsed) * 0.22;
      guards.forEach((guard, index) => {
        const phase = elapsed * 2.2 + guard.userData.phase;
        guard.position.y = Math.sin(phase) * 0.045;
        guard.userData.leftArm.rotation.z = -0.52 + Math.sin(phase) * 0.18;
        guard.userData.rightArm.rotation.z = 0.52 - Math.sin(phase) * 0.18;
        const isSelected = selected?.key === GUARDS[index].key;
        guard.scale.lerp(
          new THREE.Vector3(
            isSelected ? 1.12 : 1,
            isSelected ? 1.12 : 1,
            isSelected ? 1.12 : 1
          ),
          0.08
        );
      });
      court.children.forEach((child) => {
        if (child.userData.pulseOffset == null) return;
        child.material.emissiveIntensity =
          0.75 + Math.sin(elapsed * 2 + child.userData.pulseOffset) * 0.35;
      });
    }
    controls.update();
    renderer.render(scene, camera);
  }

  function onToolbar(event) {
    const button = event.target.closest("[data-3d-action]");
    if (!button) return;
    if (button.dataset.action === "noop") return;
    if (button.dataset["3dAction"] === "reset") {
      camera.position.copy(defaultCamera);
      controls.target.set(2.6, 0.75, 0);
      controls.update();
    } else {
      paused = !paused;
      button.innerHTML = paused ? "&#9654;" : "&#10074;&#10074;";
      button.setAttribute(
        "aria-label",
        paused ? "Lanjutkan animasi" : "Jeda animasi"
      );
      button.title = paused ? "Lanjutkan animasi" : "Jeda animasi";
    }
  }

  const toolbar = document.querySelector(".training-3d-toolbar");
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.addEventListener(
    "wheel",
    (event) => event.preventDefault(),
    { passive: false }
  );
  renderer.domElement.addEventListener("pointerdown", (event) => {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster
      .intersectObjects(guards, true)
      .find((item) => item.object.userData.guard);
    if (hit) {
      const guard = hit.object.userData.guard;
      selectGuard(guard);
      dragGuard =
        guards.find((figure) => figure.userData.guard.key === guard.key) ||
        null;
      return;
    }
    dragGuard = null;
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    pick(event);
    if (dragGuard) moveGuardToPointer(event);
  });
  renderer.domElement.addEventListener("pointerup", () => {
    dragGuard = null;
  });
  renderer.domElement.addEventListener("pointerleave", () => {
    hovered = null;
    renderer.domElement.classList.remove("is-pointing");
    dragGuard = null;
  });
  renderer.domElement.addEventListener("click", (event) => pick(event, true));
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (
      [
        "arrowleft",
        "arrowright",
        "arrowup",
        "arrowdown",
        "a",
        "d",
        "w",
        "s",
      ].includes(key)
    ) {
      event.preventDefault();
    }
    if (!selected) selected = GUARDS[0];
    if (key === "arrowleft" || key === "a") moveSelectedGuard(-0.28, 0);
    if (key === "arrowright" || key === "d") moveSelectedGuard(0.28, 0);
    if (key === "arrowup" || key === "w") moveSelectedGuard(0, -0.28);
    if (key === "arrowdown" || key === "s") moveSelectedGuard(0, 0.28);
  });
  toolbar?.addEventListener("click", onToolbar);
  resize();
  animate();

  return {
    dispose() {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      toolbar?.removeEventListener("click", onToolbar);
      controls.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material))
          object.material.forEach((material) => material.dispose());
        else object.material?.dispose?.();
        object.material?.map?.dispose?.();
      });
    },
  };
}

function mountTraining3D() {
  const container = document.querySelector("#training-3d-stage");
  if (!container || activeExperience) return;
  try {
    activeExperience = createExperience(container);
    document.querySelector(".training-hero")?.classList.add("scene-ready");
  } catch (error) {
    console.error("Arena 3D tidak dapat dimuat", error);
    container.innerHTML = `<div class="training-3d-fallback"><strong>Arena 3D belum tersedia</strong><span>Gunakan daftar skenario di bawah untuk melanjutkan latihan.</span></div>`;
  }
}

function disposeTraining3D() {
  activeExperience?.dispose();
  activeExperience = null;
}

window.addEventListener("hadang:before-render", disposeTraining3D);
window.addEventListener("hadang:rendered", (event) => {
  if (event.detail?.route === "training")
    requestAnimationFrame(mountTraining3D);
});

if (document.querySelector("#training-3d-stage")) mountTraining3D();
