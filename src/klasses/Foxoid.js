// @ts-nocheck
import { get } from 'svelte/store'
import { Assets } from 'pixi.js'
import foxoidImagePath from '../assets/foxoid.png'
import { Oid } from './Oid.js'
import { Location } from './Location.js'
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

  findPrey() {
    const moids = Location.all[this.col][this.row].getMoids()
    if (moids.length <= 1) return moids[0]
    let bestPrey = moids[0]
    for (let i = 1; i < moids.length; i++) {
      if (moids[i].energy > bestPrey.energy) {
        bestPrey = moids[i]
      }
    }
    return bestPrey
  }
}