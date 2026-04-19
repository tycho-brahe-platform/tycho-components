const fs = require('fs');
const packageJson = require('../package.json');

const minimal = {
  name: packageJson.name,
  version: packageJson.version,
  main: 'index.js',
  types: 'index.d.ts',
};

fs.writeFileSync(
  require('path').join(__dirname, '../dist/package.json'),
  JSON.stringify(minimal, null, 2)
);
