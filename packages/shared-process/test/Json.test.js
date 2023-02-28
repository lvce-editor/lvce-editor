import * as Json from '../src/parts/Json/Json.js'
import { JsonParsingError } from '../src/parts/JsonParsingError/JsonParsingError.js'

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} promise
 * @returns {Promise<Error>}
 *  */
const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

test('parse', async () => {
  expect(await Json.parse('{ "x": 42 }')).toEqual({ x: 42 })
})

test('parse - syntax error', async () => {
  const error = await getError(Json.parse('{ "x" 42 }', '/test/file.json'))
  expect(error).toBeInstanceOf(JsonParsingError)
  expect(error.message).toBe(`Json Parsing Error`)
  // @ts-ignore
  expect(error.codeFrame).toBe(`> 1 | { \"x\" 42 }
    |       ^`)
  expect(error.toString()).toBe(`JsonParsingError: Json Parsing Error`)
  expect(error.stack).toBe(`JsonParsingError: Json Parsing Error
    at /test/file.json`)
})

test('stringify', () => {
  expect(Json.stringify({ x: 42 })).toBe(`{
  "x": 42
}
`)
})

test('stringify - invalid parameter', () => {
  expect(Json.stringify(Symbol('a'))).toBe(`undefined
`)
})
