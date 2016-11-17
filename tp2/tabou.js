'use strict'
let BlockStack = require('./blockstack')
let Block = require('./block')
let Utils = require('./utils')
let Constants = require('./constants')
let ExportService = require('./export')

let exportData = []

console.log("---------------------------------------Tabou---------------------------------------")

/**
 * If a path is specified
 */
if(global.PATH) {
  var hrstart = process.hrtime();
  var dynamicBlockStack = new BlockStack()
  dynamicBlockStack.readFileAndGenerateAllBlocks(global.PATH)
  let tourMAx = dynamicBlockStack.solveTabou()
  let diff = process.hrtime(hrstart);

  // Si le professeur veut voir la tour
  if(global.PRINT_NUMBERS) {
    console.log("Voici la tour:", tourMAx.map(b => {
        return {
          'hauteur': b.height,
          'Largeur': b.length,
          'Profondeur': b.profondeur
        }
      }).reverse()
    )
  }

} else { // Else, this is for debug

  // For each [100, 500, 1000, ...]
  for (var i = 0; i < Constants.DONNEES.length; i++) {
    let moyennePourSerieHauteur = 0
    let moyennePourSerieTemps = 0
    // Ex: there is 9 for 100, 9 for 500, ...
    for (var j = 0; j < Constants.MAX_FILE_PER_SETS; j++) {
      // Start time and do the algo
      var hrstart = process.hrtime();
      var dynamicBlockStack = new BlockStack()
      dynamicBlockStack.readFileAndGenerateAllBlocks(__dirname + '/donnee/' + Constants.FIRST_LETTER_OF_SET + Constants.DONNEES[i] + '_' + j)
      let tourMAx = dynamicBlockStack.solveTabou()
      let diff = process.hrtime(hrstart);
      // Algo done, Add time to moyenne
      moyennePourSerieHauteur += tourMAx.reduce((a,b) => a + b.height, 0)
      moyennePourSerieTemps += (diff[0] * 1e9 + diff[1]) * 1e-6
    }
    moyennePourSerieHauteur /= Constants.MAX_FILE_PER_SETS
    moyennePourSerieTemps /= Constants.MAX_FILE_PER_SETS
    console.log("Moyenne hauteur pour la série " + Constants.DONNEES[i] + " est " + moyennePourSerieHauteur)
    console.log("Moyenne temps pour la série " + Constants.DONNEES[i] + " est " + moyennePourSerieTemps + 'ms')

    // Add the data for the exports
    exportData.push({
      'Taille': Constants.DONNEES[i],
      'Moyenne Hauteur Max': moyennePourSerieHauteur,
      'Moyenne Temps': moyennePourSerieTemps
    })
  }

  // Export to csv to make the graphics
  ExportService.exportToCsv('TABOU.csv', exportData, Constants.FIELDS)
}


