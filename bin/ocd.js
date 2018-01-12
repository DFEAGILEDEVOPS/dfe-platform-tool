#! /usr/bin/env node

// the main library of this tool
const ocd = require('../ocd-lib.js')
// a config library that does overrides  
const nconf = require('nconf')
// a command line parse. when running "npm run_script" the first two process.argv are "../bin/node" and "index.js" which we drop
const argv = require('minimist')(process.argv.slice(2,process.argv.length))

// command line args that down start with '_' are collected into an array called '_' so we inspect at the first one
const command = argv._[0]

switch(command) {
    /* Read the parameters yaml file and spit them out in a format that can be consumed with oc.
     * Overrides anything in the yaml file if there is an env var with the same name. 
     * This allows the platform to set some env var parameters. */
    case "parameters":
        const template = argv.t
        const properties = argv.c
        const templateParameters = ocd.templateParameters
        const parameters = templateParameters(nconf, properties, template)

        for( const key in parameters ) {
            console.log(key+"="+parameters[key])
        }
        break;
    /* Loads a private ssh key into an oc secret as `scmsecret` so that private repos can be built. */
    case "scmsecret":
        const sshprivatekey = argv._[1]
        if( sshprivatekey.startsWith('ssh-privatekey=') ) {
            // https://blog.openshift.com/using-ssh-key-for-s2i-builds/gi
            console.log("oc secrets new scmsecret "+sshprivatekey)
            console.log("oc secrets link builder scmsecret")
        } else {
            const msg = "ERROR the second paramaeter should start ssh-privatekey="
            console.error(msg)
            throw new Error("Invalid arguments. "+msg)
        }
        break;
    /* Creates a new project and adds collaborators  */
    case "new-project": 
        const name = argv._[1]
        console.log("oc new-project "+name)
        const collaborators = argv._.slice(2, argv._.length)
        collaborators.forEach(function(element) {
            console.log("oc policy add-role-to-user admin "+element)
        }, this);
        break;
    default:
        throw new Error("Unrecognised command: "+command);
}

    
