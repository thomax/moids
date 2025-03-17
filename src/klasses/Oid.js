// @ts-nocheck
import { allRandom } from 'human-names'
import { Sprite } from 'pixi.js'
import { gsap } from 'gsap'
import { round } from '../utils/functions.js'

export class Oid {
  static animationDuration = 0.4
  static appData = null
  static id = 1
  static geneticTraits = ['keepMovingThreshold', 'energyGivenToOffspring', 'sufficientEnergyLevel', 'mutationRate', 'mutationImpact']

  static setAppData(appData) {
    Oid.appData = appData
  }

  constructor(col, row, texture) {
    const { cellSize } = Oid.appData
    this.col = col
    this.row = row
    this.name = allRandom()
    this.id = Oid.id++
    this.generation = 0
    this.offspringCount = 0
    this.speed = 1 // movement speed, unused

    // this.energy = 100
    // this.metabolicRate = 3 // Energy consumed per turn
    // this.feedingEfficiency = 0.2 // Amount of available grass the oid will eat
    // this.foodEnergyConversion = 0.4 // Percentage of grass converted to oid energy
    // this.size = 150 // body size

    // Genetic traits
    this.keepMovingThreshold = 25 // Grass level above which the oid will stop to eat
    this.energyGivenToOffspring = 0.3
    this.sufficientEnergyLevel = 0.8 // Energy level at which the oid will stop eating
    this.mutationRate = 0.1 // Chance of mutation occurring during reproduction
    this.mutationImpact = 0.1 // Impact of mutation on a trait
    // UI thingy
    this.isSelected = false
    this.assignSprite(texture)
    console.info(`New ${this.constructor.name}`, this.name, this.id, `${this.col},${this.row}!`)
  }

  getMaxEnergy() {
    // Energy storage capacity is proportional to size
    return this.size
  }

  assignSprite(texture) {
    const { cellSize } = Oid.appData
    this.sprite = new Sprite(texture)
    this.sprite.width = cellSize * 0.7
    this.sprite.height = cellSize * 0.7
    this.sprite.x = this.col * cellSize + cellSize / 2
    this.sprite.y = this.row * cellSize + cellSize / 2
    this.sprite.anchor.set(0.5)
    Oid.appData.app.stage.addChild(this.sprite)
  }

  metabolize() {
    this.energy -= this.metabolicRate
    if (this.energy <= 0) {
      this.die()
      return false
    }
    this.sprite.tint = this.isSelected ? 0xff0000 : 0xffffff
    return true
  }

  die() {
    console.info(this.name, 'died', '🏴‍☠️')
    this.sprite.removeFromParent()
  }

  createOffspringWith(offspring, mate) {
    offspring.generation = Math.max(this.generation, mate.generation) + 1
    const energyFromOid = this.energy * this.energyGivenToOffspring
    const energyFromMate = mate.energy * mate.energyGivenToOffspring
    offspring.energy = energyFromOid + energyFromMate
    this.energy -= energyFromOid
    mate.energy -= energyFromMate
    this.offspringCount += 1
    mate.offspringCount += 1

    // handle genetics
    Oid.geneticTraits.forEach(trait => {
      const parent = Math.random() < 0.5 ? this : mate
      offspring[trait] = parent[trait]
      // Maybe mutate
      if (Math.random() < parent.mutationRate) {
        const upOrDown = Math.random() < 0.5 ? -1 : 1
        offspring[trait] = round(parent[trait] + (parent[trait] * parent.mutationImpact * upOrDown))
        //console.info('Mutation!', trait, parent[trait], parent.mutationImpact, '-->', offspring[trait])
      }
    })
    return offspring
  }

  moveTo(newCol, newRow) {
    const { cellSize, colCount, rowCount } = Oid.appData
    const isWrappingX = Math.abs(newCol - this.col) > this.speed
    const isWrappingY = Math.abs(newRow - this.row) > this.speed
    const finalX = newCol * cellSize + cellSize / 2
    const finalY = newRow * cellSize + cellSize / 2
    let tempX
    let tempY
    // Perform movement in three steps
    // If the oid isn't wrapping the field, move straight to third step
    if (isWrappingX || isWrappingY) {
      // First, smooth move to the edge of the field
      if (isWrappingX) {
        tempX = this.col === 0 ? 0 : colCount * cellSize + cellSize
      } else {
        tempX = finalX
      }
      if (isWrappingY) {
        tempY = this.row === 0 ? 0 : rowCount * cellSize + cellSize
      } else {
        tempY = finalY
      }
      gsap.to(this.sprite, {
        x: tempX,
        y: tempY,
        duration: Oid.animationDuration / 2
      })
      // Second, remove the sprite and add a new at the opposite edge
      this.sprite.removeFromParent()
      this.sprite = null
      let teleportX = tempX
      let teleportY = tempY
      if (isWrappingX) {
        teleportX = this.col == 0 ? colCount * cellSize : 0
      }
      if (isWrappingY) {
        teleportY = this.row == 0 ? rowCount * cellSize : 0
      }
      this.assignSprite(this.constructor.texture)
      this.sprite.x = teleportX
      this.sprite.y = teleportY
    }

    // Third, smooth movement to the target
    gsap.to(this.sprite, {
      x: finalX,
      y: finalY,
      duration: (isWrappingX || isWrappingY) ? Oid.animationDuration / 2 : Oid.animationDuration,
    })
    this.col = newCol
    this.row = newRow
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
  }

  // array of oids in cell, sorted by energy
  findOtherOidsPresent(oids) {
    const { col, row, id } = this
    return oids
      .filter(oid => oid.col === col && oid.row === row && oid.id !== id)
      .sort((a, b) => b.energy - a.energy)
  }

  willEat(availableFood) {
    const hasLocationSufficientFood = availableFood > this.keepMovingThreshold
    return hasLocationSufficientFood && !this.hasSufficientEnergy()
  }

  hasSufficientEnergy() {
    return this.energy > this.getMaxEnergy() * this.sufficientEnergyLevel
  }

  metabolize() {
    this.energy -= this.metabolicRate
    if (this.energy <= 0) {
      this.die()
      return false
    }
    this.updateSprite() // implemented in subclasses
    return true
  }

}
