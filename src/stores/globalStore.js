import { writable } from 'svelte/store'

// Load settings from localStorage or use defaults
function getStoredSettings() {
  const storedSettings = localStorage.getItem('moids-simulation-settings')
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings)
    } catch (e) {
      console.error('Failed to parse stored settings:', e)
    }
  }

  // Default settings
  return {
    initialMoidCount: 30,
    xCellCount: 30,
    maxFPS: 1,
    location: {
      grassRegrowthRate: 0.5,
      maxGrass: 150
    },
    moid: {
      metabolicRate: 3
    }
  }
}

// Create a custom store that syncs with localStorage
function createSettingsStore() {
  const settings = getStoredSettings()
  const { subscribe, set, update } = writable(settings)

  return {
    subscribe,
    set: (value) => {
      // Save to localStorage whenever set is called
      localStorage.setItem('moids-simulation-settings', JSON.stringify(value))
      return set(value)
    },
    update: (updater) => {
      // Need to capture the new value to save it
      return update(current => {
        const newValue = updater(current)
        localStorage.setItem('moids-simulation-settings', JSON.stringify(newValue))
        return newValue
      })
    }
  }
}

export const selectedDeploymentType = writable('Moid') // Grass, Moid or Foxoid
export const isRunning = writable(true)
export const showSettingsPanel = writable(false)
export const settingsPanelMode = writable('settings') // 'settings' or 'help'
export const simulationSettings = createSettingsStore()