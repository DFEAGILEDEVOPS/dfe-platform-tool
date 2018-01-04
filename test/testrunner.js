const test = require('unit.js')
const assert = require('assert')

// basically when you require('config') is initializes from env vars so we use 'import-fresh' to reload it in different tests 
const importFresh = require("import-fresh")

const getDbConfig = require('../index.js')

describe('Learning by the example', function(){
 
  it('example variable', function(){
 
    // just for example of tested value 
    var example = 'hello world';
 
    test
      .string(example)
        .startsWith('hello')
        .match(/[a-z]/)
 
      .given(example = 'you are welcome')
        .string(example)
          .endsWith('welcome')
          .contains('you')
 
      .when('"example" becomes an object', function(){
 
        example = {
          message : 'hello world',
          name    : 'Nico',
          job     : 'developper',
          from    : 'France'
        };
      })
 
      .then('test the "example" object', function(){
 
        test
          .object(example)
            .hasValue('developper')
            .hasProperty('name')
            .hasProperty('from', 'France')
            .contains({message: 'hello world'})
        ;
      })
 
      .if(example = 'bad value')
        .error(function(){
          example.badMethod();
        })
    ;
 
  });
 
  it('loads default config as localhost', function(){
    const testConfig = importFresh("config")
    const dbconf = getDbConfig(testConfig);
    test.object(dbconf).hasProperty('host', 'localhost');
  });

  it('loads production config as prod-db-server', function(){
    process.env['NODE_ENV'] = "production"
    const testConfig = importFresh("config")
    const dbconf = getDbConfig(testConfig)
    test.object(dbconf).hasProperty('host', 'prod-db-server')
  });

  it('loads whatever config as whatever-db-server', function(){
    process.env['NODE_ENV'] = "whatever"
    const testConfig = importFresh("config")
    const dbconf = getDbConfig(testConfig)
    test.object(dbconf).hasProperty('host', 'whatever-db-server')
  });
 
});