export const oidDefaults = {
  initialMoidCount: 2,
  xCellCount: 15,
  maxFPS: 1,
  location: {
    grassRegrowthRate: 0.5,
    maxGrass: 150
  },
  moid: {
    energy: 300,
    size: 500,
    metabolicRate: 3,
    feedingEfficiency: 0.2,
    foodEnergyConversion: 0.4,
    // genetic
    keepMovingThreshold: 25,
    energyGivenToOffspring: 0.3,
    sufficientEnergyLevel: 0.4,
    mutationRate: 0.1,
    mutationImpact: 0.1
  },
  foxoid: {
    energy: 1000,
    size: 3000,
    metabolicRate: 3,
    feedingEfficiency: 1,
    foodEnergyConversion: 0.9,
    // genetic
    keepMovingThreshold: 25,
    energyGivenToOffspring: 0.3,
    sufficientEnergyLevel: 0.2,
    mutationRate: 0.1,
    mutationImpact: 0.1
  }
}

export const VERSION = {
  // Format: YYYY-MM-DD-HH-MM
  buildTime: process.env.VITE_BUILD_TIME || new Date().toISOString(),
  buildId: process.env.VERCEL_GIT_COMMIT_SHA
    ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
    : 'local'
}