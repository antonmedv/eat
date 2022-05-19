import JSON from 'lossless-json'
import JSON5 from 'json5'
import TOML from '@iarna/toml'
import YAML from 'yaml'
import XML from 'xml-js'
import {parseDocument} from 'htmlparser2'
import {render as renderHTML} from 'dom-serializer'
import INI from 'ini'
import CSV from './csv.js'

export const decoders = {
  json: {
    accept: everything,
    parse: x => JSON.parse(x)
  },
  json5: {
    accept: everything,
    parse: x => JSON5.parse(x),
  },
  toml: {
    accept: everything,
    parse: x => TOML.parse(x),
  },
  yaml: {
    accept: everything,
    parse: x => {
      let y = YAML.parse(x)
      if (typeof y === 'string') throw 'ಠ_ಠ'
      return y
    },
  },
  xml: {
    accept: everything,
    parse: x => XML.xml2js(x, {compact: true}),
  },
  html: {
    accept: everything,
    parse: x => {
      let dom = parseDocument(x)
      let xml = renderHTML(dom, {xmlMode: true})
      return XML.xml2js(xml, {compact: true})
    },
  },
  ini: {
    accept: x => /^.+=.+$/m.test(x),
    parse: x => {
      let y = INI.parse(x)
      if (typeof y !== 'object') throw 'ಠ_ಠ'
      if (Object.keys(y).some(key => key.includes(' '))) throw 'ಠ_ಠ'
      return y
    },
  },
  csv: {
    accept: x => x.split('\n').every(line => line.includes(',')),
    parse: x => CSV.parse(x, ','),
  },
  tsv: {
    accept: x => x.split('\n').every(line => line.includes('\t')),
    parse: x => CSV.parse(x, '\t'),
  },
  list: {
    accept: x => x.trim().split('\n').every(line => /^[^\s].*$/m.test(line)),
    parse: x => x.trim().split('\n'),
  },
  text: {
    accept: everything,
    parse: x => x,
  },
}

export default function eat(apple) {
  for (let {accept, parse} of Object.values(decoders)) {
    try {
      if (accept(apple)) return parse(apple)
    } catch (e) {
      // ᕕ(ᐛ)ᕗ
    }
  }
  throw 'unknown format'
}

function everything() {
  return true
}
