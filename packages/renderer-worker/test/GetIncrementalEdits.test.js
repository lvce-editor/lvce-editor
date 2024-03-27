import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.js'
import * as GetIncrementalEdits from '../src/parts/GetIncrementalEdits/GetIncrementalEdits.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getIncrementalEdits - whitespace issue', () => {
  const oldState = {
    lines: ['<li  >'],
    undoStack: [],
    tokenizer: {
      tokenizeLine(state) {
        return {
          state,
          tokens: [228, 1, 118, 2, 0, 2, 228, 1],
        }
      },
      initialLineState: {},
      hasArrayReturn: true,
    },
    lineCache: {},
    minLineY: 0,
  }
  const newState = {
    lines: ['<li a >'],
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 4,
          },
          end: {
            rowIndex: 0,
            columnIndex: 4,
          },
          inserted: ['a'],
          deleted: [''],
          origin: EditOrigin.EditorType,
        },
      ],
    ],
    tokenizer: {
      tokenizeLine(state) {
        return {
          state,
          tokens: [228, 1, 118, 2, 0, 1, 119, 1, 0, 1, 228, 1],
        }
      },
      initialLineState: {},
      hasArrayReturn: true,
    },
    lineCache: {},
    minLineY: 0,
  }
  expect(GetIncrementalEdits.getIncrementalEdits(oldState, newState)).toBe(undefined)
})

test('getIncrementalEdits - whitespace issue', () => {
  const oldState = {
    lines: ['<li >'],
    undoStack: [],
    tokenizer: {
      tokenizeLine(state) {
        return {
          state,
          tokens: [228, 1, 118, 2, 0, 1, 228, 1],
        }
      },
      initialLineState: {},
      hasArrayReturn: true,
    },
    lineCache: {},
    minLineY: 0,
  }
  const newState = {
    lines: ['<li  >'],
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 3,
          },
          end: {
            rowIndex: 0,
            columnIndex: 3,
          },
          inserted: [''],
          deleted: [''],
          origin: EditOrigin.EditorType,
        },
      ],
    ],
    tokenizer: {
      tokenizeLine(state) {
        return {
          state,
          tokens: [228, 1, 118, 2, 0, 2, 228, 1],
        }
      },
      initialLineState: {},
      hasArrayReturn: true,
    },
    lineCache: {},
    minLineY: 0,
  }
  expect(GetIncrementalEdits.getIncrementalEdits(oldState, newState)).toEqual([
    {
      columnIndex: 2,
      rowIndex: 0,
      text: '  ',
    },
  ])
})
