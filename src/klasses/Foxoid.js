// @ts-nocheck
import { get } from 'svelte/store'
import { Assets } from 'pixi.js'
import foxoidImagePath from '../assets/foxoid.png'
import { Oid } from './Oid.js'
import { simulationSettings } from '../stores/globalStore.js'

export class Foxoid extends Oid {
  static texture = null
  static selectedTintColor = 0x0000ff

  static async loadTexture() {
    Foxoid.texture = await Assets.load(foxoidImagePath)
  }

  constructor(col, row) {
    super(col, row, Foxoid.texture)

    // Get settings from the store
    const foxoidSettings = get(simulationSettings).foxoid

    // Apply settings from store
    this.name = this.name + ' the Fox'
    this.energy = foxoidSettings.energy
    this.size = foxoidSettings.size
    this.metabolicRate = foxoidSettings.metabolicRate
    this.feedingEfficiency = foxoidSettings.feedingEfficiency
    this.foodEnergyConversion = foxoidSettings.foodEnergyConversion

    // Apply genetic traits
    this.keepMovingThreshold = foxoidSettings.keepMovingThreshold
    this.energyGivenToOffspring = foxoidSettings.energyGivenToOffspring
    this.sufficientEnergyLevel = foxoidSettings.sufficientEnergyLevel
    this.mutationRate = foxoidSettings.mutationRate
    this.mutationImpact = foxoidSettings.mutationImpact
  }

  eat(moidSize) {
    const foodConsumed = moidSize * this.feedingEfficiency
    const energyConsumed = foodConsumed * this.foodEnergyConversion
    this.energy += energyConsumed
    if (this.energy > this.getMaxEnergy()) {
      this.energy = this.getMaxEnergy()
    }
    return energyConsumed
  }

  updateSprite() {
    this.sprite.tint = this.isSelected ? Foxoid.selectedTintColor : 0xffffff
  }
}