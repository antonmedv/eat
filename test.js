import test from 'ava'
import eat, {decoders} from './index.js'

test('null', t => {
  t.is(eat(`null`), null)
})

test('bool', t => {
  t.true(eat(`true`))
  t.false(eat(`false`))
})

test('number', t => {
  t.is(eat(`42`).value, '42')
})

test('string', t => {
  t.deepEqual(eat(`"hello"`), 'hello')
})

test('json', t => {
  t.deepEqual(eat(`{"foo": "bar"}`), {foo: 'bar'})
})

test('json5', t => {
  t.deepEqual(eat(`{foo: /***/ "bar"}`), {foo: 'bar'})
})

test('toml', t => {
  t.deepEqual(eat(`[abc]\nfoo = 42`), {abc: {foo: 42}})
})

test('yaml', t => {
  t.deepEqual(eat(`norway: no`), {norway: 'no'})
})

test('xml', t => {
  t.deepEqual(eat(`<note foo="bar">hello world</note>`), {
    note: {
      _attributes: {foo: 'bar'},
      _text: 'hello world',
    },
  })
})

test('html', t => {
  t.deepEqual(eat(`<html>hello<br>world</html>`), {
    'html': {
      '_text': [
        'hello',
        'world'
      ],
      'br': {}
    }
  })
})

test('ini', t => {
  t.deepEqual(eat(`; comment
scope = global
[ini]
user = foo`), {
    ini: {
      user: 'foo',
    },
    scope: 'global',
  })
  t.false(decoders.ini.accept('hello'))
})

test('csv', t => {
  t.deepEqual(eat(`a,"b b",c\n1,2,3`), [['a', 'b b', 'c'], ['1', '2', '3']])
})

test('tsv', t => {
  t.deepEqual(eat(`a\t"b b"\tc\n1\t2\t3`), [['a', 'b b', 'c'], ['1', '2', '3']])
})

test('list', t => {
  t.deepEqual(eat(`a\nb\n`), ['a', 'b'])
})

test('text', t => {
  t.deepEqual(eat(`hello\n world`), 'hello\n world')
})
