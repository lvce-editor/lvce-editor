import * as Jsonc from '../src/parts/Jsonc/Jsonc.js'

test('parse - line comment and object', () => {
  expect(
    Jsonc.parse(`// test
{}`)
  ).toEqual({})
})

test('parse - block comment and object', () => {
  expect(
    Jsonc.parse(`/* test */
{}`)
  ).toEqual({})
})

test('parse - object', () => {
  expect(Jsonc.parse(`{}`)).toEqual({})
})

test('parse - line comment inside object', () => {
  expect(
    Jsonc.parse(`{
  // test
}`)
  ).toEqual({})
})

test('parse - line comment inside array', () => {
  expect(
    Jsonc.parse(`[
  // test
]`)
  ).toEqual([])
})

test('parse - array', () => {
  expect(Jsonc.parse(`[]`)).toEqual([])
})

test('parse - number', () => {
  expect(Jsonc.parse(`1`)).toBe(1)
})

test('parse - string', () => {
  expect(Jsonc.parse(`"test"`)).toBe('test')
})

test('parse - object inside array', () => {
  expect(Jsonc.parse(`[{}]`)).toEqual([{}])
})

test('parse - array inside array', () => {
  expect(Jsonc.parse(`[[]]`)).toEqual([[]])
})

test('parse - string inside array', () => {
  expect(Jsonc.parse(`[""]`)).toEqual([''])
})

test('parse - multiple numbers inside array', () => {
  expect(Jsonc.parse(`[1,2,3]`)).toEqual([1, 2, 3])
})

test('parse - object with multiple properties', () => {
  expect(
    Jsonc.parse(`{
  "a": 1,
  "b": 2
}`)
  ).toEqual({ a: 1, b: 2 })
})

test('parse - object with array and other property', () => {
  expect(
    Jsonc.parse(`{
  "config": [
    {
      "name": "test"
    }
  ],
  "key": "value"
}`)
  ).toEqual({
    config: [
      {
        name: 'test',
      },
    ],
    key: 'value',
  })
})

test('parse - boolean - true', () => {
  expect(Jsonc.parse(`true`)).toEqual(true)
})

test('parse - boolean - false', () => {
  expect(Jsonc.parse(`false`)).toEqual(false)
})

test('parse - null', () => {
  expect(Jsonc.parse(`null`)).toEqual(null)
})

test.skip('parse - object with multiple properties and trailing comma', () => {
  expect(
    Jsonc.parse(`{
  "a": 1,
  "b": 2,
}`)
  ).toEqual({ a: 1, b: 2 })
})

test('parse - boolean property value', () => {
  expect(
    Jsonc.parse(`{
  "enabled": true
}`)
  ).toEqual({ enabled: true })
})
