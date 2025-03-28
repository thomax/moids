<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)
  import { onMount } from 'svelte'
  import LineChart from './LineChart.svelte'
  import { round } from '../utils/functions.js'

  export let moids = []
  let avgsKeepMovingThreshold = []
  let avgsEnergyGivenToOffspring = []
  let avgsSufficientEnergyLevel = []
  let avgsMutationRate = []
  let avgsMutationImpact = []

  function updateAverages() {
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

  $: if (moids) updateAverages()

  onMount(() => {
    updateAverages()
  })
</script>

<div class="stats-container">
  <h2>Moid Genetic Attributes</h2>
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

<style>
  .stats-container {
    padding: 3px;
    margin-left: 10px;
    width: auto;
    max-height: 96.5vh;
    font-family: 'Courier New', Courier, monospace;
    padding: 3px;
    color: white;
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
