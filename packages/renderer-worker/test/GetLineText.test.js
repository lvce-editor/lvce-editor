import * as GetLineText from '../src/parts/GetLineText/GetLineText.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('empty', () => {
  const content = ''
  const startRowIndex = 0
  const startColumnIndex = 0
  const endRowIndex = 0
  const endColumnIndex = 0
  expect(GetLineText.getLineText(content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)).toBe('')
})

test('first line', () => {
  const content = 'export const add = '
  const startRowIndex = 0
  const startColumnIndex = 13
  const endRowIndex = 0
  const endColumnIndex = 16
  expect(GetLineText.getLineText(content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)).toBe('export const add =')
})

test('first line - trim', () => {
  const content = 'export const add = '
  const startRowIndex = 0
  const startColumnIndex = 13
  const endRowIndex = 0
  const endColumnIndex = 16
  expect(GetLineText.getLineText(content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)).toBe('export const add =')
})

test('second line', () => {
  const content = "import * as add from './add.ts'\nadd.add"
  const startRowIndex = 1
  const startColumnIndex = 4
  const endRowIndex = 0
  const endColumnIndex = 7
  expect(GetLineText.getLineText(content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)).toBe('add.add')
})

test('third line', () => {
  const content = "import * as add from './add.ts'\n\nadd.add"
  const startRowIndex = 2
  const startColumnIndex = 4
  const endRowIndex = 0
  const endColumnIndex = 7
  expect(GetLineText.getLineText(content, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)).toBe('add.add')
})
