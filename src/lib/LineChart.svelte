<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)

  import { onMount } from 'svelte'

  export let data = []
  export let lineColor = 'rgb(255, 255, 255)'
  export let label = 'Data'
  export let options = { beginAtZero: true }
  let chartContainer
  let chart

  function updateChart() {
    if (!chartContainer) return
    if (!chart) {
      chart = new Chart(chartContainer, {
        type: 'line',
        data: {
          labels: Array.from({ length: data.length }, (_, i) => i + 1),
          datasets: [
            {
              data: data,
              fill: true,
              borderColor: lineColor,
              borderWidth: 1,
              label: label,
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
              beginAtZero: options.beginAtZero,
              ticks: {
                display: true,
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
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data[data.length - 1])
    })
    chart.data.labels = Array.from({ length: data.length }, (_, i) => i + 1)
    chart.update('none')
  }

  $: if (data) updateChart()

  onMount(() => {
    updateChart()
  })
</script>

<canvas bind:this={chartContainer}></canvas>

<style>
</style>
