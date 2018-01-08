# Dfe Platform Tool

A simple tool for managing common tasks on the dfe digital platform. 

To use the tool you intall it as an npm dev dependency: 

```sh
npm i dfe-platform-tool --save-dev
```

Then you add your oc template such as `dotnet-pgsql.json` to your repo and a corresponding `myapp-properties.yaml` to populate the template. Next you create commands in your `package.json` to run the tool such as: 

```javascript
"scripts": {
    "ocd-create-dotnet-pgsql": "ocd parameters -t dotnet-pgsql.json -c search-and-compare-properties.yaml | oc process -f dotnet-pgsql.json --param-file=- |  oc create -f -"
  }
```

See the [wiki](https://github.com/DFEAGILEDEVOPS/dfe-platform-tool/wiki) for more information. 
