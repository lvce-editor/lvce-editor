import * as Json from '../src/parts/Json/Json.js'

const emptyError = {
  message: '',
  stack: '',
  codeFrame: '',
}

test('parse', async () => {
  expect(await Json.parse('{ "x": 42 }')).toEqual({ x: 42 })
})

const createError = (string) => {
  try {
    JSON.parse(string)
  } catch (error) {
    return error
  }
}

// TODO test unexpected token ,
// TODO test unexpected token ]
// TODO test unexpected token {
// TODO test unexpected token }
// TODO test unexpected token "
// TODO test unexpected token '
// TODO test unexpected number
// TODO test unexpected boolean
// TODO test unexpected string
// TODO test unexpected array
// TODO test unexpected object

test.skip('parse - syntax error', async () => {
  expect(Json.parse('{ "x" 42 }', '/test/file.json')).toEqual({
    message: `Json Parsing Error`,
    stack: `at /test/file.json`,
    codeFrame: `
> 1 | { \"x\" 42 }
    |       ^
`.trim(),
  })
})

test.skip('parse - unexpected end of json', async () => {
  expect(Json.getErrorProp('[', '/test/file.json')).toEqual({
    message: 'Json Parsing Error',
    stack: 'at /test/file.json',
    codeFrame: `
> 1 | [
    | ^
`.trim(),
  })
})

test.skip('stringify', () => {
  expect(Json.stringify({ x: 42 })).toBe(`{
  "x": 42
}
`)
})

test.skip('stringify - invalid parameter', () => {
  expect(Json.stringify(Symbol('a'))).toBe(`undefined
`)
})
