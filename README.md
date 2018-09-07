
# [![Build Status](https://travis-ci.org/antonmedv/eat.svg?branch=master)](https://travis-ci.org/antonmedv/eat)

Command-line tool for converting **anything** to JSON.

## Features

* Eat everything, spits out json
* Supports **json**, **yaml**, **toml**, **xml**, **ini**
* Formatting and highlighting
* Standalone binary

## Install

```
$ npm install -g @medv/eat
```

Or download standalone binary from [releases](https://github.com/antonmedv/eat/releases) page.

## Usage

```
$ eat resp.xml > resp.json

$ cat config.yaml | eat > config.json

$ eat deps.toml
```

### Other examples

Use it with [fx](https://github.com/antonmedv/fx) tool for extracting needed fields.

```
$ cat response.xml | eat | fx .Document.Title
```

## Related

* [fx](https://github.com/antonmedv/fx) – cli JSON processor on JS
* [any-json](https://github.com/any-json/any-json) - alternative cli tool for converting formats

## License

MIT
