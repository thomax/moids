<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { selectedDeploymentType } from '../stores/globalStore.js'
  let chartContainer
  let chart

  // Define the options and set a default selection
  const options = ['Grass', 'Moid', 'Foxoid']
  let selectedOption = options[1]

  function selectOption(option) {
    selectedOption = option
    console.log('Selected option:', option)
    $selectedDeploymentType = option
  }

  onMount(() => {
    // Initialize the store with default value
    $selectedDeploymentType = selectedOption
  })
</script>

<div class="buttons-container">
  {#each options as option, i}
    <button
      class:active={selectedOption === option}
      class:first={i === 0}
      class:middle={i === 1}
      class:last={i === 2}
      on:click={() => selectOption(option)}
    >
      {option}
    </button>
  {/each}
</div>

<style>
  .buttons-container {
    display: flex;
    gap: 0;
  }

  button {
    font-family: Arial, Helvetica, sans-serif;
    color: green;
    padding: 4px 8px;
    background-color: black;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid green;
    border-radius: 0;
    margin-right: -1px; /* Prevent double borders */
  }

  button.first {
    border-radius: 3px 0 0 3px;
  }

  button.last {
    border-radius: 0 3px 3px 0;
    margin-right: 0;
  }

  button.active {
    background-color: green;
    color: black;
    position: relative; /* Ensure active button's border appears on top */
    z-index: 1;
  }

  button:hover:not(.active) {
    background-color: #e9e9e9;
  }
</style>
