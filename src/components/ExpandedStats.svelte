<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)
  import { onMount } from 'svelte'
  import LineChart from './LineChart.svelte'
  import { round } from '../utils/functions.js'
  import { Foxoid } from '../klasses/Foxoid'

  export let moids = []
  export let foxoids = []

  // Moid stats
  let avgsKeepMovingThreshold = []
  let avgsEnergyGivenToOffspring = []
  let avgsSufficientEnergyLevel = []
  let avgsMutationRate = []
  let avgsMutationImpact = []

  // Foxoid stats
  let foxAvgsKeepMovingThreshold = []
  let foxAvgsEnergyGivenToOffspring = []
  let foxAvgsSufficientEnergyLevel = []
  let foxAvgsMutationRate = []
  let foxAvgsMutationImpact = []

  function updateMoidAverages() {
    if (moids.length === 0) return
    let totKeepMovingThreshold = 0
    let totEnergyGivenToOffspring = 0
    let totSufficientEnergyLevel = 0
    let totMutationRate = 0
    let totMutationImpact = 0
    const moidCount = moids.length
    moids.forEach((moid) => {
      totKeepMovingThreshold += moid.keepMovingThreshold
      totEnergyGivenToOffspring += moid.energyGivenToOffspring
      totSufficientEnergyLevel += moid.sufficientEnergyLevel
      totMutationRate += moid.mutationRate
      totMutationImpact += moid.mutationImpact
    })
    avgsKeepMovingThreshold = [
      ...avgsKeepMovingThreshold,
      round(totKeepMovingThreshold / moidCount),
    ]
    avgsEnergyGivenToOffspring = [
      ...avgsEnergyGivenToOffspring,
      round(totEnergyGivenToOffspring / moidCount),
    ]
    avgsSufficientEnergyLevel = [
      ...avgsSufficientEnergyLevel,
      round(totSufficientEnergyLevel / moidCount),
    ]
    avgsMutationRate = [...avgsMutationRate, round(totMutationRate / moidCount)]
    avgsMutationImpact = [...avgsMutationImpact, round(totMutationImpact / moidCount)]
  }

  function updateFoxoidAverages() {
    if (foxoids.length === 0) return
    let totKeepMovingThreshold = 0
    let totEnergyGivenToOffspring = 0
    let totSufficientEnergyLevel = 0
    let totMutationRate = 0
    let totMutationImpact = 0
    const foxoidCount = foxoids.length
    foxoids.forEach((foxoid) => {
      totKeepMovingThreshold += foxoid.keepMovingThreshold
      totEnergyGivenToOffspring += foxoid.energyGivenToOffspring
      totSufficientEnergyLevel += foxoid.sufficientEnergyLevel
      totMutationRate += foxoid.mutationRate
      totMutationImpact += foxoid.mutationImpact
    })
    foxAvgsKeepMovingThreshold = [
      ...foxAvgsKeepMovingThreshold,
      round(totKeepMovingThreshold / foxoidCount),
    ]
    foxAvgsEnergyGivenToOffspring = [
      ...foxAvgsEnergyGivenToOffspring,
      round(totEnergyGivenToOffspring / foxoidCount),
    ]
    foxAvgsSufficientEnergyLevel = [
      ...foxAvgsSufficientEnergyLevel,
      round(totSufficientEnergyLevel / foxoidCount),
    ]
    foxAvgsMutationRate = [...foxAvgsMutationRate, round(totMutationRate / foxoidCount)]
    foxAvgsMutationImpact = [...foxAvgsMutationImpact, round(totMutationImpact / foxoidCount)]
  }

  $: if (moids) updateMoidAverages()
  $: if (foxoids) updateFoxoidAverages()

  onMount(() => {
    updateMoidAverages()
    updateFoxoidAverages()
  })
</script>

<div class="stats-container">
  <div class="stats-columns">
    <div class="stats-column">
      <!-- Foxoid Genetics -->
      <h2>Moid Genetics</h2>
      <h3>Keep Moving Threshold</h3>
      <div class="chart">
        <LineChart
          data={avgsKeepMovingThreshold}
          lineColor="rgb(255, 255, 255)"
          label="keepMovingThreshold"
          options={{ beginAtZero: false }}
        />
      </div>
      <h3>Energy to Offspring</h3>
      <div class="chart">
        <LineChart
          data={avgsEnergyGivenToOffspring}
          lineColor="rgb(255, 0, 255)"
          label="Energy to offspring"
          options={{ beginAtZero: false }}
        />
      </div>

      <h3>Sufficient Energy Level</h3>
      <div class="chart">
        <LineChart
          data={avgsSufficientEnergyLevel}
          lineColor="rgb(0, 255, 255)"
          label="Sufficient energy level"
          options={{ beginAtZero: false }}
        />
      </div>

      <h3>Mutation Rate</h3>
      <div class="chart">
        <LineChart
          data={avgsMutationRate}
          lineColor="rgb(255, 255, 0)"
          label="Mutation Rate"
          options={{ beginAtZero: false }}
        />
      </div>

      <h3>Mutation Impact</h3>
      <div class="chart">
        <LineChart
          data={avgsMutationImpact}
          lineColor="rgb(255, 0, 0)"
          label="Mutation Impact"
          options={{ beginAtZero: false }}
        />
      </div>
    </div>

    <!-- Foxoid Genetics -->
    <div class="stats-column">
      <h2>Foxoid Genetics</h2>
      <h3>Keep Moving Threshold</h3>
      <div class="chart">
        <LineChart
          data={foxAvgsKeepMovingThreshold}
          lineColor="rgb(255, 255, 255)"
          label="keepMovingThreshold"
          options={{ beginAtZero: false }}
        />
      </div>
      <h3>Energy to Offspring</h3>
      <div class="chart">
        <LineChart
          data={foxAvgsEnergyGivenToOffspring}
          lineColor="rgb(255, 0, 255)"
          label="Energy to offspring"
          options={{ beginAtZero: false }}
        />
      </div>

      <h3>Sufficient Energy Level</h3>
      <div class="chart">
        <LineChart
          data={foxAvgsSufficientEnergyLevel}
          lineColor="rgb(0, 255, 255)"
          label="Sufficient energy level"
          options={{ beginAtZero: false }}
        />
      </div>

      <h3>Mutation Rate</h3>
      <div class="chart">
        <LineChart
          data={foxAvgsMutationRate}
          lineColor="rgb(255, 255, 0)"
          label="Mutation Rate"
          options={{ beginAtZero: false }}
        />
      </div>

      <h3>Mutation Impact</h3>
      <div class="chart">
        <LineChart
          data={foxAvgsMutationImpact}
          lineColor="rgb(255, 0, 0)"
          label="Mutation Impact"
          options={{ beginAtZero: false }}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .stats-container {
    padding: 3px;
    margin-left: 10px;
    width: auto;
    max-height: 96.5vh;
    font-family: 'Courier New', Courier, monospace;
    color: white;
    overflow-y: auto;
  }

  .stats-columns {
    display: flex;
    gap: 20px;
  }

  .stats-column {
    flex: 1;
    min-width: 0; /* Allows columns to shrink below content size if needed */
  }

  h2 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1rem;
    margin: 0px 3px;
    padding-left: 3px;
  }

  .chart {
    border: 1px solid gray;
    margin: 0;
    padding: 3px;
    margin-bottom: 10px;
  }
</style>
