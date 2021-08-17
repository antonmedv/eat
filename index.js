#!/usr/bin/env node
'use strict'
const fs = require('fs')
const meow = require('meow')
const pretty = require('@medv/prettyjson')
const stdin = require('get-stdin')

const cli = meow(`
  Usage
    $ eat [file ...]

  Examples
    $ eat resp.xml > resp.json

    $ cat config.yaml | eat > config.json

    $ eat deps.toml

`)

async function main() {
  const text = await stdin()
  if (text === '' && cli.input.length === 0) {
    cli.showHelp()
  }

  const apples = [...cli.input.map(file => fs.readFileSync(file).toString())]
  if (text.replace(/\s+$/g, '') !== '') {
    apples.unshift(text)
  }

  let oranges = apples.map(decode)
  if (oranges.length === 1) {
    oranges = oranges[0]
  }

  if (process.stdout.isTTY) {
    console.log(pretty(oranges))
  } else {
    console.log(JSON.stringify(oranges, null, 2))
  }
}

const decoders = [
  decodeJSON,
  decodeXML,
  decodeYAML,
  decodeTOML,
  decodeINI,
  decodeCLITable,
]

function decodeJSON(text) {
  return JSON.parse(text)
}

function decodeXML(text) {
  return require('xml-js').xml2js(text, {compact: true})
}

function decodeYAML(text) {
  const obj = require('js-yaml').safeLoad(text)
  if (typeof obj === 'string') {
    throw new Error('👎')
  }
  return obj
}

function decodeTOML(text) {
  return require('toml').parse(text)
}

function decodeINI(text) {
  if (!/^\[.*\]$/.test(text)) throw 'not ini'

  return  require('ini').parse(text)
}

function decodeCLITable(text) {
  const [header, ...data] = text.replace(/\n$/,'m').split('\n').map(x => x.split(/\s+/))
  return data.map(line => line.reduce((a, v, i) => { if (v || header[i]) a[header[i]] = v; return a }, {}))
}

function decode(text) {
  for (let decoder of decoders) {
    try {
      return decoder(text)
    } catch (e) {
    }
  }
}

main()
