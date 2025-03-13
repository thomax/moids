import { writable, derived } from 'svelte/store'

export const moids = writable([])
export const deadMoids = writable([])
export const livingMoidCounts = writable([])
export const deadMoidCounts = writable([])

// Derived stores for additional stats
export const totalMoids = derived(moids, $moids => $moids.length)
export const totalDeadMoids = derived(deadMoids, $deadMoids => $deadMoids.length)