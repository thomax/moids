<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)
  import { onMount } from 'svelte'

  //  $: if (livingMoidCounts) updateLivingChart()

  onMount(() => {})
</script>

<div class="stats-container">asdf</div>

<style>
  .stats-container {
    border: 1px solid gray;
    padding: 3px;
    width: auto;
    height: 100vh;
  }
</style>
