import * as JsonError from '../src/parts/JsonError/JsonError.js'

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
> 1 | { "x" 42 }
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

test('getError - unexpected comma', async () => {
  expect(
    JsonError.getError(
      `{
  "id": "builtin.language-basics-go",
  "name": "Language Basics Go",
  "description": "Provides syntax highlighting and bracket matching in Go files.",
  "languages": [
    {,
      "id": "go",
      "extensions": [".go"],
      "configuration": "./languageConfiguration.json"
    }
  ]
}
`,
      '/test/file.json'
    )
  ).toEqual({
    message: 'Json Parsing Error',
    stack: 'at /test/file.json',
    codeFrame: `
  4 |   "description": "Provides syntax highlighting and bracket matching in Go files.",
  5 |   "languages": [
> 6 |     {,
    |      ^
  7 |       "id": "go",
  8 |       "extensions": [".go"],
  9 |       "configuration": "./languageConfiguration.json"
`
      .replace(/^\n/, '')
      .replace(/\n$/, ''),
  })
})

test('getError - unterminated string', async () => {
  expect(
    JsonError.getError(
      `[
  "id
]
`,
      '/test/file.json'
    )
  ).toEqual({
    message: 'Json Parsing Error',
    stack: 'at /test/file.json',
    codeFrame: `
  1 | [
> 2 |   "id
    |      ^
  3 | ]
  4 |
`
      .replace(/^\n/, '')
      .replace(/\n$/, ''),
  })
})

test.only('getError - unexpected quote', async () => {
  expect(
    JsonError.getError(
      `[
  "id""
]
`,
      '/test/file.json'
    )
  ).toEqual({
    message: 'Json Parsing Error',
    stack: 'at /test/file.json',
    codeFrame: `
  1 | [
> 2 |   "id""
    |       ^
  3 | ]
  4 |
`
      .replace(/^\n/, '')
      .replace(/\n$/, ''),
  })
})

test('getError - empty string', async () => {
  expect(JsonError.getError(``, '/test/file.json')).toEqual({
    message: 'Json Parsing Error: Cannot parse empty string',
    stack: 'at /test/file.json',
    codeFrame: ``,
  })
})
