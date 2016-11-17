var json2csv = require('json2csv');
var fs = require('fs');

module.exports.exportToCsv = function(fileName, data, FIELDS) {
  var result = json2csv({
    data: data,
    FIELDS: FIELDS
  });

  fs.writeFile('results/' + fileName, result, function(err) {
    if (err) throw err;
    console.log(fileName + " file created");
  });
}
