#! /usr/bin/env node

// the main library of this tool
const dfe = require('../ocd.js')
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
        const templateParameters = dfe.templateParameters
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
    /* prmotes a particular tagged build from one oc project to another */
    case "promote": 
        console.log("promote: "+argv._)

        break;
    default:
        throw new Error("Unrecognised command: "+command);
}

    
