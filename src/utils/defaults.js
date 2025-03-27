export const oidDefaults = {
  initialMoidCount: 30,
  xCellCount: 30,
  maxFPS: 1,
  location: {
    grassRegrowthRate: 0.5,
    maxGrass: 150
  },
  moid: {
    energy: 300,
    size: 400,
    metabolicRate: 3,
    feedingEfficiency: 0.2,
    foodEnergyConversion: 0.4,
    // genetic
    keepMovingThreshold: 25,
    energyGivenToOffspring: 0.3,
    sufficientEnergyLevel: 0.8,
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
    sufficientEnergyLevel: 0.8,
    mutationRate: 0.1,
    mutationImpact: 0.1
  }
}