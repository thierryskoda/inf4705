'use strict'
// Création des bloques
module.exports = class Block {

  constructor(height, side1, side2, surface) {
    this.profondeur = side1
    this.length = side2
    this.height = height
    this.surface = surface || this.side1 * this.side2
  }

  // On regarde pour chaque block si il peut entre par dessus l'autre avant
  smallerThen(b) {
    return (this.length < b.length && this.profondeur < b.profondeur)
  }
}
