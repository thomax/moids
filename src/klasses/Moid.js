// @ts-nocheck
import { get } from 'svelte/store'
import { Assets } from 'pixi.js'
import moidImagePath from '../assets/moid.png'
import { Oid } from './Oid.js'
import { simulationSettings } from '../stores/globalStore.js'

export class Moid extends Oid {
  static texture = null
  static selectedTintColor = 0xff00ff

  static async loadTexture() {
    Moid.texture = await Assets.load(moidImagePath)
  }

  constructor(col, row) {
    super(col, row, Moid.texture)
    const { cellSize } = Oid.appData

    // Get settings from the store
    const moidSettings = get(simulationSettings).moid

    // Apply settings from store
    this.energy = moidSettings.energy
    this.size = moidSettings.size
    this.metabolicRate = moidSettings.metabolicRate
    this.feedingEfficiency = moidSettings.feedingEfficiency
    this.foodEnergyConversion = moidSettings.foodEnergyConversion

    // Apply genetic traits
    this.keepMovingThreshold = moidSettings.keepMovingThreshold
    this.energyGivenToOffspring = moidSettings.energyGivenToOffspring
    this.sufficientEnergyLevel = moidSettings.sufficientEnergyLevel
    this.mutationRate = moidSettings.mutationRate
    this.mutationImpact = moidSettings.mutationImpact
  }

  eat(grassAmount) {
    const grassConsumed = grassAmount * this.feedingEfficiency
    const energyConsumed = grassConsumed * this.foodEnergyConversion
    this.energy += energyConsumed
    if (this.energy > this.getMaxEnergy()) {
      this.energy = this.getMaxEnergy()
    }
    return grassConsumed
  }

  updateSprite() {
    this.sprite.tint = this.isSelected ? Moid.selectedTintColor : 0xffffff
  }
}