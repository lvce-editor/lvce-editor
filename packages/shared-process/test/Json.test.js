import * as Json from '../src/parts/Json/Json.js'

test('parse', async () => {
  expect(await Json.parse('{ "x": 42 }')).toEqual({ x: 42 })
})

test.only('parse - syntax error', async () => {
  await expect(
    Json.parse('{ "x" 42 }', '/test/file.json')
  ).rejects.toThrowError(
    /^Unexpected number in JSON at position 6 while parsingdewde/
  )
})

test('parse - unexpected end of json', async () => {
  await expect(Json.parse('[', '/test/file.json')).rejects.toThrowError(
    /^Unexpected end of JSON input while parsing/
  )
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
