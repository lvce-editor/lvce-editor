import { expect, test } from '@jest/globals'
import * as GetDebugPropertyValueLabelArray from '../src/parts/GetDebugPropertyValueLabelArray/GetDebugPropertyValueLabelArray.js'

test('empty array', () => {
  const value = {
    description: 'Array(0)',
    preview: {
      properties: [],
    },
  }
  expect(GetDebugPropertyValueLabelArray.getDebugPropertyValueLabelArray(value)).toBe('(0) []')
})

test('array with string value', () => {
  const value = {
    description: 'Array(1)',
    preview: {
      properties: [
        {
          name: '0',
          type: 'string',
          value: 'Host',
        },
      ],
    },
  }
  expect(GetDebugPropertyValueLabelArray.getDebugPropertyValueLabelArray(value)).toBe('(1) ["Host"]')
})
