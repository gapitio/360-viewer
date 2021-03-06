<script lang="ts">
  import DataHotspot from "../../hotspot/DataHotspot.svelte";
  import InfoHotspot from "../../hotspot/InfoHotspot.svelte";
  import SceneHotspot from "../../hotspot/SceneHotspot.svelte";
  import { onMount } from "svelte";
  import Marzipano from "marzipano";
  import InfluxData from "../../Data/InfluxData.svelte";
  import RandomData from "../../Data/RandomData.svelte";

  let container: HTMLElement;
  let panoramaContainer: HTMLElement;
  let config: {
    scenes: [
      {
        name: string;
        url: string;
        hotspots: [
          {
            type: string;
            dataType: "flow" | "energy" | "power" | "temperature";
            data: {
              database?: string;
              type?: "influx" | "random";
              url?: string;
              token?: string;
              organization?: string;
              query?: string;
            };
            title: string;
            sceneIndex: number;
            yaw: number;
            pitch: number;
            extraTransforms?: string;
          }
        ];
      }
    ];
    databases:
      | {
          [key: string]: {
            type: "influx" | "random";
            url?: string;
            token?: string;
            organization?: string;
          };
        }
      | undefined;
  };

  let scenes: { name: string; scene: any }[] = [];
  let currentSceneIndex = 0;

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
    // Display scene.
    scene.switchTo();
  }

  $: if (currentSceneIndex != null && scenes.length > 0) {
    switchScene(scenes[currentSceneIndex].scene);
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
        {
          perspective: {
            extraTransforms: "rotateZ(-0.5deg)",
          },
        }
      );
    }
  }

  onMount(async () => {
    const viewer = new Marzipano.Viewer(panoramaContainer);

    config = await getConfig();
    if (config && config.scenes) {
      for (const sceneConfig of config.scenes) {
        // Create source.
        const source = Marzipano.ImageUrlSource.fromString(
          baseURL + sceneConfig.url
        );

        // Create geometry.
        const geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);

        // Create view.
        const limiter = Marzipano.RectilinearView.limit.traditional(
          1024,
          (100 * Math.PI) / 180
        );
        const view = new Marzipano.RectilinearView({ yaw: 0 }, limiter);

        // Create scene.
        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true,
        });

        scenes = [...scenes, { name: sceneConfig.name, scene: scene }];
      }
    }

    panoramaContainer.addEventListener("click", (e) => {
      console.log(
        scenes[currentSceneIndex].scene
          .view()
          .screenToCoordinates({ x: e.x, y: e.y })
      );
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
  .scene-list input {
    display: none;
  }
  .scene-list label {
    background-color: #1b191c55;
    display: block;
    padding: 10px 16px;
  }
  .scene-list label:hover {
    background-color: #1b191ce0;
  }
  .scene-list label.active {
    background-color: #1b191cbb;
  }
</style>

<div bind:this={container}>
  <div bind:this={panoramaContainer} class="panorama-container" />
  {#if config && scenes.length > 0}
    {#each config.scenes as sceneConfig, sceneIndex}
      {#each sceneConfig.hotspots as hotspotConfig}
        {#if currentSceneIndex == sceneIndex}
          <div
            data-scene-index={sceneIndex}
            use:addHotspot
            data-yaw={hotspotConfig.yaw}
            data-pitch={hotspotConfig.pitch}
            data-extra-transforms={hotspotConfig.extraTransforms}>
            {#if hotspotConfig.type == 'data'}
              <DataHotspot type={hotspotConfig.dataType} value={252}>
                <tspan slot="title">{hotspotConfig.title}</tspan>
                <tspan slot="value">
                  {#if hotspotConfig.data.database && config.databases && config.databases[hotspotConfig.data.database]}
                    {#if config.databases[hotspotConfig.data.database].type == 'influx'}
                      <InfluxData
                        url={config.databases[hotspotConfig.data.database].url ?? ''}
                        token={config.databases[hotspotConfig.data.database].token ?? ''}
                        organization={config.databases[hotspotConfig.data.database].organization ?? ''}
                        query={hotspotConfig.data.query ?? ''} />
                    {/if}
                    {#if config.databases[hotspotConfig.data.database].type == 'random'}
                      <RandomData />
                    {/if}
                  {/if}
                </tspan>
              </DataHotspot>
            {:else if hotspotConfig.type == 'scene'}
              <SceneHotspot
                func={() => {
                  currentSceneIndex = hotspotConfig.sceneIndex;
                }} />
            {:else if hotspotConfig.type == 'info'}
              <InfoHotspot />
            {/if}
          </div>
        {/if}
      {/each}
    {/each}
  {/if}
</div>

<div class="scene-list">
  <ul>
    {#each scenes as sceneConfig, sceneIndex}
      <li>
        <label class={sceneIndex == currentSceneIndex ? 'active' : ''}><input
            type="radio"
            bind:group={currentSceneIndex}
            value={sceneIndex} />
          {sceneConfig.name}</label>
      </li>
    {/each}
  </ul>
</div>
