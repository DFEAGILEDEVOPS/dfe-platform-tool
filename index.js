
const dfe = require('./dfe.js')
const nconf = require('nconf')
const argv = require('minimist')(process.argv)

//console.dir(argv)

const template = argv.t
const properties = argv.c
const templateParameters = dfe.templateParameters
const parameters = templateParameters(nconf, properties, template)

for( const key in parameters ) {
    console.log(key+"="+parameters[key])
}
