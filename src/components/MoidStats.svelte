<script>
  // @ts-nocheck
  import DualLineChart from './DualLineChart.svelte'
  import { onMount } from 'svelte'
  import moidImagePath from '../assets/moid.png'
  import foxoidImagePath from '../assets/foxoid.png'

  export let moids = []
  export let deadMoids = []
  export let livingMoidCounts = []
  export let deadMoidCounts = []
  export let foxoids = []
  export let livingFoxoidCounts = []
  export let onSelectedOid = () => {
    console.warn('onSelectedOid not set')
  }

  const sortablesTranslate = {
    name: 'name',
    generation: 'gen',
    offspringCount: 'kids',
    energy: 'energy',
  }

  let sortSettings = {
    livingMoids: {
      key: 'name',
      direction: 'asc',
    },
    deadMoids: {
      key: 'name',
      direction: 'asc',
    },
    livingFoxoids: {
      key: 'name',
      direction: 'asc',
    },
  }

  function sortArrayBy(moids, key, direction) {
    return moids.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  function handleSortClicked(sortKey, arrayName) {
    const sortDirection = sortSettings[arrayName].direction === 'asc' ? 'desc' : 'asc'
    if (arrayName === 'livingMoids') {
      moids = sortArrayBy(moids, sortKey, sortDirection)
    } else if (arrayName === 'deadMoids') {
      deadMoids = sortArrayBy(deadMoids, sortKey, sortDirection)
    } else {
      foxoids = sortArrayBy(foxoids, sortKey, sortDirection)
    }
    sortSettings[arrayName].key = sortKey
    sortSettings[arrayName].direction = sortDirection
  }

  // when arrays change, sort immediately
  $: moids = sortArrayBy(moids, sortSettings.livingMoids.key, sortSettings.livingMoids.direction)
  $: deadMoids = sortArrayBy(
    deadMoids,
    sortSettings.deadMoids.key,
    sortSettings.deadMoids.direction
  )
  $: foxoids = sortArrayBy(
    foxoids,
    sortSettings.livingFoxoids.key,
    sortSettings.livingFoxoids.direction
  )
</script>

<div class="stats-container">
  <div class="chart">
    <DualLineChart
      data={livingMoidCounts}
      lineColor="rgb(200, 200, 200)"
      label="Moids"
      secondaryData={livingFoxoidCounts}
      secondaryLineColor="rgb(228, 108, 4)"
      secondaryLabel="Foxoids"
      secondaryOptions={{ beginAtZero: true, position: 'right' }}
    />
  </div>
  <div class="livingFoxoids">
    <h2>
      <span class="oid-header"><img src={foxoidImagePath} alt="Living foxoids" /></span>
      {livingFoxoidCounts[livingFoxoidCounts.length - 1]}
      <span class="sortInfo"
        >{sortablesTranslate[sortSettings.livingFoxoids.key]},{sortSettings.livingFoxoids
          .direction}</span
      >
    </h2>
    <ul>
      <li class="header">
        <span on:click={handleSortClicked('name', 'livingFoxoids')}>Name</span>
        <span on:click={handleSortClicked('generation', 'livingFoxoids')}>Gen</span>
        <span on:click={handleSortClicked('offspringCount', 'livingFoxoids')}>Kids</span>
        <span on:click={handleSortClicked('energy', 'livingFoxoids')}>Energy</span>
      </li>
      {#each foxoids as foxoid}
        <li>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <span on:click={onSelectedOid(foxoid.id)} class={foxoid.isSelected ? 'selected' : ''}
            >{foxoid.name}</span
          >
          <span>{foxoid.generation}</span>
          <span>{foxoid.offspringCount}</span>
          <span>{Math.floor(foxoid.energy)}</span>
        </li>
      {/each}
    </ul>
  </div>

  <div class="livingMoids">
    <h2>
      <span class="oid-header"><img src={moidImagePath} alt="Living moids" /></span>
      {livingMoidCounts[livingMoidCounts.length - 1]}
      <span class="sortInfo"
        >{sortablesTranslate[sortSettings.livingMoids.key]},{sortSettings.livingMoids
          .direction}</span
      >
    </h2>
    <ul>
      <li class="header">
        <span on:click={handleSortClicked('name', 'livingMoids')}>Name</span>
        <span on:click={handleSortClicked('generation', 'livingMoids')}>Gen</span>
        <span on:click={handleSortClicked('offspringCount', 'livingMoids')}>Kids</span>
        <span on:click={handleSortClicked('energy', 'livingMoids')}>Energy</span>
      </li>
      {#each moids as moid}
        <li>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <span on:click={onSelectedOid(moid.id)} class={moid.isSelected ? 'selected' : ''}
            >{moid.name}</span
          >
          <span>{moid.generation}</span>
          <span>{moid.offspringCount}</span>
          <span>{Math.floor(moid.energy)}</span>
        </li>
      {/each}
    </ul>
  </div>

  <div class="deceasedMoids">
    <h2>
      <span class="oid-header">💀<img src={moidImagePath} alt="Dead moids" /></span>
      {deadMoidCounts[deadMoidCounts.length - 1]}
      <span class="sortInfo"
        >{sortablesTranslate[sortSettings.deadMoids.key]},{sortSettings.deadMoids.direction}</span
      >
    </h2>
    <ul>
      <li class="header">
        <span on:click={handleSortClicked('name', 'deadMoids')}>Name</span>
        <span on:click={handleSortClicked('generation', 'deadMoids')}>Gen</span>
        <span on:click={handleSortClicked('offspringCount', 'deadMoids')}>Kids</span>
        <span on:click={handleSortClicked('energy', 'deadMoids')}>Energy</span>
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

  .oid-header {
    padding-top: 5px;
    display: inline-flex;
    align-items: center;
  }

  .oid-header img {
    vertical-align: middle;
  }

  h2 {
    color: white;
    margin: 0px;
    padding-left: 3px;
    position: sticky;
    top: 0;
    background-color: black;
  }

  h2 img {
    width: 32px;
  }

  .sortInfo {
    font-size: 0.8rem;
    color: gray;
  }

  ul {
    list-style-type: none;
    margin: 0px 0px 0px 3px;
    padding: 0;
  }

  li {
    color: white;
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
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
    cursor: pointer;
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

  .livingFoxoids {
    height: 20vh;
    overflow-y: auto;
    border: 1px solid gray;
    margin-bottom: 7px;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
    -ms-overflow-style: none; /* Internet Explorer and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .livingMoids {
    height: 32vh;
    overflow-y: auto;
    border: 1px solid gray;
    margin-bottom: 7px;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
    -ms-overflow-style: none; /* Internet Explorer and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .deceasedMoids {
    height: 20vh;
    overflow-y: auto;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
    -ms-overflow-style: none; /* Internet Explorer and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
