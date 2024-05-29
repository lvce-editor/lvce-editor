import { expect, test } from '@jest/globals'
import * as DiffType from '../src/parts/DiffType/DiffType.js'
import * as GetInlineDiffEditorLines from '../src/parts/GetInlineDiffEditorLines/GetInlineDiffEditorLines.js'

test('one line equal, one line replaced', () => {
  const linesA = ['abc;', 'a']
  const linesB = ['abc;', 'b']
  const changesLeft = [
    {
      index: 0,
      type: DiffType.None,
    },
    {
      index: 1,
      type: DiffType.Deletion,
    },
  ]
  const changesRight = [
    {
      index: 0,
      type: DiffType.None,
    },
    {
      index: 1,
      type: DiffType.Insertion,
    },
  ]
  expect(GetInlineDiffEditorLines.getInlineDiffEditorLines(linesA, linesB, changesLeft, changesRight)).toEqual([
    {
      text: 'abc;',
      type: 0,
    },
    {
      text: 'a',
      type: 2,
    },
    {
      text: 'b',
      type: 1,
    },
  ])
})

test('one line equal, two lines replaced', () => {
  const linesA = ['abc;', 'a', 'a']
  const linesB = ['abc;', 'b', 'b']
  const changesLeft = [
    {
      index: 0,
      type: DiffType.None,
    },
    {
      index: 1,
      type: DiffType.Deletion,
    },
    {
      index: 2,
      type: DiffType.Deletion,
    },
  ]
  const changesRight = [
    {
      index: 0,
      type: DiffType.None,
    },
    {
      index: 1,
      type: DiffType.Insertion,
    },
    {
      index: 2,
      type: DiffType.Insertion,
    },
  ]
  expect(GetInlineDiffEditorLines.getInlineDiffEditorLines(linesA, linesB, changesLeft, changesRight)).toEqual([
    {
      text: 'abc;',
      type: 0,
    },
    {
      text: 'a',
      type: 2,
    },
    {
      text: 'a',
      type: 2,
    },
    {
      text: 'b',
      type: 1,
    },
    {
      text: 'b',
      type: 1,
    },
  ])
})
