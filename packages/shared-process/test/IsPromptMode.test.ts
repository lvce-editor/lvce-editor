import { expect, test } from '@jest/globals'
import * as IsPromptMode from '../src/parts/IsPromptMode/IsPromptMode.ts'

test('isPromptMode - separate prompt value', () => {
  expect(IsPromptMode.isPromptMode(['--prompt', 'Fix the tests'])).toBe(true)
})

test('isPromptMode - equals prompt value', () => {
  expect(IsPromptMode.isPromptMode(['--prompt=Fix the tests'])).toBe(true)
})

test('isPromptMode - absent', () => {
  expect(IsPromptMode.isPromptMode(['.'])).toBe(false)
})
