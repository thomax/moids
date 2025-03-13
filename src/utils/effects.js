import { Graphics } from 'pixi.js'
import { gsap } from 'gsap'

export function createSpawnEffect(x, y, appData) {
  const particleCount = 12
  const particles = []

  for (let i = 0; i < particleCount; i++) {
    const particle = new Graphics()
    particle.circle(0, 0, appData.cellSize / 20 + 1)
    particle.fill(0xffffff)
    particle.x = x
    particle.y = y
    appData.app.stage.addChild(particle)
    particles.push(particle)

    const angle = (i / particleCount) * Math.PI * 2
    const distance = appData.cellSize * 1.5
    // Animate each particle
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

export function createDeathEffect(x, y, appData) {
  const particleCount = 6
  const particles = []

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const distance = appData.cellSize * 1.5
    const particle = new Graphics()
    particle.circle(0, 0, 2)
    particle.fill(0xff00ff)
    particle.x = x + Math.cos(angle) * distance
    particle.y = y + Math.sin(angle) * distance
    appData.app.stage.addChild(particle)
    particles.push(particle)
    // Animate each particle
    gsap.to(particle, {
      x: x,
      y: y,
      alpha: 0.9,
      rotation: Math.PI * 2, // Full rotation
      duration: 1.1,
      ease: "power2.inOut",
      motionPath: {
        path: [
          {
            x: x + Math.cos(angle + Math.PI / 2) * (distance * 0.7),
            y: y + Math.sin(angle + Math.PI / 2) * (distance * 0.7)
          },
          {
            x: x,
            y: y
          }
        ],
        curviness: 1.5
      }, onComplete: () => {
        particle.destroy()
      },
    })
  }
}

export function playSound(soundName, appData) {
  const source = appData.audioContext.createBufferSource()
  const gainNode = appData.audioContext.createGain()
  source.buffer = appData[soundName]
  gainNode.gain.value = soundName === 'deathSound' ? 0.2 : 1
  source.connect(gainNode)
  gainNode.connect(appData.audioContext.destination)
  source.start(0)
}
