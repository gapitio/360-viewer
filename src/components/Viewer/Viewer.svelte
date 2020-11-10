<script lang="ts">
  import { onMount } from "svelte";
  import { init, animate } from "./Viewer";

  let canvas: HTMLCanvasElement;

  onMount(() => {
    init(canvas);
    animate();
  });
</script>

<style>
  canvas {
    display: block;
  }
</style>

<canvas bind:this={canvas} />
