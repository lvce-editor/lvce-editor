import { expect, test } from '@jest/globals'
import * as IsPatternInWord from '../src/parts/IsPatternInWord/IsPatternInWord.js'

test('isPatternInWord - path', () => {
  const word = '/test/folder-1/folder-2/folder-3/folder-4/folder-5/content'
  const pattern = 'con'
  const patternLower = pattern.toLowerCase()
  const wordLower = word.toLowerCase()
  const patternLength = pattern.length
  const wordLength = word.length
  expect(IsPatternInWord.isPatternInWord(patternLower, 0, patternLength, wordLower, 0, wordLength)).toBe(true)
})
