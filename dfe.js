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

function templateParametersValues(templateParameters) {

}

module.exports['parameters'] = parameters

