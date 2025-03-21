<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { Application, Sprite, Assets, Graphics } from 'pixi.js'
  import { Location } from './klasses/Location.js'
  import { Oid } from './klasses/Oid.js'
  import { Moid } from './klasses/Moid.js'
  import { Foxoid } from './klasses/Foxoid.js'
  import MoidStats from './components/MoidStats.svelte'
  import ExpandedStats from './components/ExpandedStats.svelte'
  import spawnSoundPath from './assets/spawn-effect.wav'
  import deathSoundPath from './assets/death-effect.mp3'
  import { createDeathEffect, createSpawnEffect, playSound } from './utils/effects.js'

  const initialMoidCount = 30
  const xCellCount = 30

  let oidFieldContainer
  let app
  const appData = {}

  const locations = []
  let moids = []
  let deadMoids = []
  let foxoids = []
  let deadFoxoids = []
  let livingMoidCounts = []
  let deadMoidCounts = []
  let livingFoxoidCounts = []
  let deadFoxoidCounts = []

  async function initApp() {
    app = new Application()
    await app.init({
      hello: true,
      backgroundAlpha: 1,
      antialias: true,
      background: 'black',
      resizeTo: oidFieldContainer,
    })
    oidFieldContainer.appendChild(app.canvas)
    await Moid.loadTexture()
    await Foxoid.loadTexture()

    // sound setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const spawnSound = await fetch(spawnSoundPath)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioContext.decodeAudioData(buffer))
    const deathSound = await fetch(deathSoundPath)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioContext.decodeAudioData(buffer))

    appData.audioContext = audioContext
    appData.spawnSound = spawnSound
    appData.deathSound = deathSound

    // general game data
    const { width, height } = app.canvas
    const cellSize = Math.floor(width / xCellCount)
    appData.app = app
    appData.width = width
    appData.height = height
    appData.cellSize = cellSize
    appData.colCount = Math.floor(width / cellSize)
    appData.rowCount = Math.floor(height / cellSize)
    appData.onClickCell = (col, row) => {
      let oid
      if (false) {
        oid = new Moid(col, row)
        moids.push(oid)
      } else {
        oid = new Foxoid(col, row)
        foxoids.push(oid)
      }
      playSound('spawnSound', appData)
      createSpawnEffect(oid.sprite.x, oid.sprite.y, appData)
    }
    console.log('appData', appData)
    Oid.setAppData(appData)
    Location.setAppData(appData)
  }

  function initLocations(appData, locations) {
    const { width, height, colCount, rowCount, cellSize } = appData
    for (let col = 0; col < colCount; col += 1) {
      for (let row = 0; row < rowCount; row += 1) {
        if (locations[col] === undefined) {
          locations[col] = []
        }
        locations[col][row] = new Location(col, row, cellSize)
      }
    }
  }

  async function initMoids(appData) {
    const { width, height, colCount, rowCount, cellSize } = appData
    for (let i = 0; i < initialMoidCount; i++) {
      // find random location from locations array
      const randomCol = Math.floor(Math.random() * colCount)
      const randomRow = Math.floor(Math.random() * rowCount)
      // Draw moid sprite at this location
      const moid = new Moid(randomCol, randomRow)
      moids.push(moid)
    }
    return moids
  }

  function updateMoids() {
    let newlyDeceasedMoids = []
    moids.forEach((moid) => {
      const isDead = !moid.metabolize()
      if (isDead) {
        playSound('deathSound', appData)
        newlyDeceasedMoids.push(moid)
        return
      }
      const currentLocation = locations[moid.col][moid.row]
      if (moid.willEat(currentLocation.grass)) {
        // If moid needs energy, eat
        const grassConsumed = moid.eat(currentLocation.grass)
        currentLocation.reduceGrass(grassConsumed)
      } else {
        if (moid.hasSufficientEnergy() && moid.findOtherOidsPresent(moids)[0]) {
          const mate = moid.findOtherOidsPresent(moids)[0]
          // If moid has energy and mate in same cell, reproduce
          if (mate) {
            let offspring = new Moid(moid.col, moid.row)
            offspring = moid.createOffspringWith(offspring, mate)
            moids.push(offspring)
            playSound('spawnSound', appData)
            createSpawnEffect(offspring.sprite.x, offspring.sprite.y, appData)
          }
        } else {
          // With nothing else to do, move to a random adjacent location
          const { nextCol, nextRow } = currentLocation.randomAdjacentCoordinates()
          moid.moveTo(nextCol, nextRow)
        }
      }
    })
    moids = moids.filter((m) => !newlyDeceasedMoids.includes(m))
    deadMoids = [...deadMoids, ...newlyDeceasedMoids]
    livingMoidCounts.push(moids.length)
    livingMoidCounts = [...livingMoidCounts]
    deadMoidCounts.push(deadMoids.length)
    deadMoidCounts = [...deadMoidCounts]
  }

  function updateFoxoids() {
    let newlyDeceasedFoxoids = []
    foxoids.forEach((foxoid) => {
      const isDead = !foxoid.metabolize()
      if (isDead) {
        playSound('deathSound', appData)
        newlyDeceasedFoxoids.push(foxoid)
        return
      }
      const currentLocation = locations[foxoid.col][foxoid.row]
      const prey = foxoid.findOtherOidsPresent(moids)[0]

      if (prey && foxoid.willEat(prey.energy)) {
        // If foxoid needs energy, eat
        const energyConsumed = foxoid.eat(prey.energy)
        prey.die()
        moids = moids.filter((m) => m.id !== prey.id)
        deadMoids.push(prey)
      } else {
        if (foxoid.hasSufficientEnergy() && foxoid.findOtherOidsPresent(foxoids)[0]) {
          const mate = foxoid.findOtherOidsPresent(foxoids)[0]
          // If foxoid has energy and mate available, reproduce
          if (mate) {
            let offspring = new Foxoid(foxoid.col, foxoid.row)
            offspring = foxoid.createOffspringWith(offspring, mate)
            foxoids.push(offspring)
            playSound('spawnSound', appData)
            createSpawnEffect(offspring.sprite.x, offspring.sprite.y, appData)
          }
        } else {
          // With nothing else to do, move to a random adjacent location
          const { nextCol, nextRow } = currentLocation.randomAdjacentCoordinates()
          foxoid.moveTo(nextCol, nextRow)
        }
      }
    })
    foxoids = foxoids.filter((f) => !newlyDeceasedFoxoids.includes(f))
    livingFoxoidCounts.push(foxoids.length)
    deadFoxoidCounts.push(deadFoxoids.length)
  }

  function updateLocations() {
    const { colCount, rowCount } = appData
    for (let col = 0; col < colCount; col += 1) {
      for (let row = 0; row < rowCount; row += 1) {
        const loc = locations[col][row]
        loc.growGrass()
      }
    }
  }

  function handleSelectedOid(oidId) {
    ;[moids, foxoids].flat().forEach((oid) => {
      if (oid.id === oidId) {
        oid.toggleSelected()
      } else {
        oid.isSelected = false
      }
    })
  }

  onMount(async () => {
    await initApp()
    initLocations(appData, locations)
    // Create moids
    await initMoids(appData)
    app.ticker.maxFPS = 1
    app.ticker.add((time) => {
      // this is the app run loop
      updateFoxoids()
      updateMoids()
      updateLocations()
    })

    return () => {
      if (app) {
        app.destroy(true)
      }
    }
  })
</script>

<div id="container">
  <div bind:this={oidFieldContainer} id="moid-field"></div>
  <MoidStats
    {moids}
    {deadMoids}
    {foxoids}
    {livingMoidCounts}
    {deadMoidCounts}
    {livingFoxoidCounts}
    onSelectedOid={handleSelectedOid}
  />
  <ExpandedStats {moids} {foxoids} />
</div>

<style>
  #container {
    display: flex;
    justify-content: flex-start;
    height: 100vh;
    width: 180vw;
    overflow-x: auto;
  }

  #moid-field {
    width: 75vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }
</style>
