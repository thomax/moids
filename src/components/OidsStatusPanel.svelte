<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import ButtonControls from './ButtonControls.svelte'
  import DualLineChart from './DualLineChart.svelte'
  import moidImagePath from '../assets/moid.png'
  import foxoidImagePath from '../assets/foxoid.png'

  export let moids = []
  export let foxoids = []
  export let livingMoidCounts = []
  export let livingFoxoidCounts = []
  export let starvedMoidCount = 0
  export let predatedMoidCount = 0
  export let starvedFoxoidCount = 0
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
    livingFoxoids: {
      key: 'name',
      direction: 'asc',
    },
  }

  function sortArrayBy(oids, key, direction) {
    return oids.sort((a, b) => {
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
    } else {
      foxoids = sortArrayBy(foxoids, sortKey, sortDirection)
    }
    sortSettings[arrayName].key = sortKey
    sortSettings[arrayName].direction = sortDirection
  }

  // when arrays change, sort immediately
  $: moids = sortArrayBy(moids, sortSettings.livingMoids.key, sortSettings.livingMoids.direction)
  $: foxoids = sortArrayBy(
    foxoids,
    sortSettings.livingFoxoids.key,
    sortSettings.livingFoxoids.direction
  )
</script>

<div class="panels-container">
  <div class="buttons-container">
    <ButtonControls />
  </div>
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

  <div class="livingMoids">
    <h2>
      <span class="oid-header"
        ><img src={moidImagePath} alt="Living moids" />
        {livingMoidCounts[livingMoidCounts.length - 1]}
        <span class="sortInfo"
          >{sortablesTranslate[sortSettings.livingMoids.key]},{sortSettings.livingMoids
            .direction}</span
        >
      </span>
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

  <div class="livingFoxoids">
    <h2>
      <span class="oid-header"
        ><img src={foxoidImagePath} alt="Living foxoids" />
        {livingFoxoidCounts[livingFoxoidCounts.length - 1]}
        <span class="sortInfo"
          >{sortablesTranslate[sortSettings.livingFoxoids.key]},{sortSettings.livingFoxoids
            .direction}</span
        >
      </span>
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

  <div class="deceasedOids">
    <h2>
      <span class="oid-header">
        Deaths:
        {starvedMoidCount + predatedMoidCount + starvedFoxoidCount}
      </span>
    </h2>
    <ul>
      <li>
        <span><img src={moidImagePath} alt="Starved moids" /> starved</span>
        <span>{starvedMoidCount}</span>
      </li>
      <li>
        <span><img src={moidImagePath} alt="Predated moids" /> eaten</span>
        <span>{predatedMoidCount}</span>
      </li>
      <li>
        <span><img src={foxoidImagePath} alt="Starved foxoids" /> starved</span>
        <span>{starvedFoxoidCount}</span>
      </li>
    </ul>
  </div>
</div>

<style>
  .panels-container {
    font-family: 'Courier New', Courier, monospace;
    padding: 0px 4px;
  }

  .oid-header {
    padding-top: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    gap: 20px;
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

  .buttons-container {
    max-height: 20vh;
    margin: 0;
    border: 1px solid gray;
    padding: 3px;
    margin-bottom: 7px;
  }

  .chart {
    max-height: 20vh;
    margin: 0;
    border: 1px solid gray;
    padding: 3px;
    margin-bottom: 7px;
  }

  .livingFoxoids {
    height: 35vh;
    overflow-y: auto;
    border: 1px solid gray;
    margin-bottom: 7px;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
    -ms-overflow-style: none; /* Internet Explorer and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .livingMoids {
    height: 35vh;
    overflow-y: auto;
    border: 1px solid gray;
    margin-bottom: 7px;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
    -ms-overflow-style: none; /* Internet Explorer and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .deceasedOids {
    height: 9vh;
    overflow-y: auto;
    border: 1px solid gray;
    padding: 0px 3px 0px 3px;
    -ms-overflow-style: none; /* Internet Explorer and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
