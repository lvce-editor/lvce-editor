import { expect, test } from '@jest/globals'
import * as Workers from '../src/parts/Workers/Workers.js'

test('cookie import view should let the main area own its tab title', () => {
  const worker = Workers.getWorkers().find(({ id }) => id === 'cookieImportView')

  expect(worker).toBeDefined()
  expect(worker?.viewlet?.title).toBeUndefined()
})

test('workers view resize forwards its position and dimensions', () => {
  const worker = Workers.getWorkers().find(({ id }) => id === 'workersView')

  expect(worker?.viewlet?.methods?.resize?.parameters).toEqual([
    { source: 'state', name: 'uid' },
    { source: 'argument', name: 'dimensions', index: 'x' },
    { source: 'argument', name: 'dimensions', index: 'y' },
    { source: 'argument', name: 'dimensions', index: 'width' },
    { source: 'argument', name: 'dimensions', index: 'height' },
  ])
})

test('workers view keybindings are registered', () => {
  const worker = Workers.getWorkers().find(({ id }) => id === 'workersView')

  expect(worker?.viewlet?.methods?.getKeyBindings).toEqual({
    name: 'Workers.getKeyBindings',
    parameters: [],
  })
})
