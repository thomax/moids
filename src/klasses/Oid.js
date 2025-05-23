// @ts-nocheck
import { allRandom } from 'human-names'
import { Sprite } from 'pixi.js'
import { gsap } from 'gsap'
import { Location } from './Location.js'
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

    // UI thingy
    this.isSelected = false
    this.assignSprite(texture)
    Location.all[this.col][this.row].addOid(this)
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
    this.sprite.removeFromParent()
    Location.all[this.col][this.row].removeOid(this)
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
    Location.all[this.col][this.row].removeOid(this)
    this.col = newCol
    this.row = newRow
    Location.all[this.col][this.row].addOid(this)
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
  }

  findMate() {
    const location = Location.all[this.col][this.row]
    if (!location) return null

    const oids = this.species === 'Moid' ? location.getMoids(this.id) : location.getFoxoids(this.id)

    if (!oids.length) return null
    let bestMate = oids[0]
    for (let i = 1; i < oids.length; i++) {
      if (oids[i].energy > bestMate.energy) {
        bestMate = oids[i]
      }
    }
    return bestMate.hasSufficientEnergy() ? bestMate : null
  }

  willEat(availableFood) {
    return availableFood > this.keepMovingThreshold
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
