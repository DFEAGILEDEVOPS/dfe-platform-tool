const test = require('unit.js')
const assert = require('assert')

// basically when you require('config') is initializes from env vars so we use 'import-fresh' to reload it in different tests 
const importFresh = require("import-fresh")

// code under test
const parameters = require('../index.js').parameters

describe('Learning by the example', function(){
 
  it('loads dotnetVersion from local test/parameters.yaml as 2.0-9', function(){
    const nconf = importFresh("nconf")
    const dotnetVersion = parameters(nconf, 'test').get("dotnetVersion")
    test.string(dotnetVersion).startsWith('2.0-9')
  });

  it('env var can overload dotnetVersion as 2.0-9', function(){
    process.env['dotnetVersion'] = "2.0-10"
    const nconf = importFresh("nconf")
    const dotnetVersion = parameters(nconf, 'test').get("dotnetVersion")
    test.string(dotnetVersion).startsWith('2.0-10')
  });
 
});