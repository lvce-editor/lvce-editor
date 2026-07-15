import { expect, test } from '@jest/globals'
import * as SplitGroupRight from '../src/parts/SplitGroupRight/SplitGroupRight.js'

test('splitGroupRight', () => {
  const group = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }
  expect(SplitGroupRight.splitGroupRight(group)).toEqual([
    {
      height: 100,
      width: 50,
      x: 0,
      y: 0,
    },
    {
      height: 100,
      width: 50,
      x: 50,
      y: 0,
    },
  ])
})
