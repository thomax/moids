// @ts-nocheck
import { Assets } from 'pixi.js'
import foxoidImagePath from '../assets/foxoid.png'
import { Oid } from './Oid.js'

export class Foxoid extends Oid {
  static texture = null
  static selectedTintColor = 0x0000ff

  static async loadTexture() {
    Foxoid.texture = await Assets.load(foxoidImagePath)
  }

  constructor(col, row) {
    super(col, row, Foxoid.texture)

    this.name = this.name + ' the Fox'
    this.energy = 2000
    this.size = 3000 // body size
    this.metabolicRate = 3 // Energy consumed per turn
    this.feedingEfficiency = 1 // Amount of available food the oid will eat
    this.foodEnergyConversion = 1 // Percentage of food converted to oid energy
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
