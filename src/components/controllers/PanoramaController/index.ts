import * as THREE from "three";

let onPointerDownMouseX = 0,
  onPointerDownMouseY = 0,
  onPointerDownLon = 0,
  onPointerDownLat = 0;

class DragControls {
  camera: THREE.PerspectiveCamera | undefined;
  lon = 0;
  lat = 0;
  phi = 0;
  theta = 0;
  init(
    canvas: HTMLCanvasElement,
    material: THREE.MeshBasicMaterial,
    camera: THREE.PerspectiveCamera
  ) {
    this.camera = camera;
    canvas.style.touchAction = "none";

    canvas.addEventListener(
      "pointerdown",
      (event) => this.onPointerDown(event, canvas),
      false
    );

    canvas.addEventListener("wheel", this.onDocumentMouseWheel, false);

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
  }

  onPointerDown = (event: PointerEvent, canvas: HTMLCanvasElement) => {
    if (event.isPrimary === false) return;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = this.lon;
    onPointerDownLat = this.lat;

    canvas.addEventListener("pointermove", this.onPointerMove, false);
    canvas.addEventListener(
      "pointerup",
      (event) => this.onPointerUp(event, canvas),
      false
    );
  };

  onPointerMove = (event: PointerEvent) => {
    if (event.isPrimary === false) return;

    this.lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    this.lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
  };

  onPointerUp = (event: PointerEvent, canvas: HTMLCanvasElement) => {
    if (event.isPrimary === false) return;

    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerup", (event) =>
      this.onPointerUp(event, canvas)
    );
  };

  onDocumentMouseWheel = (event: WheelEvent) => {
    if (this.camera) {
      const fov = this.camera.fov + event.deltaY * 0.05;

      this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

      this.camera.updateProjectionMatrix();
    }
  };
}

export { DragControls };
