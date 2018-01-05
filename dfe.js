
/**
 * Parameters are loaded by argv, then env, then parameters.yaml. This allows overrides to be supplied by argv and env. It also ensures that if a developer commits a platform property to the parameters file that is supplied by env then it will be safely ignored. This means that the platform can impose the SDK version. 
 * 
 * @param {*} nconf dependency inject config so that evn var overrides can be tested in the real app use `const config = require('nconf')`
 * @param string folder contain parameters.yaml. defaults to '.'
 */
function parameters(nconf, folder = '.') {
    nconf.argv()
      .env()
      .file({ file: folder + '/parameters.yaml', format: require('nconf-yaml') });
  return nconf;
}

// const fs = require('fs')
// const _ = require('lodash')

// function loadTemplates(parameters) {
//   _.forEach(parameters.get('templates'), function(tmplt){
//     const content = fs.readFileSync(tmplt)
//     if( tmplt.endsWith('json')){
//       console.log('tmplt ends with json')
//     } else if( tmplt.endsWith('yaml')){
//       console.log('tmplt ends with yaml')
//     } else throw 'unrecognised file extension on file: '+tmplt
//   } );
// }

module.exports['parameters'] = parameters

