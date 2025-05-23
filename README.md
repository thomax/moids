# moids
A simulation of mouse-oids being about their business of eating, being eaten, reproducing and dying.

## Running the thang locally
```
git clone <this repo>
cd moids
npm install
npm run dev
```

## Elevator pitch
Hva er Moids?

Moids er en økosystem/populasjonsdynamikk-simulator, som passer for ungdomsskolen og oppover. Den lar elevene utforske og leke seg med:
- Betydningen av populasjonsstørrelse på miljøet
- Interaksjon mellom rovdyr og byttedyr
- Endring i genetikk over tid, i en populasjon (genetisk drift)

Appen kjører i nettleseren, er godkjent for bruk i Osloskolen og krever ikke innlogging. PowerPoint og oppgavene er tilpasset naturfag vg1, men skal være greit å forenkle. Her er lenker til ressursene:

- Selve appen: https://moids.vercel.app/
- PowerPoint: https://udeoslokommuneno-my.sharepoint.com/:p:/g/personal/thdra003_osloskolen_no/EeIIqxGqOBFJiD9Yc5GL2ywB7ooe3j1hBolc84bMUMCDqA?e=w9WV1b
- Oppgaveark: https://udeoslokommuneno-my.sharepoint.com/:b:/g/personal/thdra003_osloskolen_no/Edkr0VzrjYdKvUeHXfZEN78BhQ_eCYKCU_48uj-G08zLxw?e=vYJY20
- Kildekoden: https://github.com/thomax/moids (hvis man vil utfordre en IT1- eller IT2-gruppe med å lese, forstå og gjøre endringer i kode)

## Explaining the attributes
Each moid and foxoid have the following attributes, which you can set in the config:

- `energy` - how much energy the oid has at a given moment. When this goes below 0, the oid dies.
- `size` - the maximum amount of energy an oid can store. Excess energy gained through feeding is lost.
- `metabolicRate` - the energy cost per simulation tick, to stay alive
- `feedingEfficiency` - how much of the available food can the oid utilize per tick, e.g. if this value is 100, and a moid has 0.4 feedingEfficiency, 40 grass can be eaten on that tick. The next tick, the moid can eat (100 - 40) * 0.4, and so on, until there is no more grass left to eat (see keepMovingThreshold).
- `foodEnergyConversion` - how much of the food ingested is turned into energy. e.g. if a moid has ingested 40 grass (after feedingEfficiency has been applied), a foodEnergyConversion value of 0.3 will give the moid 40*0.3 energy. 

Each moid and foxoid have the following genetic attributes. The initial value of these can't be changed by the user. However, on reproduction there is cointoss from which parent a genetic attribute is inherited. Also, see mutationRate below.

- `keepMovingThreshold` - If there is less than this amount of energy available (grass for moids, or moids for foxoids), the oid won't bother with eating, but will move instead
- `energyGivenToOffspring` - the ratio of own body energy given to offspring at reproduction. E.g. a moid with energyGivenToOffspring of 0.4 and an energy level of 300 will donate 300*0.4 energy to it's offspring. Both of the two parents are subject to this energy loss.
- `sufficientEnergyLevel` - Used to calculate minimum energy required to reproduce. E.g. a moid with size 500 and sufficientEnergyLevel 0.2 will only reproduce if current energy is > 100.
- `mutationRate` - When passing on attributes to offspring, what's the chance of a mutation occurring? mutationRate of 0.1 = 10% chance.
- `mutationImpact` - When a mutation occurs, how much does the attribute change? mutationImpact of 0.1 will cause a mutation of +/-10%.
