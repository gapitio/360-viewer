<script lang="ts">
  import { onMount } from "svelte";
  import { init, animate } from "./viewer";

  let canvas: HTMLCanvasElement, container: HTMLDivElement;

  onMount(() => {
    init(canvas, container);
    animate();
  });
</script>

<style>
  canvas {
    display: block;
  }
</style>

<div bind:this={container}><canvas bind:this={canvas} /></div>
