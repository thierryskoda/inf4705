'use strict'

var MergeSort = require('./algo/merge.sort');
var InsertionSort = require('./algo/insertion.sort');
var BucketSort = require('./algo/bucket.sort');
var fs = require('fs');
var json2csv = require('json2csv');

/*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 /  Constants
 /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
const FIELDS = ['taille', 's1', 's2', 's3'];
const seuil = 100;
const ARRAY_TYPE = (process.argv.length > 2) ? process.argv[2] : null;
const PATH = (process.argv.length > 3) ? [process.argv[3]] : "all";
const OPTIONS = (process.argv.length > 4) ? [process.argv[4]] : null;
var PRINT_TIME = false;
var PRINT_NUMBERS = false;
// const TAILLE = (process.argv.length > 3) ? [process.argv[3]] : [1000, 5000, 10000, 50000, 100000];

// ARRAY_TYPE bucket|bucketSeuil|merge|mergeSeuil
if(!ARRAY_TYPE && ARRAY_TYPE !== 'merge' && ARRAY_TYPE != 'bucket' && ARRAY_TYPE != 'bucketSeuil' && ARRAY_TYPE != 'mergeSeuil') {
  throw "No algo was specified. Use : 'tp.sh -a ALGO_GOES_HERE'  ALGO choices are merge, bucket, bucketSeuil, mergeSeuil";
}

// PATH
if(PATH === "all") {
  throw "No path specified. Use : 'tp.sh -a ALGO_GOES_HERE -e PATH_DATA"
}

// OPTIONS
if(!OPTIONS) {
  console.log("No options specified:")
} else {
  if(OPTIONS[0].includes('-t')) {
    PRINT_TIME = true;
  }
  if(OPTIONS[0].includes('-p')) {
    PRINT_NUMBERS = true;
  }
}

/*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 /  UTility functions
 /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
function getArrayOfNumbers(array) {
  return array.map(function(element) {
    return parseInt(element);
  });
}

// Exports to CSV
function exportToCsv(fileName, data, FIELDS) {
  var result = json2csv({
    data: data,
    FIELDS: FIELDS
  });

  fs.writeFile('results/' + fileName, result, function(err) {
    if (err) throw err;
    console.log(fileName + " file created");
  });
}

// Verify if sorted
function verifyIfSorted(arr) {
  var sorted = true;
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i+1]) {
        sorted = false;
        break;
    }
  }
  return sorted;
}

// Get the execution time of the array
function getExecutionTime(arrayToSort, type) {
  // Put it in numbers
  arrayToSort = getArrayOfNumbers(arrayToSort);

  if(type === 'merge') {
    MergeSort.seuil = 0;
    var hrstart = process.hrtime();
    var sortedArray = MergeSort.sortV3(arrayToSort);
    var hrendMilli = process.hrtime(hrstart)[1]/1000000;
  } else if(type === 'mergeSeuil') {
    MergeSort.seuil = seuil;
    var hrstart = process.hrtime();
    var sortedArray = MergeSort.sort(arrayToSort);
    var hrendMilli = process.hrtime(hrstart)[1]/1000000;
  } else if(type === 'bucket') {
    BucketSort.seuil = 0;
    var hrstart = process.hrtime();
    var sortedArray = BucketSort.sort(arrayToSort);
    var hrendMilli = process.hrtime(hrstart)[1]/1000000;
  } else if(type === 'bucketSort') {
    BucketSort.seuil = seuil;
    var hrstart = process.hrtime();
    var sortedArray = BucketSort.sort(arrayToSort);
    var hrendMilli = process.hrtime(hrstart)[1]/1000000;
  }

  if(PRINT_NUMBERS) {
    console.log("-------------------------------------------------------------------------------------------");
    console.log("The sorted array:", sortedArray.join(' '));
  }

  return hrendMilli;
}


/*/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 /  The program
 /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/
var allData = [];

for (var j = 0; j < PATH.length; j++) {
  // Get the array from the file
  var array = fs.readFileSync(PATH[j]).toString().split("\n");
  array.pop();

  // Sort l'array selon seuil et l'algo
  var totalTemps = getExecutionTime(array, ARRAY_TYPE);

  if(PRINT_TIME) {
    console.log("-------------------------------------------------------------------------------------------");
    console.log("Temps d'éxécution pour est: " + totalTemps + "ms");
  }
}
