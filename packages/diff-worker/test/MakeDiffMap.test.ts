import { expect, test } from '@jest/globals'
import * as MakeDiffMap from '../src/parts/MakeDiffMap/MakeDiffMap.ts'

test('same', () => {
  const linesA = ['a']
  const linesB = ['a']
  expect(MakeDiffMap.makeDiffMap(linesA, linesB)).toEqual({
    map: {
      a: {
        nc: 1,
        oc: 1,
        olno: 0,
      },
    },
    na: [
      {
        nc: 1,
        oc: 1,
        olno: 0,
      },
    ],
    oa: [
      {
        nc: 1,
        oc: 1,
        olno: 0,
      },
    ],
  })
})

test('deletion', () => {
  const linesA = ['a']
  const linesB = []
  expect(MakeDiffMap.makeDiffMap(linesA, linesB)).toEqual({
    map: { a: { nc: 0, oc: 1, olno: 0 } },
    na: [],
    oa: [{ nc: 0, oc: 1, olno: 0 }],
  })
})

test('insertion', () => {
  const linesA = []
  const linesB = ['a']
  expect(MakeDiffMap.makeDiffMap(linesA, linesB)).toEqual({
    map: {
      a: {
        nc: 1,
        oc: 0,
        olno: -1,
      },
    },
    na: [
      {
        nc: 1,
        oc: 0,
        olno: -1,
      },
    ],
    oa: [],
  })
})

test('two insertions', () => {
  const linesA = []
  const linesB = ['a', 'a']
  expect(MakeDiffMap.makeDiffMap(linesA, linesB)).toEqual({
    map: {
      a: {
        nc: 2,
        oc: 0,
        olno: -1,
      },
    },
    na: [
      {
        nc: 2,
        oc: 0,
        olno: -1,
      },
      {
        nc: 2,
        oc: 0,
        olno: -1,
      },
    ],
    oa: [],
  })
})

test('replacement', () => {
  const linesA = ['a']
  const linesB = ['b']
  expect(MakeDiffMap.makeDiffMap(linesA, linesB)).toEqual({
    map: {
      a: {
        nc: 0,
        oc: 1,
        olno: 0,
      },
      b: {
        nc: 1,
        oc: 0,
        olno: -1,
      },
    },
    na: [
      {
        nc: 1,
        oc: 0,
        olno: -1,
      },
    ],
    oa: [
      {
        nc: 0,
        oc: 1,
        olno: 0,
      },
    ],
  })
})
