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
    console.log('Moid texture loaded')
  }

  constructor(col, row) {
    super(col, row, Moid.texture)
    const { cellSize } = Oid.appData

    this.energy = 300
    this.size = 400 // body size
    this.metabolicRate = get(simulationSettings)?.moid?.metabolicRate || 3// Energy consumed per turn
    this.feedingEfficiency = 0.2 // Amount of available grass the oid will eat
    this.foodEnergyConversion = 0.4 // Percentage of grass converted to oid energy
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
