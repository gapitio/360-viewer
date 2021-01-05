<script lang="ts">
  export let yaw: number;
  export let pitch: number;

  let elt: HTMLElement;

  let random = "100";

  setInterval(() => {
    random = (Math.random() * 1000).toFixed(2);
  }, 1000);
</script>

<style>
  div {
    color: white;
  }
</style>

<div bind:this={elt} class="hotspot" data-yaw={yaw} data-pitch={pitch}>
  {random}
</div>
