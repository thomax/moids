// @ts-nocheck
import { Graphics } from 'pixi.js'

export class Location {

  static app = null
  static maxGrass = 150

  static setApp(app) {
    Location.app = app
  }

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
    Location.app.stage.addChild(this.cell)
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
    this.grass += 0.5
    if (this.grass > Location.maxGrass) {
      this.grass = Location.maxGrass
    }
    this.updateCell()
  }
}
