// @ts-nocheck
import { Graphics } from 'pixi.js'
import { get } from 'svelte/store'

import { simulationSettings } from '../stores/globalStore.js'


export class Location {

  static all = [] // 2D array of locations
  // Initialize with default values from the store
  static maxGrass = get(simulationSettings).location.maxGrass
  static grassRegrowthRate = get(simulationSettings).location.grassRegrowthRate
  static appData = null
  static directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
    { x: 1, y: -1 }, // up-right
    { x: 1, y: 1 }, // down-right
    { x: -1, y: 1 }, // down-left
    { x: -1, y: -1 }, // up-left
  ]

  static setAppData(appData) {
    Location.appData = appData
  }

  static updateFromSettings() {
    Location.maxGrass = get(simulationSettings).location.maxGrass
    Location.grassRegrowthRate = get(simulationSettings).location.grassRegrowthRate
  }

  constructor(col, row) {
    const { cellSize } = Location.appData
    this.col = col
    this.row = row
    this.size = cellSize
    this.x = col * this.size
    this.y = row * this.size
    this.grass = Math.round(Math.random() * Location.maxGrass)
    this.cell = new Graphics()
    this.cell.eventMode = 'static'
    this.cell.cursor = 'pointer'
    // Track entities in this location
    this.moids = {}
    this.foxoids = {}

    this.cell.onclick = () => {
      Location.appData.onClickCell(this.col, this.row)
    }
    this.updateCell()
    Location.appData.app.stage.addChild(this.cell)
  }

  updateCell() {
    this.cell.clear()
    this.cell.rect(this.x, this.y, this.size, this.size)
    this.cell.fill({ color: 0x00ff00, alpha: this.grass / Location.maxGrass })
  }

  growGrass() {
    this.grass += Location.grassRegrowthRate
    if (this.grass > Location.maxGrass) {
      this.grass = Location.maxGrass
    }
    this.updateCell()
  }

  reduceGrass(grassConsumed) {
    this.grass -= grassConsumed
    if (this.grass < 0) {
      this.grass = 0
    }
    this.updateCell()
  }

  randomAdjacentCoordinates() {
    const { colCount, rowCount } = Location.appData
    const { x, y } = Location.directions[Math.floor(Math.random() * Location.directions.length)]
    let nextCol = this.col + x
    let nextRow = this.row + y
    // maybe wrap the map
    if (nextCol < 0) {
      nextCol = colCount - 1
    } else if (nextCol >= colCount) {
      nextCol = 0
    }
    if (nextRow < 0) {
      nextRow = rowCount - 1
    } else if (nextRow >= rowCount) {
      nextRow = 0
    }
    return { nextCol, nextRow }
  }

  addOid(oid) {
    if (oid.species === 'Moid') {
      this.moids[oid.id] = oid
    } else if (oid.species === 'Foxoid') {
      this.foxoids[oid.id] = oid
    }
  }

  removeOid(oid) {
    if (oid.species === 'Moid') {
      delete this.moids[oid.id]
    } else if (oid.species === 'Foxoid') {
      delete this.foxoids[oid.id]
    }
  }

  getMoids(excludeId = null) {
    const values = Object.values(this.moids)
    return excludeId ? values.filter(m => m.id !== excludeId) : values
  }

  getFoxoids(excludeId = null) {
    const values = Object.values(this.foxoids)
    return excludeId ? values.filter(m => m.id !== excludeId) : values
  }
}
