# Dfe Platform Tool

A simple tool for managing common tasks on the dfe digital platform. 

See the [wiki](https://github.com/DFEAGILEDEVOPS/dfe-platform-tool/wiki) for more information. 

To create the simple dotnet-example.json try: 

```sh
npm run-script dfe -- -t dotnet-example.json -c test/myapp-properties.yaml | oc process -f test/dotnet-example
.json --param-file=- |  oc create -f -
```