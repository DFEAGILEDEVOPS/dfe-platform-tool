var Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const path = require('path');
const mkdirp = require('mkdirp');
const jsonTransform = require('gulp-json-transform');
const filter = require('gulp-filter');
const beautify = require('gulp-beautify');

const jsonFilter = filter(['**/*.json'], { restore: true });

function makeGeneratorName(name) {
  name = _.kebabCase(name);
  return name;
}

module.exports = class extends Generator {

  _private_scmsecret() {
    return this.options.scmsecret || false
  }

  // The name `constructor` is important here
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('appname', { type: String, required: true });

    // And you can then access it later; e.g.
    this.log(this.options.appname);

    // This makes `appname` a required argument.
    this.argument('framework', { type: String, required: true });

    // And you can then access it later; e.g.
    this.log(this.options.framework);
    
    // whether to include the or delete the scmsecret sedtion of the template
    this.option('scmsecret');

    const self = this;

    // this pipe will match only jsonFilter and parse them ignoring others
    this.registerTransformStream(
      [
        jsonFilter,
        jsonTransform(function(data, file) {
          // if we there is to be no scmsecret to access the repo
          if( !self._private_scmsecret() ){
            // iterate over the template objects looking for BuildConfig and delete spec.source.sourceSecret
            data.objects.forEach(function (o){
              if( o.kind === "BuildConfig") {
                if( typeof o.spec.source.sourceSecret !== "undefined" ){
                  delete o.spec.source.sourceSecret
                }
              }
            })
            return data
          }
          else return data
        }),
        beautify({indent_size: 2 }),
        jsonFilter.restore
      ]
    );
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.options.appname) {
      this.log(
        'Your generator must be inside a folder named ' + this.options.appname + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.options.appname);
      this.destinationRoot(this.destinationPath(this.options.appname));
    }
  }

  writing() {
    this.fs.copy(
      this.templatePath('dotnet-pgsql.json'),
      this.destinationPath('dotnet-pgsql.json')
    );
    this.fs.copy(
      this.templatePath('name-properties.yaml'),
      this.destinationPath(this.options.appname+'-properties.yaml')
    );
  }
};