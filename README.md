# Eat 🧀

CLI for converting **anything** to JSON. 

**Eat** tries to apply 
parsers in the next order:

```
json
 ↪json5
   ↪toml
     ↪yaml
       ↪xml
         ↪html
           ↪ini
             ↪csv
               ↪tsv
```

## Install

```
npm i -g @medv/eat
```

## Usage

```
eat [file...]

cat config.yaml | eat
eat *.json
ls | eat
```

Use **eat** with [fx](https://github.com/antonmedv/fx):

```
cat response.xml | eat | fx .Document.Title
```

## Related

* [fx](https://github.com/antonmedv/fx) – terminal JSON viewer.

## License

[MIT](LICENSE)
