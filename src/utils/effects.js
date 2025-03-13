import { Graphics } from 'pixi.js'
import { gsap } from 'gsap'

export function createSpawnEffect(x, y, appData) {
  const particleCount = 12
  const particles = []

  for (let i = 0; i < particleCount; i++) {
    const particle = new Graphics()
    particle.circle(0, 0, appData.cellSize / 20 + 1)
    particle.fill(0xffffff) // Yellow color
    particle.x = x
    particle.y = y
    appData.app.stage.addChild(particle)
    particles.push(particle)

    // Animate each particle
    const angle = (i / particleCount) * Math.PI * 2
    const distance = appData.cellSize * 1.5
    gsap.to(particle, {
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
      alpha: 0.9,
      duration: 1.5,
      ease: 'power3.out',
      onComplete: () => {
        particle.destroy()
      },
    })
  }
}

export function playSpawnSound(appData) {
  const source = appData.audioContext.createBufferSource()
  source.buffer = appData.spawnSound
  source.connect(appData.audioContext.destination)
  source.start(0)
}
