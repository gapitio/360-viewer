<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";

  let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    canvas: HTMLCanvasElement,
    container: HTMLDivElement,
    facing: THREE.Vector3;

  onMount(() => {
    let onPointerDownMouseX = 0,
      onPointerDownMouseY = 0,
      lon = 0,
      onPointerDownLon = 0,
      lat = 0,
      onPointerDownLat = 0,
      phi = 0,
      theta = 0;

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
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

      container.style.touchAction = "none";
      container.addEventListener("pointerdown", onPointerDown, false);

      document.addEventListener("wheel", onDocumentMouseWheel, false);

      document.addEventListener(
        "dragover",
        function (event) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        },
        false
      );

      document.addEventListener(
        "dragenter",
        function () {
          document.body.style.opacity = "0.5";
        },
        false
      );

      document.addEventListener(
        "dragleave",
        function () {
          document.body.style.opacity = "1";
        },
        false
      );

      document.addEventListener(
        "drop",
        function (event) {
          event.preventDefault();

          const reader = new FileReader();
          reader.addEventListener(
            "load",
            function (event) {
              material.map.image.src = event.target.result;
              material.map.needsUpdate = true;
            },
            false
          );
          reader.readAsDataURL(event.dataTransfer.files[0]);

          document.body.style.opacity = "1";
        },
        false
      );

      //

      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onPointerDown(event) {
      if (event.isPrimary === false) return;

      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

      document.addEventListener("pointermove", onPointerMove, false);
      document.addEventListener("pointerup", onPointerUp, false);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    }

    function onPointerUp(event) {
      if (event.isPrimary === false) return;

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }

    function onDocumentMouseWheel(event) {
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
  });
</script>

<style>
  canvas {
    display: block;
  }
</style>

<div bind:this={container}><canvas bind:this={canvas} /></div>
