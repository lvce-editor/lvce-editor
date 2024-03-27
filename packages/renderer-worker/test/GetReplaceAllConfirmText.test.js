import * as GetReplaceAllConfirmText from '../src/parts/GetReplaceAllConfirmText/GetReplaceAllConfirmText.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getReplaceAllConfirmText - 1 1 0', () => {
  const occurrences = 1
  const fileCount = 1
  const replaceValue = ''
  expect(GetReplaceAllConfirmText.getReplaceAllConfirmText(occurrences, fileCount, replaceValue)).toBe('Replace 1 occurrence across 1 file')
})

test('getReplaceAllConfirmText - 1 1 1', () => {
  const occurrences = 1
  const fileCount = 1
  const replaceValue = 'a'
  expect(GetReplaceAllConfirmText.getReplaceAllConfirmText(occurrences, fileCount, replaceValue)).toBe("Replace 1 occurrence across 1 file with 'a'")
})

test('getReplaceAllConfirmText - 2 1 0', () => {
  const occurrences = 2
  const fileCount = 1
  const replaceValue = ''
  expect(GetReplaceAllConfirmText.getReplaceAllConfirmText(occurrences, fileCount, replaceValue)).toBe('Replace 2 occurrences across 1 file')
})

test('getReplaceAllConfirmText - 2 1 1', () => {
  const occurrences = 2
  const fileCount = 1
  const replaceValue = 'a'
  expect(GetReplaceAllConfirmText.getReplaceAllConfirmText(occurrences, fileCount, replaceValue)).toBe("Replace 2 occurrences across 1 file with 'a'")
})

test('getReplaceAllConfirmText - 2 2 0', () => {
  const occurrences = 2
  const fileCount = 2
  const replaceValue = ''
  expect(GetReplaceAllConfirmText.getReplaceAllConfirmText(occurrences, fileCount, replaceValue)).toBe('Replace 2 occurrences across 2 files')
})

test('getReplaceAllConfirmText - 2 2 1', () => {
  const occurrences = 2
  const fileCount = 2
  const replaceValue = 'a'
  expect(GetReplaceAllConfirmText.getReplaceAllConfirmText(occurrences, fileCount, replaceValue)).toBe(
    "Replace 2 occurrences across 2 files with 'a'",
  )
})
