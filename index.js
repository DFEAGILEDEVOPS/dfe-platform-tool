
// dependency inject config so that it can be mocked in the real app use var config = require('nconf');
function parameters(nconf) {
      nconf.argv()
        .env()
        .file({ file: 'test/parameters.yaml', format: require('nconf-yaml') });
  return nconf;
}

module.exports = parameters;
