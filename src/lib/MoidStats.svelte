<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)

  import { onMount } from 'svelte'

  export let moids = []
  export let deadMoids = []
  export let onSelectedMoid = null
  export let livingMoidCounts = []
  export let deadMoidCounts = []

  let livingChartContainer
  let livingChart

  function status(moid) {
    if (moid.energy > 80) return '😎'
    if (moid.energy > 60) return '😀'
    if (moid.energy > 40) return '😅'
    if (moid.energy > 20) return '😰'
    if (moid.energy > 10) return '😬'
    return '🫠'
  }

  function updateLivingChart() {
    if (!livingChartContainer) return
    if (!livingChart) {
      livingChart = new Chart(livingChartContainer, {
        type: 'line',
        data: {
          labels: Array.from({ length: livingMoidCounts.length }, (_, i) => i + 1),
          datasets: [
            {
              data: livingMoidCounts,
              fill: true,
              borderColor: 'rgb(00, 255, 00)',
              borderWidth: 1,
              label: 'Living Moids',
              pointRadius: 0,
            },
          ],
        },
        options: {
          scales: {
            x: {
              offset: false,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    }
    livingChart.data.datasets.forEach((dataset) => {
      dataset.data.push(livingMoidCounts[livingMoidCounts.length - 1])
    })
    livingChart.data.labels = Array.from({ length: livingMoidCounts.length }, (_, i) => i + 1)
    livingChart.update('none')
  }

  $: if (livingMoidCounts) updateLivingChart()

  onMount(() => {
    updateLivingChart()
  })
</script>

<div class="stats-container">
  <canvas class="chart" bind:this={livingChartContainer}></canvas>
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
    margin-top: 5px;
    margin-bottom: 0;
    padding-left: 3px;
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
  }

  .selected {
    color: red;
  }

  .chart {
    max-height: 20vh;
    margin: 0;
    width: 100%;
    border: 1px solid gray;
    margin-bottom: 5px;
  }
  .living {
    max-height: 40vh;
    overflow-y: auto;
    border: 1px solid gray;
    padding: 3px;
    margin-bottom: 5px;
  }
  .deceased {
    max-height: 35vh;
    overflow-y: auto;
    border: 1px solid gray;
    padding: 3px;
  }
</style>
