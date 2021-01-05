<script lang="ts">
  import DataHotspot from "./../../hotspot/DataHotspot.svelte";
  import InfoHotspot from "../../hotspot/InfoHotspot.svelte";
  import { onMount } from "svelte";
  import Marzipano from "marzipano";

  let container: HTMLElement;
  let panoramaContainer: HTMLElement;

  onMount(() => {
    const viewer = new Marzipano.Viewer(panoramaContainer);

    // Create source.
    const source = Marzipano.ImageUrlSource.fromString("earth.jpg");

    // Create geometry.
    const geometry = new Marzipano.EquirectGeometry([{ width: 2048 }]);

    // Create view.
    const limiter = Marzipano.RectilinearView.limit.traditional(
      1024,
      (100 * Math.PI) / 180
    );
    const view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);

    // Create scene.
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    // Display scene.
    scene.switchTo();

    for (const hotspot of container.getElementsByClassName(
      "hotspot"
    ) as HTMLCollectionOf<HTMLElement>) {
      scene.hotspotContainer().createHotspot(hotspot, {
        yaw: hotspot.dataset.yaw,
        pitch: hotspot.dataset.pitch,
      });
    }
  });
</script>

<style>
  .panorama-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={container}>
  <div bind:this={panoramaContainer} class="panorama-container" />
  <InfoHotspot yaw={3} pitch={0.1}>{0}</InfoHotspot>
  <DataHotspot yaw={-1.9} pitch={0.56} type="energy" value="2">{0}</DataHotspot>
</div>
