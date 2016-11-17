var InsertionSort = require('./insertion.sort');
exports.seuil = 1;

/**
 * Sorts the array by breaking it down
 * into smaller chunks.
 *
 * @param {Array} array The array to sort
 */
exports.sort = function(array) {
  return sort(array);
}

function sort(array) {
  var length = array.length,
  mid    = Math.floor(length * 0.5),
  left   = array.slice(0, mid),
  right  = array.slice(mid, length);

  if(length === 1) {
    return array;
  }

  // If size of array is smaller and the 'exports.seuil' we gave in input, lets use insertion sort instead
  if(left.length < exports.seuil) {
    return InsertionSort.sort(left);
  }
  if(right.length < exports.seuil) {
    return InsertionSort.sort(right);
  }

  return merge(sort(left), sort(right));
}


/**
 * Merges two sublists back together.
 * Shift either left or right onto
 * the result depending on which is
 * lower (assuming both exist), and simply
 * pushes on a list if the other doesn't
 * exist.
 *
 * @param {Array} left The left hand sublist
 * @param {Array} right The right hand sublist
 */
 function merge(left, right) {
  var result = [];
  while(left.length || right.length) {
    if(left.length && right.length) {
      if(left[0] < right[0]) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    } else if (left.length) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result;
}



/**
 * [sortV2 description]
 * @param {[type]} array [description]
 */
 exports.sortV2 = function(array, seuil) {
  return sortV2(array, seuil);
}

function sortV2(array, seuil) {
  if (array.length > 1) {
    return mergeV2(sortV2(array.slice(0, Math.ceil(array.length/2))),
      sortV2(array.slice(Math.ceil(array.length/2), array.length)), []);
  } else {
    return array;
  }
};

function mergeV2(left, right, array) {
  if (left.length == 0 && right.length == 0) {
    return array;
  } else if (left.length == 0) {
    return array.concat(right);
  } else if (right.length == 0) {
    return array.concat(left);
  } else if (left[0] < right[0]) {
    array.push(left.shift());
  } else {
    array.push(right.shift());
  }
  return mergeV2(left, right, array);
};





// https://github.com/nzakas/computer-science-in-javascript/tree/master/algorithms/sorting/merge-sort-recursive
/*
 * Recursive merge sort implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 exports.sortV3 = function(array) {
   return mergeSort(array);
 }

/**
* Merges two arrays in order based on their natural
* relationship.
* @param {Array} left The first array to merge.
* @param {Array} right The second array to merge.
* @return {Array} The merged array.
*/
function mergeV3(left, right){
  var result  = [],
  il      = 0,
  ir      = 0;

  while (il < left.length && ir < right.length){
    if (left[il] < right[ir]){
      result.push(left[il++]);
    } else {
      result.push(right[ir++]);
    }
  }

  return result.concat(left.slice(il)).concat(right.slice(ir));
}

/**
* Sorts an array in ascending natural order using
* merge sort.
* @param {Array} items The array to sort.
* @return {Array} The sorted array.
*/
function mergeSort(items){

  if (items.length < 2) {
    return items;
  }

  // Use insertion sort if the array length is less than the seuil instead of always doing recursive
  if(items.length < exports.seuil) {
    return InsertionSort.sort(items);
  }

  var middle = Math.floor(items.length / 2),
  left    = items.slice(0, middle),
  right   = items.slice(middle);

  return mergeV3(mergeSort(left), mergeSort(right));
}


