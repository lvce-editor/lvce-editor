import { expect, test } from '@jest/globals'
import * as Character from '../src/parts/Character/Character.ts'

test('Backslash', () => {
  expect(Character.Backslash).toBe('\\')
})

test('EmptyString', () => {
  expect(Character.EmptyString).toBe('')
})

test('NewLine', () => {
  expect(Character.NewLine).toBe('\n')
})

test('Slash', () => {
  expect(Character.Slash).toBe('/')
})
