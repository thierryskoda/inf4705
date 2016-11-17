'use strict'
let BlockStack = require('./blockstack')
let Block = require('./block')
let Utils = require('./utils')
let Constants = require('./constants')
let ExportService = require('./export')

let exportData = []

console.log("---------------------------------------Programmation dynamique---------------------------------------")

// For each [100, 500, 1000, ...]
for (var i = 0; i < Constants.DONNEES_PROGDYN.length; i++) {
  let moyennePourSerieHauteur = 0
  let moyennePourSerieTemps = 0
  // Ex: there is 9 for 100, 9 for 500, ...
  for (var j = 0; j < Constants.MAX_FILE_PER_SETS; j++) {
    // Start time and do the algo
    var hrstart = process.hrtime();
    var dynamicBlockStack = new BlockStack()
    dynamicBlockStack.readFileAndGenerateAllBlocks(__dirname + '/donnee/' + Constants.FIRST_LETTER_OF_SET + Constants.DONNEES_PROGDYN[i] + '_' + j)
    dynamicBlockStack.sortAllBlocks()
    dynamicBlockStack.solveDynamic()
    let diff = process.hrtime(hrstart);
    // Algo done, Add time to moyenne
    moyennePourSerieHauteur += dynamicBlockStack.height
    moyennePourSerieTemps += (diff[0] * 1e9 + diff[1]) * 1e-6
  }
  moyennePourSerieHauteur /= Constants.MAX_FILE_PER_SETS
  moyennePourSerieTemps /= Constants.MAX_FILE_PER_SETS
  console.log("Moyenne hauteur pour la série " + Constants.DONNEES_PROGDYN[i] + " est " + moyennePourSerieHauteur)
  console.log("Moyenne temps pour la série " + Constants.DONNEES_PROGDYN[i] + " est " + moyennePourSerieTemps + 'ms')

  // Add the data for the exports
  exportData.push({
    'Taille': Constants.DONNEES_PROGDYN[i],
    'Moyenne Hauteur Max': moyennePourSerieHauteur,
    'Moyenne Temps': moyennePourSerieTemps
  })
}

// Export to csv to make the graphics
ExportService.exportToCsv('DYNAMIC.csv', exportData, Constants.FIELDS)
