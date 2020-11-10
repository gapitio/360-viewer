import * as THREE from "three";

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  facing: THREE.Vector3;

let onPointerDownMouseX = 0,
  onPointerDownMouseY = 0,
  lon = 0,
  onPointerDownLon = 0,
  lat = 0,
  onPointerDownLat = 0,
  phi = 0,
  theta = 0;

export { init, animate };

function init(canvas: HTMLCanvasElement) {
  camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    1,
    1100
  );
  facing = new THREE.Vector3(0, 0, 0);

  scene = new THREE.Scene();

  const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);

  const texture = new THREE.TextureLoader().load("earth.jpg");
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  canvas.style.touchAction = "none";
  canvas.addEventListener(
    "pointerdown",
    (event) => onPointerDown(event, canvas),
    false
  );

  canvas.addEventListener("wheel", onDocumentMouseWheel, false);

  canvas.addEventListener(
    "dragover",
    function (event) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    },
    false
  );

  canvas.addEventListener(
    "dragenter",
    function () {
      canvas.style.opacity = "0.5";
    },
    false
  );

  canvas.addEventListener(
    "dragleave",
    function () {
      canvas.style.opacity = "1";
    },
    false
  );

  canvas.addEventListener(
    "drop",
    function (event) {
      event.preventDefault();
      if (event.dataTransfer) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          function (event) {
            if (material.map) {
              material.map.image.src = event.target?.result;
              material.map.needsUpdate = true;
            }
          },
          false
        );
        reader.readAsDataURL(event.dataTransfer.files[0]);
      }

      canvas.style.opacity = "1";
    },
    false
  );

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event: PointerEvent, canvas: HTMLCanvasElement) {
  if (event.isPrimary === false) return;

  onPointerDownMouseX = event.clientX;
  onPointerDownMouseY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

  canvas.addEventListener("pointermove", onPointerMove, false);
  canvas.addEventListener(
    "pointerup",
    (event) => onPointerUp(event, canvas),
    false
  );
}

function onPointerMove(event: PointerEvent) {
  if (event.isPrimary === false) return;

  lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
  lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
}

function onPointerUp(event: PointerEvent, canvas: HTMLCanvasElement) {
  if (event.isPrimary === false) return;

  canvas.removeEventListener("pointermove", onPointerMove);
  canvas.removeEventListener("pointerup", (event) =>
    onPointerUp(event, canvas)
  );
}

function onDocumentMouseWheel(event: WheelEvent) {
  const fov = camera.fov + event.deltaY * 0.05;

  camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  update();
}

function update() {
  lat = Math.max(-85, Math.min(85, lat));
  phi = THREE.MathUtils.degToRad(90 - lat);
  theta = THREE.MathUtils.degToRad(lon);

  facing.x = 500 * Math.sin(phi) * Math.cos(theta);
  facing.y = 500 * Math.cos(phi);
  facing.z = 500 * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(facing);

  renderer.render(scene, camera);
}
