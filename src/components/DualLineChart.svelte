<script>
  // @ts-nocheck
  import { Chart, registerables } from 'chart.js'
  Chart.register(...registerables)

  import { onMount } from 'svelte'

  export let data = []
  export let lineColor = 'rgb(255, 255, 255)'
  export let label = 'Data'
  export let options = { beginAtZero: true }

  // Add second line properties
  export let secondaryData = []
  export let secondaryLineColor = 'rgb(255, 99, 132)'
  export let secondaryLabel = 'Secondary Data'
  export let secondaryOptions = { beginAtZero: true, position: 'right' }

  let chartContainer
  let chart

  function updateChart() {
    if (!chartContainer) return
    if (!chart) {
      chart = new Chart(chartContainer, {
        type: 'line',
        data: {
          labels: Array.from(
            { length: Math.max(data.length, secondaryData.length) },
            (_, i) => i + 1
          ),
          datasets: [
            {
              data: data,
              fill: true,
              borderColor: lineColor,
              borderWidth: 1,
              label: label,
              pointRadius: 0,
              yAxisID: 'y',
            },
            // Add second dataset only if data is provided
            ...(secondaryData.length
              ? [
                  {
                    data: secondaryData,
                    fill: true,
                    borderColor: secondaryLineColor,
                    borderWidth: 1,
                    label: secondaryLabel,
                    pointRadius: 0,
                    yAxisID: 'y1',
                  },
                ]
              : []),
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
              position: 'left',
              ticks: {
                display: true,
                color: lineColor, // Make left axis labels white
              },
            },
            // Configure second y-axis
            ...(secondaryData.length
              ? {
                  y1: {
                    beginAtZero: secondaryOptions.beginAtZero,
                    position: secondaryOptions.position,
                    grid: {
                      drawOnChartArea: false,
                    },
                    ticks: {
                      display: true,
                      color: secondaryLineColor, // Make right axis labels same color as the line
                    },
                  },
                }
              : {}),
          },
          responsive: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    } else {
      // Update primary data
      chart.data.datasets[0].data = data

      // Handle secondary data
      if (secondaryData.length > 0) {
        if (chart.data.datasets.length < 2) {
          // Add secondary dataset if it doesn't exist
          chart.data.datasets.push({
            data: secondaryData,
            fill: true,
            borderColor: secondaryLineColor,
            borderWidth: 1,
            label: secondaryLabel,
            pointRadius: 0,
            yAxisID: 'y1',
          })

          // Add secondary y-axis
          chart.options.scales.y1 = {
            beginAtZero: secondaryOptions.beginAtZero,
            position: secondaryOptions.position,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              display: true,
            },
          }
        } else {
          // Update existing secondary dataset
          chart.data.datasets[1].data = secondaryData
        }
      }

      // Update labels to cover the maximum length of either dataset
      chart.data.labels = Array.from(
        { length: Math.max(data.length, secondaryData.length) },
        (_, i) => i + 1
      )
    }
    chart.update('none')
  }

  $: if (data || secondaryData) updateChart()

  onMount(() => {
    updateChart()
  })
</script>

<canvas bind:this={chartContainer}></canvas>

<style>
</style>
