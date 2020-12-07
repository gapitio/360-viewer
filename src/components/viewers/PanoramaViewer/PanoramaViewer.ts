import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";
import { PanoramaControls } from "../../controls/PanoramaControls";
import { earthScene } from "../../scenes/earthScene";

interface HTMLPanoramaViewerElement extends HTMLCanvasElement {
  panoramaViewer?: PanoramaViewer;
}

class PanoramaViewer {
  canvas: HTMLPanoramaViewerElement | undefined;
  controls: PanoramaControls | undefined;

  camera = new PerspectiveCamera();
  scene = new Scene();
  renderer = new WebGLRenderer();
  facing = new Vector3();
  currentScene = "earthScene";
  scenes: { [key: string]: Scene } = { earthScene: earthScene };

  lastFrameTime = Date.now();
  deltaFrameTime = 0;

  init(canvas: HTMLPanoramaViewerElement, { fov = 65 } = {}) {
    this.canvas = canvas;
    this.canvas.panoramaViewer = this;

    this.camera.fov = fov;

    this.renderer = new WebGLRenderer({ canvas: canvas });

    this.controls = new PanoramaControls();
    this.controls.init(this.canvas, this.camera);

    this.animate();
  }

  addScene = (scene: Scene, name: string) => {
    this.scenes[name] = scene;
    this.currentScene = name;
  };

  createSceneFromPanorama = (imageSrc: string, name: string) => {
    const geometry = new SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const scene = new Scene();

    const image = document.createElement("img");
    image.src = imageSrc;

    const texture = new Texture(image);
    texture.needsUpdate = true;
    const material = new MeshBasicMaterial({ map: texture });

    const mesh = new Mesh(geometry, material);

    scene.add(mesh);

    this.addScene(scene, name);
  };

  setSize = (width: number, height: number) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.update();
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
  };

  update() {
    if (this.controls) {
      // Get time since last frame
      const now = Date.now();
      this.deltaFrameTime = now - this.lastFrameTime;

      if (this.controls.isUserInteracting) {
        // Get distance travelled since last frame
        const dLon = this.controls.lon - this.controls.prevLon;
        const dLat = this.controls.lat - this.controls.prevLat;
        // velocity = distance / time
        this.controls.lonVelocity = dLon / this.deltaFrameTime;
        this.controls.latVelocity = dLat / this.deltaFrameTime;
      } else {
        // old position + ( velocity * time ) = new position
        this.controls.lon += this.controls.lonVelocity * this.deltaFrameTime;
        this.controls.lat += this.controls.latVelocity * this.deltaFrameTime;
        this.controls.lonVelocity *= 1 - this.controls.dampingFactor;
        this.controls.latVelocity *= 1 - this.controls.dampingFactor;
      }

      // Update for next frame
      this.lastFrameTime = now;
      this.controls.prevLon = this.controls.lon;
      this.controls.prevLat = this.controls.lat;

      this.controls.lat = Math.max(-85, Math.min(85, this.controls.lat));

      this.controls.phi = MathUtils.degToRad(90 - this.controls.lat);
      this.controls.theta = MathUtils.degToRad(this.controls.lon);

      this.facing.x =
        Math.sin(this.controls.phi) * Math.cos(this.controls.theta);
      this.facing.y = Math.cos(this.controls.phi);
      this.facing.z =
        Math.sin(this.controls.phi) * Math.sin(this.controls.theta);
    }

    this.camera.lookAt(this.facing);

    this.renderer.render(this.scenes[this.currentScene], this.camera);
  }
}

export { PanoramaViewer };
