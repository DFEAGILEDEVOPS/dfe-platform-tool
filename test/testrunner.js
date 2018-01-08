const test = require('unit.js')
const assert = require('assert')

// basically when you require('config') is initializes from env vars so we use 'import-fresh' to reload it in different tests 
const importFresh = require('import-fresh')

// code under test
const parameters = require('../ocd.js').parameters

// code under test
const templateParameters = require('../ocd.js').templateParameters

describe('dfe platform tooling', function(){
 
  it('loads dotnetVersion from local test/parameters.yaml as 2.0-9', function(){
    const nconf = importFresh('nconf')
    const dotnetVersion = parameters(nconf, 'test/myapp-properties.yaml').get('dotnetVersion')
    test.string(dotnetVersion).startsWith('2.0-9')
  });

  it('env var can overload dotnetVersion in parameters.yaml as 2.0-10', function(){
    process.env['dotnetVersion'] = '2.0-10'
    const nconf = importFresh('nconf')
    const dotnetVersion = parameters(nconf, 'test/myapp-properties.yaml').get('dotnetVersion')
    test.string(dotnetVersion).startsWith('2.0-10')
  });

  it('loads rshinyVersion from local test/parameters.yaml as 2.0-9', function(){
    const nconf = importFresh('nconf')
    const whatever = parameters(nconf, 'test/myapp-properties.yaml').get('rshinyVersion')
    test.string(whatever).startsWith('1.5.3.838')
  });

  it('loads dotnetVersions from local test/parameters.yaml', function(){
    const nconf = importFresh('nconf')
    const dotnetVersions = parameters(nconf, 'test/myapp-properties.yaml').get('dotnetVersions')
    test.object(dotnetVersions).contains(['2.0-9','2.0-10']);
  });
 
  it('loads template parameters from local test/parameters.yaml', function(){
    const nconf = importFresh('nconf')
    const templateParameters = parameters(nconf, 'test/myapp-properties.yaml').get('templateParameters')
    const params = templateParameters['dotnet-example.json']
    test.object(params).contains({DOTNET_IMAGE_STREAM_TAG: { desc: 'The image stream tag which is used to build the code.',
      value: 'dotnet:2.0' }})
  });

  it('handles empty parameters from local test/parameters.yaml', function(){
    const nconf = importFresh('nconf')
    const templateParameters = parameters(nconf, 'test/myapp-properties.yaml').get('templateParameters')
    const params = templateParameters['dotnet-example.json']
    test.object(params).contains({CONTEXT_DIR: { desc: 'Set this to use a subdirectory of the source code repository', value: null}})
  });
  
  it('can convert non-emptry parameters from local test/parameters.yaml into a map of param name to value', function(){
    const nconf = importFresh('nconf')
    const params = templateParameters(nconf, 'test/myapp-properties.yaml', 'dotnet-example.json')
    test.object(params).contains({DOTNET_IMAGE_STREAM_TAG: 'dotnet:2.0'})
    test.string(typeof params['CONTEXT_DIR']).isEqualTo('undefined')
  });
});