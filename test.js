'use strict'
const test = require('ava')
const {execSync} = require('child_process')

function eat(stdin, input = []) {
  return execSync(`echo '${stdin}' | node index.js ${input.join(` `)}`).toString('utf8')
}

test('json', t => {
  const r = eat('{"a": 1}')
  t.deepEqual(JSON.parse(r), {a: 1})
})

test('xml', t => {
  const r = eat('<?xml version="1.0" standalone="yes"?><movies><movie><title>eat</title></movie></movies>')
  t.deepEqual(JSON.parse(r), {
    _declaration: {
      _attributes: {
        standalone: 'yes',
        version: '1.0',
      },
    }, movies: {
      movie: {
        title: {
          _text: 'eat',
        },
      },
    }
  })
})

test('yaml', t => {
  const r = eat('- hello: world')
  t.deepEqual(JSON.parse(r), [{hello: 'world'}])
})

test('toml', t => {
  const r = eat('[[eat]]\nvar = true')
  t.deepEqual(JSON.parse(r), {eat: [{var: true}]})
})

test('ini', t => {
  const r = eat('var: true #comment')
  t.deepEqual(JSON.parse(r), {var: true})
})

test('file', t => {
  const r = eat('', ['.travis.yml'])
  t.is(JSON.parse(r).language, 'node_js')
})
