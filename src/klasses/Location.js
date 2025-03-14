// @ts-nocheck
import { Graphics } from 'pixi.js'

export class Location {

  static appData = null
  static maxGrass = 150
  static grassRegrowthRate = 0.5
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

  constructor(col, row) {
    const { cellSize } = Location.appData
    this.col = col
    this.row = row
    this.size = cellSize
    this.x = col * this.size
    this.y = row * this.size
    this.grass = Math.round(Math.random() * Location.maxGrass)
    this.cell = new Graphics()
    this.updateCell()
    Location.appData.app.stage.addChild(this.cell)
  }

  updateCell() {
    this.cell.clear()
    this.cell.rect(this.x, this.y, this.size, this.size)
    this.cell.fill({ color: 0x00ff00, alpha: this.grass / Location.maxGrass })
    this.cell.eventMode = 'static'
    this.cell.cursor = 'pointer'
    this.cell.onclick = () => {
      console.log('clicked')
      Location.appData.onClickCell(this.col, this.row)
    }
  }

  growGrass() {
    this.grass += Location.grassRegrowthRate
    if (this.grass > Location.maxGrass) {
      this.grass = Location.maxGrass
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
}
