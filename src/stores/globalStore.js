import { writable } from 'svelte/store'
import { oidDefaults } from '../utils/defaults.js'

// Load settings from localStorage and merge with defaults to ensure all required properties exist
function getStoredSettings() {
  const storedSettings = localStorage.getItem('moids-simulation-settings')
  if (storedSettings) {
    try {
      // Deep merge stored settings with defaults to ensure all properties exist
      const parsedSettings = JSON.parse(storedSettings)
      return deepMerge(structuredClone(oidDefaults), parsedSettings)
    } catch (e) {
      console.error('Failed to parse stored settings:', e)
    }
  }
  return structuredClone(oidDefaults)
}

function deepMerge(target, source) {
  for (const key in source) {
    // If property is an object, recursively merge
    if (source[key] && typeof source[key] === 'object' &&
      target[key] && typeof target[key] === 'object') {
      deepMerge(target[key], source[key])
    } else {
      // Otherwise just copy the value over
      if (key in target) {
        target[key] = source[key]
      }
    }
  }
  return target
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
export const isMuted = writable(false)
export const showSettingsPanel = writable(false)
export const settingsPanelMode = writable('settings') // 'settings' or 'help'
export const simulationSettings = createSettingsStore()