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

test.only('parse - syntax error', async () => {
  expect(Json.getError('{ "x" 42 }', '/test/file.json')).toEqual({
    message: ``,
    codeFrame: ``,
    stack: ``,
  })
})

test.skip('parse - unexpected end of json', async () => {
  await expect(Json.parse('[', '/test/file.json')).rejects.toThrowError(
    /^Unexpected end of JSON input while parsing/
  )
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
