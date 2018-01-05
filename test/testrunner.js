const test = require('unit.js')
const assert = require('assert')

// basically when you require('config') is initializes from env vars so we use 'import-fresh' to reload it in different tests 
const importFresh = require('import-fresh')

// code under test
const parameters = require('../index.js').parameters

// code under test
const templates = require('../index.js').templates

describe('Learning by the example', function(){
 
  it('loads dotnetVersion from local test/parameters.yaml as 2.0-9', function(){
    const nconf = importFresh('nconf')
    const dotnetVersion = parameters(nconf, 'test').get('dotnetVersion')
    test.string(dotnetVersion).startsWith('2.0-9')
  });

  it('env var can overload dotnetVersion in parameters.yaml as 2.0-10', function(){
    process.env['dotnetVersion'] = '2.0-10'
    const nconf = importFresh('nconf')
    const dotnetVersion = parameters(nconf, 'test').get('dotnetVersion')
    test.string(dotnetVersion).startsWith('2.0-10')
  });

  it('loads rshinyVersion from local test/parameters.yaml as 2.0-9', function(){
    const nconf = importFresh('nconf')
    const whatever = parameters(nconf, 'test').get('rshinyVersion')
    test.string(whatever).startsWith('1.5.3.838')
  });

  it('loads dotnetVersions from local test/parameters.yaml', function(){
    const nconf = importFresh('nconf')
    const dotnetVersions = parameters(nconf, 'test').get('dotnetVersions')
    test.object(dotnetVersions).contains(['2.0-9','2.0-10']);
  });
 
  it('loads templates from local test/parameters.yaml', function(){
    const nconf = importFresh('nconf')
    const ts = templates(parameters(nconf, 'test'))
    test.object(ts).contains(['image-streams.json', 'build-config.yaml'])
  });
  
    

});