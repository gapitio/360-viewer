<script lang="ts">
  import DragAndDrop from "../DragAndDrop/DragAndDrop.svelte";
  import { onMount } from "svelte";
  import { ViewerCore } from "./Core";
  import { PanoramaControls } from "../controls/PanoramaControls";

  let canvas: HTMLCanvasElement;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const viewerCore = new ViewerCore();
  const controls = new PanoramaControls();

  // When the height or width of the container changes
  // set the size of the renderer to that.
  $: (height || width) && viewerCore.setSize(width, height);

  function loadFunction(event: ProgressEvent<FileReader>) {
    viewerCore.updateImage(event.target?.result);
  }

  onMount(() => {
    viewerCore.init(canvas);
    viewerCore.setSize(width, height);
    controls.init(canvas, viewerCore.camera);
    viewerCore.addControls(controls);
    viewerCore.animate();
  });
</script>

<style>
  canvas {
    display: block;
  }

  .viewer-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>

<DragAndDrop {loadFunction}>
  <div
    class="viewer-wrapper"
    bind:clientWidth={width}
    bind:clientHeight={height}>
    <canvas
      class="viewer"
      bind:this={canvas}
      on:wheel={controls.onMouseWheel}
      on:pointerdown={controls.onPointerDown} />
  </div>
</DragAndDrop>
