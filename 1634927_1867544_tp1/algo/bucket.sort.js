// SOURCE
// http://www.growingwiththeweb.com/2015/06/bucket-sort.html

'use strict';
var InsertionSort = require('./insertion.sort');
exports.seuil = 1;


/**
 * Sorts an array using bucket sort.
 * @param {number[]} array The array to sort.
 * @param {number} [bucketSize=5] The number of values a bucket can hold.
 * @returns The sorted array.
 */
exports.sort = function(array, bucketSize) {
  if (array.length === 0) {
    return array;
  }

  // Determine minimum and maximum values
  var i;
  var minValue = array[0];
  var maxValue = array[0];
  for (i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
    } else if (array[i] > maxValue) {
      maxValue = array[i];
    }
  }

  // Initialise buckets
  var DEFAULT_BUCKET_SIZE = 10;
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
  var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  var buckets = new Array(bucketCount);
  for (i = 0; i < buckets.length; i++) {
    buckets[i] = [];
  }
  // Distribute input array values into buckets
  for (i = 0; i < array.length; i++) {
    buckets[Math.floor((array[i] - minValue) / bucketSize)].push(array[i]);
  }

  // Sort buckets and place back into input array
  array.length = 0;
  for (i = 0; i < buckets.length; i++) {

    if(buckets[i].length < exports.seuil || buckets.length === 1) {
      InsertionSort.sort(buckets[i]);
    } else if(buckets.length !== 1) {
      exports.sort(buckets[i]);
    }

    for (var j = 0; j < buckets[i].length; j++) {
      array.push(buckets[i][j]);
    }
  }

  return array;
}
