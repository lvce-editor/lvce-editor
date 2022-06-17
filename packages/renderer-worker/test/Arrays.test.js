import * as Arrays from '../src/parts/Arrays/Arrays.js'

test('splice - insert item at start', () => {
  const array = [1, 2, 3]
  Arrays.splice(array, 0, 0, [0])
  expect(array).toEqual([0, 1, 2, 3])
})

test('splice - insert in middle', () => {
  const array = [1, 2, 3]
  Arrays.splice(array, 2, 0, [2.5])
  expect(array).toEqual([1, 2, 2.5, 3])
})

test('splice - insert item at end', () => {
  const array = [1, 2, 3]
  Arrays.splice(array, 3, 0, [4])
  expect(array).toEqual([1, 2, 3, 4])
})

test('splice - delete item at start', () => {
  const array = [1, 2, 3]
  Arrays.splice(array, 0, 1, [])
  expect(array).toEqual([2, 3])
})

test('splice - delete item in middle', () => {
  const array = [1, 2, 3]
  Arrays.splice(array, 1, 1, [])
  expect(array).toEqual([1, 3])
})

test('splice - delete item at end', () => {
  const array = [1, 2, 3]
  Arrays.splice(array, 2, 1, [])
  expect(array).toEqual([1, 2])
})
