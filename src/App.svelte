<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { Application, Sprite, Assets, Graphics } from 'pixi.js'
  import { Location } from './klasses/Location.js'
  import { Moid } from './klasses/Moid.js'
  import MoidStats from './lib/MoidStats.svelte'
  import ExpandedStats from './lib/ExpandedStats.svelte'
  import spawnSoundPath from './assets/spawn-effect.wav'
  import deathSoundPath from './assets/death-effect.mp3'
  import { createDeathEffect, createSpawnEffect, playSound } from './utils/effects.js'

  //  import { moids, deadMoids, livingMoidCounts, deadMoidCounts } from './stores/moidStore.js'

  const initialMoidCount = 60
  const xCellCount = 40

  let moidFieldContainer
  let app
  const appData = {}

  let livingMoidCounts = []
  let deadMoidCounts = []
  const locations = []
  let moids = []
  let deadMoids = []

  async function initApp() {
    app = new Application()
    await app.init({
      hello: true,
      backgroundAlpha: 1,
      antialias: true,
      //background: 'rgb(111, 77, 22)',
      background: 'black',
      resizeTo: moidFieldContainer,
    })
    moidFieldContainer.appendChild(app.canvas)
    await Moid.loadTexture()

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
      const moid = new Moid(col, row)
      moids.push(moid)
      playSound('spawnSound', appData)
      createSpawnEffect(moid.sprite.x, moid.sprite.y, appData)
    }
    console.log('appData', appData)
    Moid.setAppData(appData)
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

  function updateMoids(moid) {
    let newlyDeceased = []
    moids.forEach((moid) => {
      const isMoidDead = !moid.metabolize()
      if (isMoidDead) {
        playSound('deathSound', appData)
        newlyDeceased.push(moid)
        return
      }
      const currentLocation = locations[moid.col][moid.row]
      if (moid.wantsToEat(currentLocation.grass)) {
        // If moid needs energy, eat
        moid.eatAt(currentLocation)
      } else if (moid.hasSufficientEnergy()) {
        // If moid has energy, mate
        const mate = moid.findMateAt(moid.col, moid.row, moids)
        if (mate) {
          const offspring = moid.createOffspringWith(mate)
          moids.push(offspring)
          playSound('spawnSound', appData)
          createSpawnEffect(offspring.sprite.x, offspring.sprite.y, appData)
        }
      } else {
        // With nothing better to do, move to a random adjacent location
        const { nextCol, nextRow } = currentLocation.randomAdjacentCoordinates()
        moid.moveTo(nextCol, nextRow)
      }
    })
    moids = moids.filter((m) => !newlyDeceased.includes(m))
    deadMoids = [...deadMoids, ...newlyDeceased]
    livingMoidCounts.push(moids.length)
    livingMoidCounts = [...livingMoidCounts]
    deadMoidCounts.push(deadMoids.length)
    deadMoidCounts = [...deadMoidCounts]
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

  function handleSelectedMoid(moidId) {
    const moid = moids.find((m) => m.id === moidId)
    moid.toggleSelected()
  }

  onMount(async () => {
    await initApp()
    initLocations(appData, locations)
    // Create moids
    await initMoids(appData)
    app.ticker.maxFPS = 1
    app.ticker.add((time) => {
      // this is the app run loop
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
  <div bind:this={moidFieldContainer} id="moid-field"></div>
  <MoidStats
    {moids}
    {deadMoids}
    onSelectedMoid={handleSelectedMoid}
    {livingMoidCounts}
    {deadMoidCounts}
  />
  <ExpandedStats {moids} />
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
