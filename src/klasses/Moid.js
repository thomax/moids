// @ts-nocheck
import { allRandom } from 'human-names'
import { Sprite, Assets } from 'pixi.js'
import { gsap } from 'gsap'
import moidImagePath from '../assets/moid.png'
import { round } from '../utils/functions.js'

export class Moid {
  static animationDuration = 0.4
  static texture = null
  static appData = null
  static id = 1
  static geneticTraits = ['keepMovingThreshold', 'energyGivenToOffspring', 'sufficientEnergyLevel', 'mutationRate', 'mutationImpact']

  static async loadTexture() {
    Moid.texture = await Assets.load(moidImagePath)
  }

  static setAppData(appData) {
    Moid.appData = appData
  }

  constructor(col, row) {
    if (!Moid.texture) {
      throw new Error('Texture not loaded')
    }
    const { cellSize } = Moid.appData
    this.col = col
    this.row = row
    this.name = allRandom()
    this.id = Moid.id++
    this.generation = 0
    this.offspringCount = 0
    this.energy = 100
    this.speed = 1 // movement speed, unused
    this.size = 150 // body size
    this.metabolicRate = 3 // Energy consumed per turn
    this.feedingEfficiency = 0.2 // Amount of available grass the moid will eat
    this.grassEnergyConversion = 0.4 // Percentage of grass converted to moid energy
    // Genetic traits
    this.keepMovingThreshold = 25 // Grass level above which the moid will stop to eat
    this.energyGivenToOffspring = 0.3
    this.sufficientEnergyLevel = 0.8 // Energy level at which the moid will stop eating
    this.mutationRate = 0.1 // Chance of mutation occurring during reproduction
    this.mutationImpact = 0.1 // Impact of mutation on a trait
    // UI thingy
    this.isSelected = false
    this.assignSprite(this.col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, cellSize)
    console.info('Welcome', this.name, `${this.col},${this.row}!`)
  }

  getMaxEnergy() {
    // Energy storage capacity is proportional to size
    return this.size
  }

  assignSprite(x, y) {
    const { cellSize } = Moid.appData
    this.sprite = new Sprite(Moid.texture)
    this.sprite.width = cellSize * 0.7
    this.sprite.height = cellSize * 0.7
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.anchor.set(0.5)
    Moid.appData.app.stage.addChild(this.sprite)
  }

  eatAt(location) {
    const grass = location.grass
    const grassConsumed = grass * this.feedingEfficiency
    location.grass -= grassConsumed
    const energyConsumed = grassConsumed * this.grassEnergyConversion
    this.energy += energyConsumed
    if (this.energy > this.getMaxEnergy()) {
      this.energy = this.getMaxEnergy()
    }
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

  moveTo(newCol, newRow) {
    const { cellSize, colCount, rowCount } = Moid.appData
    const isWrappingX = Math.abs(newCol - this.col) > this.speed
    const isWrappingY = Math.abs(newRow - this.row) > this.speed
    const finalX = newCol * cellSize + cellSize / 2
    const finalY = newRow * cellSize + cellSize / 2
    let tempX
    let tempY
    // Perform movement in three steps
    // If the moid isn't wrapping the field, move straight to third step
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
        duration: Moid.animationDuration / 2
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
      this.assignSprite(teleportX, teleportY)
    }

    // Third, smooth movement to the target
    gsap.to(this.sprite, {
      x: finalX,
      y: finalY,
      duration: (isWrappingX || isWrappingY) ? Moid.animationDuration / 2 : Moid.animationDuration,
    })
    this.col = newCol
    this.row = newRow
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
    this.sprite.tint = this.isSelected ? 0xff000 : 0xffffff
  }

  wantsToEat(availableFood) {
    const hasLocationSufficientFood = availableFood > this.keepMovingThreshold
    return hasLocationSufficientFood && !this.hasSufficientEnergy()
  }

  hasSufficientEnergy() {
    return this.energy > this.getMaxEnergy() * this.sufficientEnergyLevel
  }

  findMateAt(col, row, moids) {
    return moids
      .filter(moid => moid.col === col && moid.row === row && moid.id !== this.id)
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)[0]
  }

  createOffspringWith(mate) {
    const offspring = new Moid(this.col, this.row)
    offspring.generation = Math.max(this.generation, mate.generation) + 1
    const energyFromMoid = this.energy * this.energyGivenToOffspring
    const energyFromMate = mate.energy * mate.energyGivenToOffspring
    offspring.energy = energyFromMoid + energyFromMate
    this.energy -= energyFromMoid
    this.offspringCount += 1
    mate.offspringCount += 1
    mate.energy -= energyFromMate

    // handle genetics
    Moid.geneticTraits.forEach(trait => {
      const parent = Math.random() < 0.5 ? this : mate
      offspring[trait] = parent[trait]
      // Maybe mutate
      if (Math.random() < parent.mutationRate) {
        const upOrDown = Math.random() < 0.5 ? -1 : 1
        offspring[trait] = round(parent[trait] + (parent[trait] * parent.mutationImpact * upOrDown))
        console.info('Mutation!', trait, parent[trait], parent.mutationImpact, '-->', offspring[trait])
        if (offspring[trait] < 0) {
          throw new Error('Mutation borkadas', parent, offspring, upOrDown)
        }
      }
    })
    return offspring
  }

}
