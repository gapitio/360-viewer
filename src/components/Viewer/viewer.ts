import * as THREE from "three";
import { DragControls } from "../controls/PanoramaController";

declare global {
  interface Window {
    controls: any;
  }
}

const controls = (window.controls = new DragControls());

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  facing: THREE.Vector3;

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

  controls.init(canvas, material, camera);

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  update();
}

function update() {
  controls.lat = Math.max(-85, Math.min(85, controls.lat));
  controls.phi = THREE.MathUtils.degToRad(90 - controls.lat);
  controls.theta = THREE.MathUtils.degToRad(controls.lon);

  facing.x = 500 * Math.sin(controls.phi) * Math.cos(controls.theta);
  facing.y = 500 * Math.cos(controls.phi);
  facing.z = 500 * Math.sin(controls.phi) * Math.sin(controls.theta);

  camera.lookAt(facing);

  renderer.render(scene, camera);
}
