var json2csv = require('json2csv');

const ALGO_TYPE = (process.argv.length > 2) ? process.argv[2] : null;
const PATH = (process.argv.length > 3) ? [process.argv[3]] : "all";
const OPTIONS = (process.argv.length > 4) ? [process.argv[4]] : null;
var PRINT_TIME = false;
var PRINT_NUMBERS = false;
// const TAILLE = (process.argv.length > 3) ? [process.argv[3]] : [1000, 5000, 10000, 50000, 100000];

// ALGO_TYPE bucket|bucketSeuil|merge|mergeSeuil
if(!ALGO_TYPE && ALGO_TYPE !== 'vorace' && ALGO_TYPE != 'progdyn' && ALGO_TYPE != 'tabou') {
  throw "No algo was specified. Use : 'tp.sh -a ALGO_GOES_HERE'  ALGO choices are vorace, progdyn, tabou";
}

// PATH
if(PATH === "all") {
  throw "No path specified. Use : 'tp.sh -a ALGO_GOES_HERE -e PATH_GOES_HERE"
}

// OPTIONS
if(!OPTIONS) {
  console.log("---------------------------------------No options specified---------------------------------------")
} else {
  if(OPTIONS[0].includes('-t')) {
    PRINT_TIME = true;
  }
  if(OPTIONS[0].includes('-p')) {
    PRINT_NUMBERS = true;
  }
}

global.PATH = PATH[0]
global.PRINT_TIME = PRINT_TIME
global.PRINT_NUMBERS = PRINT_NUMBERS

if(ALGO_TYPE === 'vorace') {
  require('./vorace')
}

if(ALGO_TYPE === 'progdyn') {
  require('./dynamic')
}

if(ALGO_TYPE === 'tabou') {
  require('./tabou')
}





