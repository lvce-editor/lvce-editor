import * as InputDeleteCharacterLeft from '../src/parts/InputDeleteCharacterLeft/InputDeleteCharacterLeft.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('deleteCharacterLeft - empty string', () => {
  expect(InputDeleteCharacterLeft.deleteCharacterLeft('', 0)).toEqual({
    newValue: '',
    newCursorOffset: 0,
  })
})

test('deleteCharacterLeft', () => {
  expect(InputDeleteCharacterLeft.deleteCharacterLeft('abc', 3)).toEqual({
    newValue: 'ab',
    newCursorOffset: 2,
  })
})
