<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import {
    MdPause,
    MdPlayArrow,
    MdSettings,
    MdHelp,
    MdVolumeOff,
    MdVolumeUp,
  } from 'svelte-icons/md/'
  import {
    selectedDeploymentType,
    showSettingsPanel,
    settingsPanelMode,
    isRunning,
    isMuted,
  } from '../stores/globalStore.js'
  let chartContainer
  let chart

  // Define the options and set a default selection
  const options = ['Grass', 'Moid', 'Foxoid']
  let selectedOption = options[1]

  function selectDeploymentOption(option) {
    selectedOption = option
    $selectedDeploymentType = option
  }

  function handleSettingsToggle(mode) {
    $settingsPanelMode = mode
    $showSettingsPanel = true
  }

  function handleRunToggle() {
    $isRunning = !$isRunning
  }

  function handleMuteToggle() {
    $isMuted = !$isMuted
  }

  onMount(() => {
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
      onclick={() => selectDeploymentOption(option)}
    >
      {option}
    </button>
  {/each}

  <div class="settings-buttons-container">
    <button class="settings-button" onclick={() => handleRunToggle()}>
      <div class="icon-wrapper">
        {#if $isRunning}
          <MdPause />
        {:else}
          <MdPlayArrow />
        {/if}
      </div>
    </button>

    <button class="settings-button" onclick={() => handleMuteToggle()}>
      <div class="icon-wrapper">
        {#if $isMuted}
          <MdVolumeOff />
        {:else}
          <MdVolumeUp />
        {/if}
      </div>
    </button>

    <button class="settings-button" onclick={() => handleSettingsToggle('settings')}>
      <div class="icon-wrapper">
        <MdSettings />
      </div>
    </button>

    <button class="settings-button" onclick={() => handleSettingsToggle('help')}>
      <div class="icon-wrapper">
        <MdHelp />
      </div>
    </button>
  </div>
</div>

<style>
  .buttons-container {
    display: flex;
    gap: 0;
    padding-right: 0px;
  }

  .settings-buttons-container {
    display: flex;
    gap: 5px;
    padding-left: 5px;
    padding-right: 0px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    width: 18px;
  }

  :global(.icon-wrapper svg) {
    height: 100%;
    width: 100%;
  }

  .settings-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 3px;
  }

  button {
    font-family: Arial, Helvetica, sans-serif;
    color: green;
    padding: 4px 6px;
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
