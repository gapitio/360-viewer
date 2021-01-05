<script lang="ts">
  export let yaw: number;
  export let pitch: number;

  let elt: HTMLElement;
</script>

<style>
  div {
    color: white;
  }
</style>

<div bind:this={elt} class="hotspot" data-yaw={yaw} data-pitch={pitch}>
  Hello
</div>
