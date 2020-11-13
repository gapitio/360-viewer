import { MathUtils, PerspectiveCamera } from "three";

class PanoramaControls {
  camera: PerspectiveCamera | undefined;
  canvas: HTMLCanvasElement | undefined;

  isUserInteracting = false;

  lon = 0;
  lat = 0;
  phi = 0;
  theta = 0;

  prevLon = 0;
  prevLat = 0;

  lonVelocity = 0;
  latVelocity = 0;
  dampingFactor = 0.05;

  onPointerDownMouseX = 0;
  onPointerDownMouseY = 0;
  onPointerDownLon = 0;
  onPointerDownLat = 0;

  fovMin: number;
  fovMax: number;
  zoomSensitivity: number;

  constructor({ fovMin = 10, fovMax = 100, zoomSensitivity = 5 } = {}) {
    this.fovMin = fovMin;
    this.fovMax = fovMax;
    this.zoomSensitivity = zoomSensitivity;
  }

  init(canvas: HTMLCanvasElement, camera: PerspectiveCamera) {
    this.camera = camera;
    this.canvas = canvas;
    canvas.style.touchAction = "none";
  }

  onPointerDown = (event: PointerEvent) => {
    if (event.isPrimary === false) return;

    this.onPointerDownMouseX = event.clientX;
    this.onPointerDownMouseY = event.clientY;

    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;

    this.isUserInteracting = true;

    if (this.canvas) {
      this.canvas.addEventListener("pointermove", this.onPointerMove);
      this.canvas.addEventListener("pointerup", this.onPointerUp);
    }
  };

  onPointerMove = (event: PointerEvent) => {
    if (event.isPrimary === false) return;

    const height = this.canvas?.clientHeight ?? 1000;
    const delta = (this.camera?.fov ?? 90) / height;

    this.lon =
      (this.onPointerDownMouseX - event.clientX) * delta +
      this.onPointerDownLon;
    this.lat =
      (event.clientY - this.onPointerDownMouseY) * delta +
      this.onPointerDownLat;
  };

  onPointerUp = (event: PointerEvent) => {
    if (event.isPrimary === false) return;

    this.isUserInteracting = false;

    if (this.canvas) {
      this.canvas.removeEventListener("pointermove", this.onPointerMove);
      this.canvas.removeEventListener("pointerup", this.onPointerUp);
    }
  };

  onMouseWheel = (event: WheelEvent) => {
    if (this.camera) {
      const fov = this.camera.fov + event.deltaY * (this.zoomSensitivity / 100);

      this.camera.fov = MathUtils.clamp(fov, this.fovMin, this.fovMax);

      this.camera.updateProjectionMatrix();
    }
  };
}

export { PanoramaControls };
