import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import { PanoramaControls } from "../../controls/PanoramaControls";

class PanoramaViewer {
  canvas: HTMLCanvasElement | undefined;
  controls: PanoramaControls | undefined;

  camera = new PerspectiveCamera();
  scene = new Scene();
  renderer = new WebGLRenderer();
  facing = new Vector3();
  panorama: Mesh<SphereBufferGeometry, MeshBasicMaterial> | undefined;

  init(canvas: HTMLCanvasElement, { fov = 70 } = {}) {
    this.canvas = canvas;
    this.camera.fov = fov;

    const geometry = new SphereBufferGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    const texture = new TextureLoader().load("earth.jpg");
    const material = new MeshBasicMaterial({ map: texture });

    this.panorama = new Mesh(geometry, material);

    this.scene.add(this.panorama);

    this.renderer = new WebGLRenderer({ canvas: canvas });

    this.controls = new PanoramaControls();
    this.controls.init(this.canvas, this.camera);

    this.animate();
  }

  setPanoramaImage = (imageSrc: any) => {
    if (this.panorama && this.panorama.material.map) {
      this.panorama.material.map.image.src = imageSrc;
      this.panorama.material.map.needsUpdate = true;
    }
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
      this.controls.lat = Math.max(-85, Math.min(85, this.controls.lat));
      this.controls.phi = MathUtils.degToRad(90 - this.controls.lat);
      this.controls.theta = MathUtils.degToRad(this.controls.lon);

      this.facing.x =
        500 * Math.sin(this.controls.phi) * Math.cos(this.controls.theta);
      this.facing.y = 500 * Math.cos(this.controls.phi);
      this.facing.z =
        500 * Math.sin(this.controls.phi) * Math.sin(this.controls.theta);
    }

    this.camera.lookAt(this.facing);

    this.renderer.render(this.scene, this.camera);
  }
}

export { PanoramaViewer };
