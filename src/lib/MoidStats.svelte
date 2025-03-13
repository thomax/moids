<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)
  import LineChart from './LineChart.svelte'

  import { onMount } from 'svelte'

  export let moids = []
  export let deadMoids = []
  export let onSelectedMoid = null
  export let livingMoidCounts = []
  export let deadMoidCounts = []
</script>

<div class="stats-container">
  <div class="chart">
    <LineChart data={livingMoidCounts} lineColor="rgb(255, 255, 255)" label="Living Moids" />
  </div>
  <div class="living">
    <h2>Alive {livingMoidCounts[livingMoidCounts.length - 1]}</h2>
    <ul>
      <li class="header">
        <span>Name</span>
        <span>Gen</span>
        <span>Kids</span>
        <span>Energy</span>
      </li>
      {#each moids as moid}
        <li>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <span on:click={onSelectedMoid(moid.id)} class={moid.isSelected ? 'selected' : ''}
            >{moid.name}</span
          >
          <span>{moid.generation}</span>
          <span>{moid.offspringCount}</span>
          <span>{Math.floor(moid.energy)}</span>
        </li>
      {/each}
    </ul>
  </div>
  <div class="deceased">
    <h2>Dead {deadMoidCounts[deadMoidCounts.length - 1]}</h2>
    <ul>
      <li class="header">
        <span>Name</span>
        <span>Gen</span>
        <span>Kids</span>
        <span>Energy</span>
      </li>
      {#each deadMoids as moid}
        <li>
          <span>{moid.name}</span>
          <span>{moid.generation}</span>
          <span>{moid.offspringCount}</span>
          <span>💀</span>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .stats-container {
    font-family: 'Courier New', Courier, monospace;
    padding: 0px 4px;
  }

  h2 {
    color: white;
    margin: 0px;
    padding-left: 3px;
    position: sticky;
    top: 0;
    background-color: black;
  }

  ul {
    list-style-type: none;
    margin: 0px 0px 0px 3px;
    padding: 0;
  }

  li {
    color: white;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
  li {
    text-align: right;
  }
  li span:first-child {
    text-align: left;
  }
  li.header {
    font-size: 0.8rem;
    font-weight: bold;
    position: sticky;
    top: 31px;
    background-color: black;
  }

  .selected {
    color: red;
  }

  .chart {
    max-height: 20vh;
    margin: 0;
    border: 1px solid gray;
    padding: 3px;
    margin-bottom: 7px;
  }

  .living {
    height: 40vh;
    overflow-y: auto;
    border: 1px solid gray;
    margin-bottom: 7px;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
  }

  .deceased {
    height: 34vh;
    overflow-y: auto;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
  }
</style>
