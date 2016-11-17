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
    if(array[array.length-1] == '') {
      array.pop()
    }

    // Il faut skip la première ligne car c'est le nombre de block qui a dans le fichier
    array.slice(1).forEach((line) => {
      let sides = line.split(' ')

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

    // console.log("indexArray:", indexArray)
    // console.log("heightArray:", heightArray)
    // console.log("maxIndice:", maxIndice)
    // console.log("height for this indice is:", this.allBlocks[maxIndice].height)
    // console.log("maxHeight:", maxHeight)

    // Start
    // let hauteurTmp = maxHeight - this.allBlocks[maxIndice].height
    // console.log("first hauteurTmp:", hauteurTmp)
    // let newIndice = maxIndice
    // this.stacks.push(this.allBlocks[maxIndice])

    // for (var i = 0; i < maxIndice; i++) {
    //   for (var j = 0; j < newIndice; j++) {
    //     if(heightArray[j] === hauteurTmp) {
    //       hauteurTmp -= this.allBlocks[i].height
    //       this.stacks.push(this.allBlocks[j])
    //       newIndice = i
    //     }
    //   }
    // }
  }

  /**
   * Solve tabou
   */
  solveTabou() {


    // Chacun de ses blocs sera alors tabou pour un nombdre d'itérations entre 7 et 10
    // Le voisin choisi est celui qui maximise la hauteur de la tour

    let tabouList = []
    let iterWithoutFinding = 0

    console.log("this:", this.allBlocks)

    for(;;) {
      // Arrêter après 100 itérations sans trouver quelque chose
      if(iterWithoutFinding === 100) return this.stacks.forEach(b => this.height += b.height)

      // Choisir un bloc parmi ceux ne faisant pas partie de la tour NI de la liste taboue
      let block = this.allBlocks.find((b) => (!this.stacks.find(sb => sb.id === b.id) && !tabouList.find(tb => tb.id === b.id)) )

      // Placer ce bloc sur un bloc qui peut recevoir ce bloc dans la tour
      // Cette insertion peut engendrer le retrait de certains blocs directement au-dessus pour conserver l'équilibre de la tour
      let placedABlock = false

      console.log("block:", block)

      if(!this.stacks.length) {
        this.stacks.push(block)
        placedABlock = true
      } else {
        this.stacks.some((b, index) => {

          if(block.smallerThen(b)) {

            // console.log("index", index + 1);

            // Le block courrant est plus petit que le prochain block donc on l'ajoute à la tour à la bonne position
            // this.stacks.splice(index, 0, b)

            // On enlève les bloques par dessus
            let toPutInTabou =  this.stacks.slice(index, 9e9)
            this.stacks.length = index
            // On rajoute le block
            this.stacks.push(b)
            placedABlock = true

            toPutInTabou.forEach((b) => {
              b.nombreIteration = 0
              b.maxNombreIteration = Math.floor( Math.random() * 4 + 7 )
              tabouList.push(b)
            })

            // Trouver si il y a des blocks qui ne 'fit' plus. On regarde tous les blocks après celui qu'on vient d'ajouter
            // for (var i = index + 1; i < this.stacks.length; i++) {
            //   if(!this.stacks[i].smallerThen(i-1)) {
            //     // Ça veut dire que le block est plus gros que le précédant donc on l'enlève et place dans tabou
            //     this.stacks[i].nombreIteration = 0
            //     this.stacks[i].maxNombreIteration = Math.floor( Math.random() * 4 + 7 )
            //     tabouList.push(this.stacks[i])
            //     this.stacks.splice(i, 1)
            //   }
            // }

            // Exit the loop
            return true
          }
        })
      }

      // Retirer les blocs qui ont fait leur temps dans la liste tabou
      tabouList.forEach((b, index) => {
        b.nombreIteration++
        if(b.nombreIteration === b.maxNombreIteration) {
          tabouList.splice(index, 1)
        }
      })

      // On a rien trouvé
      if(!placedABlock) {
        iterWithoutFinding++
      }
    }
  }
}
