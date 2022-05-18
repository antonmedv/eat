import JSON from 'lossless-json'
import JSON5 from 'json5'
import TOML from '@iarna/toml'
import YAML from 'yaml'
import XML from 'xml-js'
import {parseDocument} from 'htmlparser2'
import {render as renderHTML} from 'dom-serializer'
import INI from 'ini'
import CSV from './csv.js'

const decoders = {
  json: x => JSON.parse(x),
  json5: x => JSON5.parse(x),
  toml: x => TOML.parse(x),
  yaml: x => {
    let y = YAML.parse(x)
    if (typeof y === 'string') {
      throw 'ಠ_ಠ'
    }
    return y
  },
  xml: (x, options) => XML.xml2js(x, {compact: true, ...options}),
  html: (x, options) => {
    let dom = parseDocument(x)
    let xml = renderHTML(dom, {xmlMode: true})
    return XML.xml2js(xml, {compact: true, ...options})
  },
  ini: x => {
    if (!/^\[.+?]/m.test(x)) {
      throw 'ಠ_ಠ'
    }
    return INI.parse(x)
  },
  csv: (x, options) => {
    options = {delimiter: ',', ...options}
    if (!x.includes(options.delimiter)) {
      throw 'ಠ_ಠ'
    }
    let lines = x.split(/\n|\r\n/)
    let cols = lines[0].split(options.delimiter).length
    for (let line of lines) {
      if (line.split(options.delimiter).length !== cols) {
        throw 'ಠ_ಠ'
      }
    }
    return CSV.parse(x, options)
  },
  text: x => x,
}

export default function eat(apple, options = {}) {
  for (let [kind, parse] of Object.entries(decoders)) {
    try {
      return parse(apple, options)
    } catch (e) {
      // ᕕ(ᐛ)ᕗ
    }
  }
  throw 'unknown format'
}
