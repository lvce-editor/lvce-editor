import * as Json from '../src/parts/Json/Json.js'

test('parse', async () => {
  expect(await Json.parse('{ "x": 42 }')).toEqual({ x: 42 })
})

test('parse - syntax error', async () => {
  await expect(
    Json.parse('{ "x" 42 }', '/test/file.json')
  ).rejects.toThrowError(new Error('Json Parsing Error'))
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
