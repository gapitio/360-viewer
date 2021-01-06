<script lang="ts">
  import DataHotspot from "../../hotspot/DataHotspot.svelte";
  import InfoHotspot from "../../hotspot/InfoHotspot.svelte";
  import { onMount } from "svelte";
  import Marzipano from "marzipano";

  let container: HTMLElement;
  let panoramaContainer: HTMLElement;
  let config:
    | {
        scenes: [
          {
            name: string;
            url: string;
            hotspots: [
              {
                type: string;
                dataType: "flow" | "energy" | "power" | "temperature";
                yaw: number;
                pitch: number;
              }
            ];
          }
        ];
      }
    | undefined;

  let currentSceneName: string;
  let currentScene: any;
  const scenes: any[] = [];

  const baseURL = window.location.href;
  const configPath = baseURL + "/config.json";

  async function getConfig() {
    const config = await fetch(baseURL + "/config.json")
      .then((response) => response.json())
      .catch((e) => {
        console.warn("Failed to fetch config from " + configPath);
      });

    return config;
  }

  function switchScene(scene: any) {
    currentScene = scene;
    // Display scene.
    scene.switchTo();
  }

  function addHotspot(hotspot: HTMLElement) {
    const sceneIndex = hotspot.dataset.sceneIndex;
    if (sceneIndex) {
      scenes[Number(sceneIndex)].scene.hotspotContainer().createHotspot(
        hotspot,
        {
          yaw: Number(hotspot.dataset.yaw),
          pitch: Number(hotspot.dataset.pitch),
        },
        { perspective: { radius: 1024 } }
      );
    }
  }

  onMount(async () => {
    const viewer = new Marzipano.Viewer(panoramaContainer);

    config = await getConfig();
    if (config && config.scenes) {
      for (const sceneConfig of config.scenes) {
        console.log(sceneConfig);

        // Create source.
        const source = Marzipano.ImageUrlSource.fromString(
          baseURL + sceneConfig.url
        );

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

        scenes.push({ name: sceneConfig.name, scene: scene });
      }
    }

    if (scenes.length > 0) {
      switchScene(scenes[0].scene);
      currentSceneName = scenes[0].name;
    }

    panoramaContainer.addEventListener("click", (e) => {
      console.log(currentScene.view().screenToCoordinates({ x: e.x, y: e.y }));
    });
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

  .scene-list {
    position: absolute;
    top: 0;
    left: 0;
    color: #fcfcfc;
  }
  .scene-list ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .scene-list li {
    background-color: #1b191c55;
    padding: 4px 6px;
  }
  .scene-list li:hover {
    background-color: #1b191ce0;
  }
</style>

<div bind:this={container}>
  <div bind:this={panoramaContainer} class="panorama-container" />
  {#if config}
    {#each config.scenes as sceneConfig, sceneIndex}
      {#each sceneConfig.hotspots as hotspotConfig}
        <div
          data-scene-index={sceneIndex}
          use:addHotspot
          data-yaw={hotspotConfig.yaw}
          data-pitch={hotspotConfig.pitch}>
          {#if hotspotConfig.type == 'data'}
            <DataHotspot type={hotspotConfig.dataType} value="2">
              {0}
            </DataHotspot>
          {:else if hotspotConfig.type == 'info'}
            <InfoHotspot />
          {/if}
        </div>
      {/each}
    {/each}
  {/if}
</div>

<div class="scene-list">
  {#if config}
    <ul>
      {#each config.scenes as sceneConfig, sceneIndex}
        <li on:click={() => switchScene(scenes[sceneIndex].scene)}>
          <label><input
              type="radio"
              bind:group={currentSceneName}
              value={sceneConfig.name} />
            {sceneConfig.name}</label>
        </li>
      {/each}
    </ul>
  {/if}
</div>
