<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import {
    showSettingsPanel,
    settingsPanelMode,
    simulationSettings,
  } from '../stores/globalStore.js'
  import { Location } from '../klasses/Location.js'
  import { Moid } from '../klasses/Moid.js'
  import { Foxoid } from '../klasses/Foxoid.js'
  import locationImagePath from '../assets/location.png'
  import moidImagePath from '../assets/moid.png'
  import foxoidImagePath from '../assets/foxoid.png'
  import { oidDefaults } from '../utils/defaults.js'

  // Local copy of settings that we'll edit
  let settings = { ...$simulationSettings }

  function handleToggleMode() {
    $settingsPanelMode = $settingsPanelMode === 'settings' ? 'help' : 'settings'
  }

  function handleClosePanel() {
    $showSettingsPanel = false
  }

  function handleResetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      settings = structuredClone(oidDefaults)
    }
  }

  function handleSaveAndRestart() {
    let message = ''
    if (settings.initialMoidCount > 1000) {
      alert("Initial number of Moids can't exceed 1000. Setting to 1000.")
      settings.initialMoidCount = 1000
    }
    if (settings.xCellCount > 200) {
      alert("Number of cells per row can't exceed 200. Setting to 200.")
      settings.xCellCount = 200
    }

    // Update the store with new settings
    $simulationSettings = { ...settings }

    // Pass the new settings directly to the necessary classes
    Location.updateFromSettings()

    // Close the panel and trigger a page reload to restart the simulation
    $showSettingsPanel = false
    window.location.reload()
  }

  // Handle keyboard events (ESC key)
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      handleClosePanel()
    }
  }

  onMount(() => {
    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeydown)

    // Clean up when component is destroyed
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

<div class="settings-panel">
  <div class="settings-header">
    <h2>{$settingsPanelMode === 'settings' ? 'Simulation Settings' : 'Help'}</h2>
    <div class="header-buttons">
      <button on:click={handleToggleMode}>
        {$settingsPanelMode === 'settings' ? 'Show Help' : 'Show Settings'}
      </button>
      <button on:click={handleClosePanel} class="close-button">✕</button>
    </div>
  </div>

  <div class="settings-content">
    {#if $settingsPanelMode === 'settings'}
      <div class="settings-form">
        <!-- Global Settings Section -->
        <div class="settings-section">
          <h3>Global Settings</h3>
          <div class="settings-grid">
            <div class="setting-group">
              <label for="initialMoidCount">Initial Moid Count:</label>
              <input
                type="number"
                id="initialMoidCount"
                bind:value={settings.initialMoidCount}
                min="1"
                max="500"
              />
            </div>

            <div class="setting-group">
              <label for="xCellCount">Cells pr. row:</label>
              <input
                type="number"
                id="xCellCount"
                bind:value={settings.xCellCount}
                min="10"
                max="100"
                step="1"
              />
            </div>

            <div class="setting-group">
              <label for="maxFPS">Simulation Speed (FPS):</label>
              <input
                type="number"
                id="maxFPS"
                bind:value={settings.maxFPS}
                min="1"
                max="60"
                step="1"
              />
            </div>
          </div>
        </div>

        <!-- Location Settings Section -->
        <div class="settings-section">
          <h3>
            <img src={locationImagePath} alt="Location" /> Location Settings
            <img src={locationImagePath} alt="Location" />
          </h3>
          <div class="settings-grid">
            <div class="setting-group">
              <label for="grassRegrowthRate">Grass Growth Rate:</label>
              <input
                type="number"
                id="grassRegrowthRate"
                bind:value={settings.location.grassRegrowthRate}
                min="0"
                max="50"
                step="0.1"
              />
            </div>

            <div class="setting-group">
              <label for="maxGrass">Max Grass Amount:</label>
              <input
                type="number"
                id="maxGrass"
                bind:value={settings.location.maxGrass}
                min="10"
                max="500"
              />
            </div>
          </div>
        </div>

        <!-- Moid Settings Section -->
        <div class="settings-section">
          <h3>
            <img src={moidImagePath} alt="Moid" /> Moid Settings
            <img src={moidImagePath} alt="Moids" />
          </h3>
          <div class="settings-grid">
            <div class="setting-group">
              <label for="moidEnergy">Starting Energy:</label>
              <input
                type="number"
                id="moidEnergy"
                bind:value={settings.moid.energy}
                min="10"
                max="1000"
              />
            </div>

            <div class="setting-group">
              <label for="moidSize">Max Energy:</label>
              <input
                type="number"
                id="moidSize"
                bind:value={settings.moid.size}
                min="50"
                max="2000"
              />
            </div>

            <div class="setting-group">
              <label for="moidMetabolicRate">Metabolic Rate:</label>
              <input
                type="number"
                id="moidMetabolicRate"
                bind:value={settings.moid.metabolicRate}
                min="0.1"
                max="30"
                step="0.1"
              />
            </div>

            <div class="setting-group">
              <label for="moidFeedingEfficiency">Feeding Efficiency:</label>
              <input
                type="number"
                id="moidFeedingEfficiency"
                bind:value={settings.moid.feedingEfficiency}
                min="0.1"
                max="1"
                step="0.05"
              />
            </div>

            <div class="setting-group">
              <label for="moidFoodEnergy">Food Energy Conversion:</label>
              <input
                type="number"
                id="moidFoodEnergy"
                bind:value={settings.moid.foodEnergyConversion}
                min="0.1"
                max="1"
                step="0.05"
              />
            </div>
          </div>
        </div>

        <!-- Foxoid Settings Section -->
        <div class="settings-section">
          <h3>
            <img src={foxoidImagePath} alt="Foxoid" /> Foxoid Settings
            <img src={foxoidImagePath} alt="Foxoid" />
          </h3>
          <div class="settings-grid">
            <div class="setting-group">
              <label for="foxoidEnergy">Starting Energy:</label>
              <input
                type="number"
                id="foxoidEnergy"
                bind:value={settings.foxoid.energy}
                min="50"
                max="10000"
              />
            </div>

            <div class="setting-group">
              <label for="foxoidSize">Max Energy:</label>
              <input
                type="number"
                id="foxoidSize"
                bind:value={settings.foxoid.size}
                min="100"
                max="10000"
              />
            </div>

            <div class="setting-group">
              <label for="foxoidMetabolicRate">Metabolic Rate:</label>
              <input
                type="number"
                id="foxoidMetabolicRate"
                bind:value={settings.foxoid.metabolicRate}
                min="0.1"
                max="20"
                step="0.1"
              />
            </div>

            <div class="setting-group">
              <label for="foxoidFeedingEfficiency">Feeding Efficiency:</label>
              <input
                type="number"
                id="foxoidFeedingEfficiency"
                bind:value={settings.foxoid.feedingEfficiency}
                min="0.1"
                max="1"
                step="0.05"
              />
            </div>

            <div class="setting-group">
              <label for="foxoidFoodEnergy">Food Energy Conversion:</label>
              <input
                type="number"
                id="foxoidFoodEnergy"
                bind:value={settings.foxoid.foodEnergyConversion}
                min="0.1"
                max="1"
                step="0.05"
              />
            </div>
          </div>
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
            <strong>Genetics</strong> - On reproduction, Oid attributes might mutate. Observe genetic
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
          <li><strong>Grid Size</strong> - Number of locations per row in the simulation grid</li>
          <li><strong>Simulation Speed</strong> - How fast the simulation runs (FPS)</li>
          <li><strong>Grass Growth Rate</strong> - How quickly grass regrows</li>
          <li><strong>Maximum Grass</strong> - Maximum amount of grass per location</li>
          <li><strong>Metabolic Rate</strong> - How much energy an oid spends per tick</li>
          <li><strong>Feeding Efficiency</strong> - How much food an entity can consume</li>
          <li>
            <strong>Food Energy Conversion</strong> - How efficiently food is converted to energy
          </li>
          <li><strong>Max Energy</strong> - Determines the maximum energy capacity</li>
        </ul>
      </div>
    {/if}
  </div>

  {#if $settingsPanelMode === 'help'}
    <div class="whoDunnIt">
      Created by <a href="https://github.com/thomax/moids" target="_blank">thomax</a> with 🤨, 💚 and
      ☕️
    </div>
  {/if}

  <div class="settings-footer">
    {#if $settingsPanelMode === 'settings'}
      <div class="settings-actions">
        <button on:click={handleSaveAndRestart} class="primary-button"
          >Save & Restart Simulation</button
        >
        <button on:click={handleResetSettings} class="reset-button"
          >Reset to default settings</button
        >
        <button on:click={handleClosePanel}>Cancel</button>
      </div>
    {:else}
      <button on:click={handleClosePanel}>Close</button>
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

  .settings-section {
    margin-bottom: 50px;
  }

  .settings-section h3 {
    color: #eee;
    font-size: 16px;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #333;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
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

  .settings-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    width: 100%;
  }

  .reset-button {
    background-color: #541414;
    border-color: #6b1a1a;
    color: #eee;
  }

  .reset-button:hover {
    background-color: #761c1c;
  }

  .whoDunnIt {
    position: absolute;
    bottom: 70px;
    right: 20px;
    font-size: 1rem;
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
