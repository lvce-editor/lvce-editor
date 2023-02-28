import * as Jsonc from '../src/parts/Jsonc/Jsonc.js'

test('parse - comment and object', () => {
  expect(
    Jsonc.parse(`// test
{}`)
  ).toEqual({})
})

test('parse - object', () => {
  expect(Jsonc.parse(`{}`)).toEqual({})
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
