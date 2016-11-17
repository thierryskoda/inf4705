'use strict'
let Utils = require('./utils')
let fs = require('fs')
let Block = require('./block')

// BlockStack
module.exports = class BlockStack {

  constructor() {
    this.height = 0
    this.stacks = []
    this.allBlocks = []
  }

  readFileAndGenerateAllBlocks(file) {
    let array = fs.readFileSync(file).toString().split("\n")

    // Remove the last element because it's a space
    if(array[array.length-1] == '' || !array[array.length-1]) {
      array.pop()
    }

    if(array[array.length-1] == '' || !array[array.length-1]) {
      array.pop()
    }

    // Il faut skip la première ligne car c'est le nombre de block qui a dans le fichier
    array.slice(1).forEach((line) => {
      let sides = line.split(' ')

      // console.log("side:", sides)
      this.allBlocks.push(this.createDimension(parseInt(sides[0]), parseInt(sides[1]), parseInt(sides[2])))
      this.allBlocks.push(this.createDimension(parseInt(sides[1]), parseInt(sides[0]), parseInt(sides[2])))
      this.allBlocks.push(this.createDimension(parseInt(sides[2]), parseInt(sides[1]), parseInt(sides[0])))
    })
  }

  /**
   * Create dimension for each block
   * @param  {Number} height
   * @param  {Number} side1
   * @param  {Number} side2
   * @return {Block}
   */
  createDimension(height, side1, side2) {
    let monBlock = new Block(height)
    if (side1 >= side2) {
      monBlock.profondeur = side1;
      monBlock.length = side2;
    } else {
      monBlock.length = side1;
      monBlock.profondeur = side2;
    }

    monBlock.surface = side2 * side1

    return monBlock;
  }

  /**
   * Sort blocs by surface biggest to smallest
   */
  sortAllBlocks() {
    this.allBlocks.sort((a, b) => {
      return b.surface - a.surface
    })
  }

  /**
   * Split all blocks
   */
  split() {
    this.allBlocks = this.allBlocks.reduce(function (acc, val) {
      var inner;
      if (acc.previous !== val.surface) {
          inner = [];
      } else {
          inner = acc.newArray.pop();
      }

      inner.push(val);
      acc.previous = val.surface;
      acc.newArray.push(inner);

      return acc;
      }, {
        previous: null,
        newArray: []
      }
    ).newArray;
  }

  /**
   * Algo to solve with vorace
   */
  createStackForVorace() {
    this.allBlocks.forEach((block) => {
      // Pour chaque block qui ont la même surface,
      // On shuffle l'array pour être probabiliste
      Utils.shuffle(block)
      block.some((b) => {
        // On en choisi un si au hasard si notre blockstack est vide
        if(!this.stacks.length) {
          this.stacks.push(block[Math.floor((Math.random() * block.length))])
          return true;
        }
        // On regarde pour chaque block si il peut entre par dessus l'autre avant
        // Et on l'ajoute au stacks en ajoute aussi la hauteur à la hauteur total
        if(b.smallerThen(this.stacks[this.stacks.length-1])) {
          this.stacks.push(b)
          this.height += b.height
          return true;
        }
      })
    })
  }

  /**
   * Algo to solve with the progdyn
   */
  solveDynamic() {
    let heightArray = [0]

    // H(j) = max 1 ≤ i < j : li>lj , pi>pj {H(i)} + hj
    for (var j = 0; j < this.allBlocks.length; j++) {
      let maxHeightTmp = 0
      // let indexTmp = 0
      for (var i = 0; i < heightArray.length; i++) {
        if(heightArray[i] > maxHeightTmp && this.allBlocks[j].smallerThen(this.allBlocks[i])) {
          // console.log("This height is bigger and fits:" + heightArray[i] + " vs " + maxHeightTmp);
          maxHeightTmp = heightArray[i]
        }
      }

      heightArray[j] = maxHeightTmp + this.allBlocks[j].height
    }

    // Find max block and height
    let maxHeight = 0

    heightArray.forEach((height, index) => {
      if(height > maxHeight) {
        maxHeight = height
        this.height = height;
      }
    })
  }

  /**
   * Solve tabou
   */
  solveTabou() {

    let tabouList = []
    let voisinageList = this.allBlocks
    let tourActuelle = []
    let iterWithoutOptimize = 0
    let hauteurTourMaximal = 0

    while(iterWithoutOptimize < 100) {
      // Choisir un bloc au hasard parmi dans la liste des blocs voisinages
      let block = voisinageList.splice([Math.floor( Math.random() * voisinageList.length) ], 1)[0]

      // On passe à travers la tour actuelle
      let placedABlock = false
      tourActuelle.forEach((b, index) => {

        // Si le block qu'on a choisi peut fit sur le block courrant
        if(block.smallerThen(b)) {

          // On place le block à cette position
          tourActuelle.splice(index, 0, block)
          placedABlock = true

          // On enlève les bloques par dessus si ils ne fit plus!
          verifierBlocs(index)
        }
      })

      // Si on a pas placé le block dans la tour par dessus un autre block, on le place à la fin
      if(!placedABlock) {
        tourActuelle.push(block)
        verifierBlocs(tourActuelle.length - 1)
      }

      // Helper function pour enlever les blocks qui ne fit pu à partir de l'index en paramètre
      function verifierBlocs(index) {
        let blocsToDelete = []
        for (var i = index - 1; i >= 0; i--) {
          // Si le block courrant n'est pas plus petit que le block par dessus
          // On le place dans la liste des blocs à enlever
          if(!tourActuelle[i].smallerThen(tourActuelle[index])) {
            let blockToPutInTabou = tourActuelle.slice(i, i + 1)[0]
            blocsToDelete.push(i)
            blockToPutInTabou.nombreIteration = 0
            blockToPutInTabou.maxNombreIteration = Math.floor( Math.random() * 4 + 7 )
            tabouList.push(blockToPutInTabou)
          }
        }

        // Ici on enlève les blocs de la tour que nous avons identifé comme mauvais
        blocsToDelete.forEach((index) => {
          tourActuelle.splice(index, 1)
        })
      }

      // Retirer les blocs qui ont fait leur temps dans la liste tabou
      tabouList.forEach((b, index) => {
        b.nombreIteration++
        if(b.nombreIteration === b.maxNombreIteration) {
          let block = tabouList.splice(index, 1)[0]
          delete block.maxNombreIteration
          delete block.nombreIteration
          voisinageList.push(block)
        }
      })

      // Calcul de la hauteur de la tour
      let hauteurActuelle = tourActuelle.reduce((a,b) => a + b.height, 0)

      iterWithoutOptimize++

      // Si la hauteur actuelle est plus grande que celle qu'on avait en mémoire,
      // on remplace et on met le compteur à zéro
      if(hauteurActuelle > hauteurTourMaximal) {
        hauteurTourMaximal = hauteurActuelle
        iterWithoutOptimize = 0
      }
    }

    return hauteurTourMaximal
  }
}
