import { expect, test } from '@jest/globals'
import * as BulkReplacementContent from '../src/parts/BulkReplacementContent/BulkReplacementContent.ts'

test('getNewContent - preserves text around a replacement', () => {
  const oldContent = "export const alpha = 'needle'\n"
  const changes = [
    {
      endColumnIndex: 28,
      endRowIndex: 1,
      startColumnIndex: 22,
      startRowIndex: 0,
      text: 'pin',
    },
  ]

  expect(BulkReplacementContent.getNewContent(oldContent, changes)).toBe("export const alpha = 'pin'\n")
})

test('getNewContent - replaces matches on multiple lines', () => {
  const oldContent = "export const alpha = 'needle'\nexport const beta = 'NEEDLE'\nexport const phrase = 'needle in TypeScript'\n"
  const changes = [
    {
      endColumnIndex: 28,
      endRowIndex: 1,
      startColumnIndex: 22,
      startRowIndex: 0,
      text: 'pin',
    },
    {
      endColumnIndex: 27,
      endRowIndex: 2,
      startColumnIndex: 21,
      startRowIndex: 1,
      text: 'pin',
    },
    {
      endColumnIndex: 29,
      endRowIndex: 3,
      startColumnIndex: 23,
      startRowIndex: 2,
      text: 'pin',
    },
  ]

  expect(BulkReplacementContent.getNewContent(oldContent, changes)).toBe(
    "export const alpha = 'pin'\nexport const beta = 'pin'\nexport const phrase = 'pin in TypeScript'\n",
  )
})

test('getNewContent - replaces multiple matches on one line', () => {
  const oldContent = 'needle and needle remain on one line'
  const changes = [
    {
      endColumnIndex: 6,
      endRowIndex: 1,
      startColumnIndex: 0,
      startRowIndex: 0,
      text: 'pin',
    },
    {
      endColumnIndex: 17,
      endRowIndex: 1,
      startColumnIndex: 11,
      startRowIndex: 0,
      text: 'pin',
    },
  ]

  expect(BulkReplacementContent.getNewContent(oldContent, changes)).toBe('pin and pin remain on one line')
})
