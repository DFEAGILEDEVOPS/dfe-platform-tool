
const _ = require('lodash')

/**
 * Parameters are loaded by argv, then env, then app-properties.yaml. This allows overrides to be supplied by argv and env. It also ensures that if a developer commits a platform property to the parameters file that is supplied by env then it will be safely ignored. This means that the platform can impose the SDK version. 
 * 
 * @param {*} nconf Dependency injected config e.g. `const config = require('nconf')`
 * @param string propertiesFilePath properties yaml file e.g. `myapp-properties.yaml`
 */
function parameters(nconf, propertiesFilePath) {
    nconf.argv()
      .env()
      .file({ file: propertiesFilePath, format: require('nconf-yaml') });
  return nconf;
}

module.exports['parameters'] = parameters

/**
 * Parameters are loaded by argv, then env, then the passed yaml file. This function 
 * 
 * @param {*} nconf Dependency injected config e.g. `const config = require('nconf')`
 * @param string propertiesFilePath properties yaml file e.g. `myapp-properties.yaml`
 * @param string template the name of the template to extract the properties values such as e.g. `dotnet-example.json
 * @return An object with keys that are the template parameter names and the values the given values e.g. `{ BLAH: "3.2.1" }`
 */
function templateParameters(nconf, propertiesFilePath, template) {
  const params = parameters(nconf, propertiesFilePath).get('templateParameters')[template]
  const keys = _.keys(params)
  const values = _.values(params).map( (v) => {
    const {desc, value} = v
    return value
  })

  const filteredZip = _.filter(_.zip(keys,values), function(pair) { 
    const [k,v] = pair
    return v !== null
  })

  const result = _.reduce(filteredZip, function(result,pair){
    const [key,value] = pair
    result[key] = value
    return result
  }, {})

  return result
}

module.exports['templateParameters'] = templateParameters

const compileTemplate = require("string-template/compile")