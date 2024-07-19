import { expect, test } from '@jest/globals'
import * as Arrays from '../src/parts/Arrays/Arrays.js'

test('splice - insert item at start', () => {
  const array = [1, 2, 3]
  Arrays.spliceLargeArray(array, 0, 0, [0])
  expect(array).toEqual([0, 1, 2, 3])
})

test('splice - insert in middle', () => {
  const array = [1, 2, 3]
  Arrays.spliceLargeArray(array, 2, 0, [2.5])
  expect(array).toEqual([1, 2, 2.5, 3])
})

test('splice - insert item at end', () => {
  const array = [1, 2, 3]
  Arrays.spliceLargeArray(array, 3, 0, [4])
  expect(array).toEqual([1, 2, 3, 4])
})

test('splice - delete item at start', () => {
  const array = [1, 2, 3]
  Arrays.spliceLargeArray(array, 0, 1, [])
  expect(array).toEqual([2, 3])
})

test('splice - delete item in middle', () => {
  const array = [1, 2, 3]
  Arrays.spliceLargeArray(array, 1, 1, [])
  expect(array).toEqual([1, 3])
})

test('splice - delete item at end', () => {
  const array = [1, 2, 3]
  Arrays.spliceLargeArray(array, 2, 1, [])
  expect(array).toEqual([1, 2])
})

test('toSpliced - delete item at start', () => {
  const array = [1, 2, 3]
  const newArray = Arrays.toSpliced(array, 0, 1)
  expect(newArray).toEqual([2, 3])
})

test('toSpliced - delete item at end', () => {
  const array = [1, 2, 3]
  const newArray = Arrays.toSpliced(array, 2, 1)
  expect(newArray).toEqual([1, 2])
})

test('push - add one item', () => {
  const array = []
  Arrays.push(array, [1])
  expect(array).toEqual([1])
})
