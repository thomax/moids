<script>
  // @ts-nocheck
  import { onMount } from 'svelte'
  import { Application, Sprite, Assets, Graphics } from 'pixi.js'
  import { Location } from './klasses/Location.js'
  import { Oid } from './klasses/Oid.js'
  import { Moid } from './klasses/Moid.js'
  import { Foxoid } from './klasses/Foxoid.js'
  import OidsStatusPanel from './components/OidsStatusPanel.svelte'
  import SettingsPanel from './components/SettingsPanel.svelte'
  import ExpandedStats from './components/ExpandedStats.svelte'
  import spawnSoundPath from './assets/spawn-effect.wav'
  import deathSoundPath from './assets/death-effect.mp3'
  import { createDeathEffect, createSpawnEffect, playSound } from './utils/effects.js'
  import {
    selectedDeploymentType,
    showSettingsPanel,
    simulationSettings,
    isRunning,
    isMuted,
  } from './stores/globalStore.js'

  // Use values from the store
  $: initialMoidCount = $simulationSettings.initialMoidCount
  $: xCellCount = $simulationSettings.xCellCount

  let oidFieldContainer
  let app
  const appData = {}

  const locations = []
  let moids = []
  let foxoids = []
  let livingMoidCounts = []
  let livingFoxoidCounts = []
  let starvedMoidCount = 0
  let predatedMoidCount = 0
  let starvedFoxoidCount = 0

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
      // selectedDeploymentType determines what to create
      if ($selectedDeploymentType === 'Moid') {
        oid = new Moid(col, row)
        moids.push(oid)
      } else if ($selectedDeploymentType === 'Foxoid') {
        oid = new Foxoid(col, row)
        foxoids.push(oid)
      } else if ($selectedDeploymentType === 'Grass') {
        const location = locations[col][row]
        location.grass = Location.maxGrass
        location.updateCell()
        return
      }

      if (oid) {
        if (!$isMuted) playSound('spawnSound', appData)
        createSpawnEffect(oid.sprite.x, oid.sprite.y, appData)
      }
    }
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
        if (!$isMuted) playSound('deathSound', appData)
        newlyDeceasedMoids.push(moid)
        starvedMoidCount++
        return
      }

      // If moid has energy, try to reproduce
      if (moid.hasSufficientEnergy()) {
        const mate = moid.findOtherOidsPresent(moids, { isMateable: true })[0]
        if (mate) {
          let offspring = new Moid(moid.col, moid.row)
          offspring = moid.createOffspringWith(offspring, mate)
          moids.push(offspring)
          if (!$isMuted) playSound('spawnSound', appData)
          createSpawnEffect(offspring.sprite.x, offspring.sprite.y, appData)
          return
        }
      }

      const currentLocation = locations[moid.col][moid.row]

      // If peckish and location offers food, eat
      if (moid.willEat(currentLocation.grass)) {
        const grassConsumed = moid.eat(currentLocation.grass)
        currentLocation.reduceGrass(grassConsumed)
        return
      }

      // With nothing else to do, move to a random adjacent location
      const { nextCol, nextRow } = currentLocation.randomAdjacentCoordinates()
      moid.moveTo(nextCol, nextRow)
    })
    moids = moids.filter((m) => !newlyDeceasedMoids.includes(m))
    livingMoidCounts.push(moids.length)
    livingMoidCounts = [...livingMoidCounts]
  }

  function updateFoxoids() {
    let newlyDeceasedFoxoids = []
    foxoids.forEach((foxoid) => {
      const isDead = !foxoid.metabolize()
      if (isDead) {
        if (!$isMuted) playSound('deathSound', appData)
        newlyDeceasedFoxoids.push(foxoid)
        starvedFoxoidCount++
        return
      }

      // If foxoid has enough energy, try to reproduce
      if (foxoid.hasSufficientEnergy()) {
        const mate = foxoid.findOtherOidsPresent(foxoids, { isMateable: true })[0]
        if (mate) {
          let offspring = new Foxoid(foxoid.col, foxoid.row)
          offspring = foxoid.createOffspringWith(offspring, mate)
          foxoids.push(offspring)
          if (!$isMuted) playSound('spawnSound', appData)
          createSpawnEffect(offspring.sprite.x, offspring.sprite.y, appData)
          return
        }
      }

      // If foxoid feels peckish, eat a moid if present
      const prey = foxoid.findOtherOidsPresent(moids)[0]
      if (prey && foxoid.willEat(prey.energy)) {
        const energyConsumed = foxoid.eat(prey.energy)
        prey.die()
        moids = moids.filter((m) => m.id !== prey.id)
        predatedMoidCount++
        return
      }

      // Move to a random adjacent location
      const currentLocation = locations[foxoid.col][foxoid.row]
      const { nextCol, nextRow } = currentLocation.randomAdjacentCoordinates()
      foxoid.moveTo(nextCol, nextRow)
    })
    foxoids = foxoids.filter((f) => !newlyDeceasedFoxoids.includes(f))
    livingFoxoidCounts.push(foxoids.length)
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

  function handleToggleSelectedOid(oidId) {
    ;[moids, foxoids].flat().forEach((oid) => {
      if (oid.id === oidId) {
        oid.toggleSelected()
      } else {
        oid.isSelected = false
      }
    })
  }

  function tickUpdate(time) {
    if ($isRunning) {
      updateFoxoids()
      updateMoids()
      updateLocations()
    }
  }

  onMount(async () => {
    await initApp()
    Location.updateFromSettings()
    initLocations(appData, locations)
    // Create moids
    await initMoids(appData)
    app.ticker.maxFPS = $simulationSettings.maxFPS
    app.ticker.add(tickUpdate)
    return () => {
      if (app) {
        app.destroy(true)
      }
    }
  })
</script>

<div id="container">
  <div bind:this={oidFieldContainer} id="moid-field"></div>
  <OidsStatusPanel
    {moids}
    {foxoids}
    {livingMoidCounts}
    {livingFoxoidCounts}
    {starvedMoidCount}
    {predatedMoidCount}
    {starvedFoxoidCount}
    onSelectedOid={handleToggleSelectedOid}
  />
  <ExpandedStats {moids} {foxoids} />
</div>

{#if $showSettingsPanel}
  <div class="modal-overlay"></div>
  <SettingsPanel />
{/if}

<style>
  #container {
    display: flex;
    justify-content: flex-start;
    height: 100vh;
    width: 180vw;
    overflow-x: auto;
  }

  #moid-field {
    width: 70vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 50;
  }
</style>
