<script lang="ts">
  export let type: "flow" | "energy" | "power" | "temperature";
  export let value: string | number;

  const types = {
    flow: {
      color: "#7a36d2",
      unit: "L/h",
    },
    energy: {
      color: "#17C1B6",
      unit: "kWh",
    },
    power: {
      color: "#48ADE0",
      unit: "kW",
    },
    temperature: {
      color: "#D648E0",
      unit: "°C",
    },
  };

  let elt: HTMLElement;

  // setInterval(() => {
  //   value = (Math.random() * 1000).toFixed(2);
  // }, 1000);
</script>

<style>
  div {
    color: white;
    width: 200px;
    transform: translate(-50%, -50%);
  }
  .type {
    text-transform: uppercase;
  }
</style>

<div bind:this={elt}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 214 70">
    <g transform="translate(-652 -547)">
      <g
        transform="translate(657 552)"
        fill="#1b191c"
        stroke={types[type].color}
        stroke-width="5"
        opacity="0.88">
        <rect width="204" height="60" stroke="none" />
        <rect x="-2.5" y="-2.5" width="209" height="65" fill="none" />
      </g>
      <text
        class="type"
        transform="translate(669 573)"
        fill="#d6d6d6"
        font-size="16"
        font-family="OpenSans, Open Sans"
        letter-spacing="0.01em">
        <slot name="title">{type}</slot>
      </text>
      <text
        class="value"
        transform="translate(669 602)"
        fill="#fcfcfc"
        font-size="26"
        font-family="OpenSans-Semibold, Open Sans"
        font-weight="600">
        <slot name="value">{value}</slot>
        <slot name="unit">{` ${types[type].unit}`}</slot>
        <slot />
      </text>
    </g>
  </svg>
</div>
