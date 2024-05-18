import { expect, test } from '@jest/globals'
import * as Character from '../src/parts/Character/Character.ts'

test('Backslash', () => {
  expect(Character.Backslash).toBe('\\')
})



test('Slash', () => {
  expect(Character.Slash).toBe('/')
})
