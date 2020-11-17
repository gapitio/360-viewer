<script lang="ts">
  import DragAndDrop from "./../../DragAndDrop/DragAndDrop.svelte";
  import { onMount } from "svelte";

  import { PanoramaViewer } from "./PanoramaViewer";

  let width = window.innerWidth;
  let height = window.innerHeight;

  const panoramaViewer = new PanoramaViewer();

  // When the height or width of the container changes
  // set the size of the renderer to that.
  $: (height || width) && panoramaViewer.setSize(width, height);

  function loadFunction(event: ProgressEvent<FileReader>) {
    panoramaViewer.setPanoramaImage(event.target?.result);
  }

  onMount(() => {
    panoramaViewer.setSize(width, height);
  });
</script>

<style>
  canvas {
    display: block;
  }

  .panorama-wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>

<DragAndDrop {loadFunction}>
  <div
    class="panorama-wrapper"
    bind:clientWidth={width}
    bind:clientHeight={height}>
    <canvas
      use:panoramaViewer.init
      on:wheel|passive={panoramaViewer.controls?.onMouseWheel}
      on:pointerdown={panoramaViewer.controls?.onPointerDown} />
  </div>
</DragAndDrop>
