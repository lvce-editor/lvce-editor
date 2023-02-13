import * as GridLayout from '../src/parts/GridLayout/GridLayout.js'

test.skip('empty', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([])
})

test.skip('side by side vertical', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
  ])
})

test.skip('side by side horizontal', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
    },
  ])
})

test.skip('three items side by side vertically', () => {
  const x = 0
  const y = 0
  const width = 150
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 150,
      height: 100,
      childCount: 3,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
    {
      x: 100,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
  ])
})

test.skip('three items side by side horizontally', () => {
  const x = 0
  const y = 0
  const width = 150
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 150,
      childCount: 3,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 100,
      width: 100,
      height: 50,
      childCount: 0,
    },
  ])
})

test.skip('2 x 1 left', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
  ])
})

test.skip('2 x 1 up', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
      childCount: 0,
    },
  ])
})

test.skip('2 x 1 right', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      childCount: 0,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
      childCount: 2,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
  ])
})

test.skip('2 x 1 bottom', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
      childCount: 2,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
  ])
})

test.skip('2 x 2 left / right', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
      childCount: 2,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
  ])
})

test.skip('2 x 2 up / down', () => {
  const x = 0
  const y = 0
  const width = 100
  const height = 100
  expect(GridLayout.create(x, y, width, height)).toEqual([
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      childCount: 2,
    },
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
      childCount: 2,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      childCount: 0,
    },
  ])
})
