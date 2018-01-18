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

  _private_doRealWork() {
    return !this.options.dryrun
  }

  // The name `constructor` is important here
  constructor(args, opts) {

    super(args, opts);

    // `appname` a required argument.
    this.argument('appname', { type: String, required: true, desc: "The name of app which is used in BuilConf, Service, Pods." });

    // `framework` a required argument.
    this.argument('framework', { type: String, required: true, desc: "The framework. Currently ignored as we only have a single dotnet template today. More to come. " } );

    // `giturl` a required argument.
    this.argument('gitrepo', { type: String, desc: "The git repo uri to use in the BuildConfig.", default: "https://github.com/redhat-developer/s2i-dotnetcore-ex.git" } );

    // whether to run or logout what would have been done
    this.option('dryrun', { desc: "To nothing but log an indication of what you would have done."});

    // whether to include the or delete the scmsecret sedtion of the template
    this.option('scmsecret', { desc: "Private GitHub repo so add 'scmsecret' to Git section of the BuildConfig."});

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

    this.log("dryrun: "+this.options.dryrun)

    // And you can then access it later; e.g.
    this.log("appname: "+this.options.appname)
    this.log("framework: "+this.options.framework)
    this.log("gitrepo: "+this.options.gitrepo)
    this.log("scmsecret: "+this.options.scmsecret)

    if (this._private_doRealWork() && path.basename(this.destinationPath()) !== this.options.appname) {
      this.log(
        'Your generator must be inside a folder named ' + this.options.appname + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.options.appname);
      this.destinationRoot(this.destinationPath(this.options.appname));
    }
  }

  writing() {
    if( this._private_doRealWork() ){
      this.fs.copy(
        this.templatePath('dotnet-pgsql.json'),
        this.destinationPath('dotnet-pgsql.json')
      );
      this.fs.copy(
        this.templatePath('dotnet-dbaas.json'),
        this.destinationPath('dotnet-dbaas.json')
      );
      this.fs.copyTpl(
        this.templatePath('name-properties.yaml'),
        this.destinationPath(this.options.appname+'-properties.yaml'),
          { gitrepo: this.options.gitrepo }
      );
      this.fs.copyTpl(
        this.templatePath('name-secret.yaml'),
        this.destinationPath(this.options.appname+'-secret.yaml'),
          { gitrepo: this.options.gitrepo }
      );
    }
  }
};