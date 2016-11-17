/**
 * Function to shuffle the array
 */
module.exports.shuffle = function(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

module.exports.exportToCsv = function (fileName, data, FIELDS) {
  var result = json2csv({
    data: data,
    FIELDS: FIELDS
  });

  fs.writeFile('results/' + fileName, result, function(err) {
    if (err) throw err;
    console.log(fileName + " file created");
  });
}
