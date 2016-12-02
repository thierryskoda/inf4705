'use strict'
var fs = require('fs')

/**
 * Idées
 */
// Placer les compagnies qui ont le plus de restrictions en premier
// Placer les petites compagnies en premier

// nb de compagnies]_[nb max de participants pour une compagnie]_[p].i

// Lecture du fichier

// Enregister le nombre de talbe

// Placer compagnies dans liste

// Placer les conditions dans liste

// Trier les compagnies en fonction du nombre de restrictions pour chacun

// Placer les compagnies une à une en choisissant une table au hazard où c'est possible de la mettre en fonction des compagnies déjà placé

// Poids ?

/**************************************************************************************************************
*
*  On construit les listes avec le fichier
*
**************************************************************************************************************/
var array = fs.readFileSync('./donnees/20_3_0.3.1').toString().split("\n")
var listeCompagnieGlobal = []

array.pop()

var nombreDeTable = parseInt(array.splice(0,1))
var nombreDeCompagnie = parseInt(array.splice(0,1))
var listeCompagnie = array.splice(0, nombreDeCompagnie)
var nombreDeRestrictions = parseInt(array.splice(0, 1))
var listeRestrictions = array.splice(0, nombreDeRestrictions)
var nombreDePairOui = parseInt(array.splice(0, 1))
var listePairOui = array.splice(0, nombreDePairOui)
var nombreDePairNon = parseInt(array.splice(0, 1))
var listePairNon = array.splice(0, nombreDePairNon)

console.log("listeCompagnie:", listeCompagnie.length)
console.log("listeRestrictions:", listeRestrictions.length)
console.log("listePairOui:", listePairOui.length)
console.log("listePairNon:", listePairNon.length)

/**
 * On rempli chacun de nos tableaux pour chaque compagnie selon la liste
 * @param  {Array} list      La liste en question (restrictions, pairOui, pairNon)
 * @param  {Array} compagnie la compagnie courrante
 * @param  {Integer} indexC  l'indice de la compagnie courrante
 * @return {Array}           retourne une liste avec les informations sur la compagnie courrante comme
 *                           les compagnies qu'elle ne veut pas s'asseoir avec, les compagnies qu'elle aimerait
 *                           s'asseoir avec et les compagnies qu'elle aimerait ne pas être avec
 */
function findRestrictionsFor(list, compagnie, indexC) {
  var listTmp = []

  list.forEach((item, indexR) => {
    if(indexC == item.split(' ')[0]) {
      listTmp.push(parseInt(item.split(' ')[1]))
    }
  })

  return listTmp
}

/**
 * On contruit notre liste global
 */
listeCompagnie.forEach((compagnie, index) => {
  var object = {
    index: index,
    nombreDePersonne: parseInt(listeCompagnie[0]),
    listeRestrictions: findRestrictionsFor(listeRestrictions, compagnie, index),
    listeOui: findRestrictionsFor(listePairOui, compagnie, index),
    listeNon: findRestrictionsFor(listePairNon, compagnie, index)
  }

  listeCompagnieGlobal.push(object)
})

/**************************************************************************************************************
*
*  On applique l'algo
*
**************************************************************************************************************/
let scoreAlgoMax = 9999999

while(1) {

  // On crée les tables vident
  var listeTable = []
  for (var i = 0; i < nombreDeTable; i++) {
    var table = {
      // nombreDePersonne: 0,
      listeCompagnie: []
    }
    listeTable.push(table)
  }

  // On mélange la liste des compagnies
  shuffle(listeCompagnieGlobal)

  // On passe à travers la liste des indices de compagnies qui sont random
  listeCompagnieGlobal.forEach((compagnie) => {

    // On mélange l'ordre des tables
    shuffle(listeTable)

    // Pour chaque table
    listeTable.some((table) => {

      // On regarde si on peut mettre la compagnie
      if(canPutHere(compagnie, table)) {
        table.listeCompagnie.push(compagnie)
        return true
      }

    })

  })

  /**
   * Fonction qui vérifie si on mettre la compagnie dans la table
   * On regarde la liste des compagnies déjà présentent à la table
   * et on regarde si il y a une compagnie dans ceux-ci qui se trouve
   * aussi dans la liste des compagnies interdites de la compagnie courrante
   */
  function canPutHere(compagnie, table) {
    var canPutHere = true

    // Pour la compagnie courrante selon ses restrictions
    compagnie.listeRestrictions.some((r) => {
      table.listeCompagnie.some((c) => {
        if(r == c.index) {
          canPutHere = false
          return true
        }
      })
    })

    // Pour les compagnies déjà présentent
    if(canPutHere) {
      table.listeCompagnie.forEach((cTable) => {
          cTable.listeRestrictions.forEach((r) => {
            if(r === compagnie.index) {
              canPutHere = false
              return true
            }
          })
      })
    }

    return canPutHere
  }
  // console.log("Voici les tables:\n", listeTable.map((t, index) => t.listeCompagnie.map((c, indexC) => c.index)))

  /**************************************************************************************************************
   *  CALCUL DE L'ÉCART TYPE
   **************************************************************************************************************/
  // Calculer le nombre de personne total
  let nombreDePersonneTotal = listeCompagnieGlobal.reduce((total, compagnie) => total += compagnie.nombreDePersonne, 0)
  // console.log("ListeDePersonne total", nombreDePersonneTotal);
  // Moyenne de personne par table
  let moyenneParTable = nombreDePersonneTotal / listeTable.length

  let ecartType = 0
  // Pour chaque table, on fait:
  listeTable.forEach((table) => {

    // Calcul du nombre de personne pour chaque table
    let nombreDePersonnePourTable = 0
    table.listeCompagnie.forEach(c => nombreDePersonnePourTable += c.nombreDePersonne)

    // (Nombre de personne à la table - nombre de personne total/Nombre de table) ^ 2
    ecartType += Math.pow(nombreDePersonnePourTable - ( nombreDePersonneTotal / listeTable.length ), 2)

  })

  // Multiplié par 1 / Nombre de table
  ecartType * ( 1 / listeTable.length )

  // Et on fait la racine carré de tout ça
  ecartType = Math.sqrt(ecartType)
  // console.log("Voici l'écart type:", ecartType)


  /**************************************************************************************************************
   *  Calcule des poids
   **************************************************************************************************************/

   // Pour toutes les tables
  listeTable.forEach((table, i) => {
    let poidTable = 0

    // Pour chacune des compagnies de la table i
    table.listeCompagnie.forEach((compagnie, j) => {

      // Pour chacune des compagnies voisine de droite de la compagnie
      // ICI J'AI MIS K = 0 AFIN DE REVÉRIFIER À CHAQUE FOIS TOUS LES VOISINS CAR ON PEUT AVOIR
      // 0 4 ET 4 0
      for (var k = 0; k < table.listeCompagnie.length; k++) {

        // On regarde dans la liste de compagnies OUI si la compagnie k est présente dedans
        if(compagnie.listeOui.find(cIndex => cIndex === table.listeCompagnie[k].index)) {
            poidTable--
        }

        // On regarde dans la liste de compagnies NON si la compagnie k est présente dedans
        if(compagnie.listeNon.find(cIndex => cIndex === table.listeCompagnie[k].index)) {
            poidTable++
        }

      }

    })

    // console.log("Le poid pour la table " + i + " est: " + poidTable )
    table.poid = poidTable

  })

  // Calcul du score de l'algo
  const scoreOfAlgo = listeTable.reduce((totalPoid, t) => totalPoid += t.poid, 0) + ecartType

  // On veut enregistrer le meilleur score de l'aglo
  if(scoreOfAlgo < scoreAlgoMax) {

    /**************************************************************************************************************
     *  VÉRIFICATION QU'ON A TOUTES LES COMPAGNIES D'ASSISES
     **************************************************************************************************************/
    let nombreTotalCompagnieAuTable = 0
    listeTable.forEach((table) => {
      nombreTotalCompagnieAuTable += table.listeCompagnie.length
    })

    // Si la vérification passe, on peut dire qu'on a trouvé une meilleure solution
    if(nombreTotalCompagnieAuTable === nombreDeCompagnie) {
      scoreAlgoMax = scoreOfAlgo
      console.log("Nous avons une meilleur solution:" , scoreAlgoMax);

      /**************************************************************************************************************
       *  AFFICHAGE
       **************************************************************************************************************/
      // var listeTableFormated = listeTable.map((t, index) => t.listeCompagnie.map((c, indexC) => c.index))

      // var file = fs.createWriteStream('resultat.txt');
      // listeTableFormated.forEach(function(v) { file.write(v.join(' ') + '\n'); });
      // file.write('Fin')
      // file.end();
    }

  }

}


/**************************************************************************************************************
*
*  HELPERS
*
**************************************************************************************************************/
// Fonction pour nous aider à mélanger la liste pour être certain
// d'avoir des choix aléatoire
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
