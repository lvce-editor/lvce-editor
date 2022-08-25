import * as JsonError from '../src/parts/JsonError/JsonError.js'

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

test('getError - syntax error', async () => {
  expect(JsonError.getError('{ "x" 42 }', '/test/file.json')).toEqual({
    message: `Json Parsing Error`,
    stack: `at /test/file.json`,
    codeFrame: `
> 1 | { \"x\" 42 }
    |       ^
`.trim(),
  })
})

test('getError - unexpected end of json', async () => {
  expect(JsonError.getError('[', '/test/file.json')).toEqual({
    message: 'Json Parsing Error',
    stack: 'at /test/file.json',
    codeFrame: `
> 1 | [
    | ^
`.trim(),
  })
})
