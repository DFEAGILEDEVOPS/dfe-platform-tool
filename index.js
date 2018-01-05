
// dependency inject config so that evn var overrides can be tested in the real app use `var config = require('nconf');`
function parameters(nconf, folder = '.') {
    nconf.argv()
      .env()
      .file({ file: folder + '/parameters.yaml', format: require('nconf-yaml') });
  return nconf;
}

const templates = ['image-streams.json', 'build-config.yaml']

module.exports['parameters'] = parameters;
