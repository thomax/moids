<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import {
    showSettingsPanel,
    settingsPanelMode,
    simulationSettings,
  } from '../stores/globalStore.js'
  import { Location } from '../klasses/Location.js'

  // Local copy of settings that we'll edit
  let settings = { ...$simulationSettings }

  function toggleMode() {
    $settingsPanelMode = $settingsPanelMode === 'settings' ? 'help' : 'settings'
  }

  function closePanel() {
    $showSettingsPanel = false
  }

  function saveAndRestart() {
    // Update the store with new settings
    $simulationSettings = { ...settings }

    // Pass the new settings directly to the Location class
    Location.updateFromSettings()

    // Close the panel and trigger a page reload to restart the simulation
    $showSettingsPanel = false
    window.location.reload()
  }
</script>

<div class="settings-panel">
  <div class="settings-header">
    <h2>{$settingsPanelMode === 'settings' ? 'Simulation Settings' : 'Help'}</h2>
    <div class="header-buttons">
      <button on:click={toggleMode}>
        {$settingsPanelMode === 'settings' ? 'Show Help' : 'Show Settings'}
      </button>
      <button on:click={closePanel} class="close-button">✕</button>
    </div>
  </div>

  <div class="settings-content">
    {#if $settingsPanelMode === 'settings'}
      <div class="settings-form">
        <div class="setting-group">
          <label for="initialMoidCount">Initial Moid Count:</label>
          <input
            type="number"
            id="initialMoidCount"
            bind:value={settings.initialMoidCount}
            min="1"
            max="100"
          />
        </div>

        <div class="setting-group">
          <label for="xCellCount">Grid Size (cells):</label>
          <input type="number" id="xCellCount" bind:value={settings.xCellCount} min="10" max="50" />
        </div>

        <div class="setting-group">
          <label for="maxFPS">Simulation Speed (FPS):</label>
          <input
            type="number"
            id="maxFPS"
            bind:value={settings.maxFPS}
            min="0.2"
            max="10"
            step="0.1"
          />
        </div>

        <div class="setting-group">
          <label for="grassRegrowthRate">Grass Growth Rate:</label>
          <input
            type="number"
            id="grassRegrowthRate"
            bind:value={settings.location.grassRegrowthRate}
            min="0.1"
            max="5"
            step="0.1"
          />
        </div>

        <div class="setting-group">
          <label for="maxGrass">Maximum Grass Amount:</label>
          <input
            type="number"
            id="maxGrass"
            bind:value={settings.location.maxGrass}
            min="50"
            max="500"
          />
        </div>

        <div class="setting-group">
          <label for="moidMetabolicRate">Moid Metabolic Rate:</label>
          <input
            type="number"
            id="moidMetabolicRate"
            bind:value={settings.moid.metabolicRate}
            min="50"
            max="500"
          />
        </div>
      </div>
    {:else}
      <div class="help-content">
        <h3>Moids!</h3>
        <p>A simple ecosystem simulation with</p>
        <ul>
          <li><strong>Grass</strong> - Grows over time and provides energy for Moids</li>
          <li><strong>Moids</strong> - Herbivores that eat grass and reproduce</li>
          <li><strong>Foxoids</strong> - Predators that eat Moids and reproduce</li>
          <li>
            <strong>Genetics</strong> - On reproduction, Oid attributes might mutat. Observe genetic
            drift over time in the five charts to the far right
          </li>
        </ul>

        <h3>How to Use</h3>
        <ul>
          <li>Deploy extra grass, a Moid, or a Foxoid</li>
          <li>Select name of Moid or Foxoid in the lists to track it</li>
          <li>Adjust values in settings</li>
          <li>Observe how the population changes over time</li>
        </ul>

        <h3>About the Settings</h3>
        <ul>
          <li><strong>Initial Moid Count</strong> - Number of Moids at simulation start</li>
          <li><strong>Grid Size</strong> - Number of cells in the simulation grid</li>
          <li><strong>Simulation Speed</strong> - How fast the simulation runs (FPS)</li>
          <li><strong>Grass Growth Rate</strong> - How quickly grass regrows</li>
          <li><strong>Maximum Grass</strong> - Maximum amount of grass per cell</li>
          <li>
            <strong>Moid Metabolic Rate</strong> - How much energy a Moid spends per tick in order to
            stay alive
          </li>
        </ul>
      </div>
    {/if}
  </div>

  {#if $settingsPanelMode === 'help'}
    <div class="whoDunnit">
      Created by <a href="https://github.com/thomax/scrambled-groups" target="_blank">thomax</a> with
      🤨, 💚 and ☕️
    </div>
  {/if}

  <div class="settings-footer">
    {#if $settingsPanelMode === 'settings'}
      <button on:click={saveAndRestart} class="primary-button">Save & Restart Simulation</button>
      <button on:click={closePanel}>Cancel</button>
    {:else}
      <button on:click={closePanel}>Close</button>
    {/if}
  </div>
</div>

<style>
  .settings-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background-color: #121212;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 20px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #444;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }

  .settings-header h2 {
    margin: 0;
    color: #eee;
  }

  .header-buttons {
    display: flex;
    gap: 10px;
  }

  .settings-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .setting-group label {
    color: #ddd;
    font-size: 14px;
  }

  .setting-group input {
    background-color: #222;
    border: 1px solid #444;
    color: #eee;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
  }

  .settings-footer {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #444;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .whoDunnIt {
    position: absolute;
    bottom: 70px;
    right: 20px;
    font-size: 12px;
    color: #888;
    text-align: right;
  }

  .whoDunnIt a {
    color: #888;
    text-decoration: none;
  }

  .whoDunnIt a:hover {
    text-decoration: underline;
    color: #aaa;
  }

  button {
    background-color: #333;
    color: #eee;
    border: 1px solid #555;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }

  button:hover {
    background-color: #444;
  }

  .primary-button {
    background-color: #2a6446;
    border-color: #2a7446;
  }

  .primary-button:hover {
    background-color: #347852;
  }

  .close-button {
    padding: 5px 10px;
  }

  .help-content {
    color: #ddd;
    line-height: 1.6;
  }

  .help-content h3 {
    color: #eee;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .help-content ul {
    margin-left: 20px;
  }

  .help-content li {
    margin-bottom: 8px;
  }
</style>
