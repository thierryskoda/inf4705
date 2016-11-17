exports.sort = function(list) {
  var len = list.length,
      current;
  for ( var i = 1; i < len; i++ ) {
    current = list[i];
    for ( var j = i - 1; j > -1 && list[j] > current; j-- ) {
      list[j+1] = list[j];
    }
    list[j+1] = current;
  }
  return list;
}
