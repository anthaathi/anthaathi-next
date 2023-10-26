const path = require('path');
const merge = require(path.join(__dirname, '../_temp/en.json'));
const mr = require(path.join(__dirname, '../translation/mr.json'));

const fs = require('fs');

fs.writeFileSync(
  path.join(__dirname, '../translation/mr.json'),
  JSON.stringify(Object.assign(merge, mr), null, 2),
  'utf8'
);
