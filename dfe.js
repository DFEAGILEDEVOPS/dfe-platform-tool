
const _ = require('lodash')

/**
 * Parameters are loaded by argv, then env, then parameters.yaml. This allows overrides to be supplied by argv and env. It also ensures that if a developer commits a platform property to the parameters file that is supplied by env then it will be safely ignored. This means that the platform can impose the SDK version. 
 * 
 * @param {*} nconf dependency inject config so that evn var overrides can be tested in the real app use `const config = require('nconf')`
 * @param string propertiesFilePath contain parameters.yaml. defaults to '.'
 */
function parameters(nconf, propertiesFilePath) {
    nconf.argv()
      .env()
      .file({ file: propertiesFilePath, format: require('nconf-yaml') });
  return nconf;
}

module.exports['parameters'] = parameters

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


