# Dfe Platform Tool

A simple tool for managing common tasks on the dfe digital platform.

```sh
# dump put the template prams
oc process --parameters -f test/dotnet-example.json | sed $'s/   */\t/g' |  awk -F'\t' -v OFS="\t" 'NR>1{print
 "-\n param: " $1  "\n  desc: " $2 "\n default: " $3;}'
```