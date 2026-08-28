import { expect, test } from '@jest/globals'
import * as Workers from '../src/parts/Workers/Workers.js'

test('cookie import view should let the main area own its tab title', () => {
  const worker = Workers.getWorkers().find(({ id }) => id === 'cookieImportView')

  expect(worker).toBeDefined()
  expect(worker?.viewlet?.title).toBeUndefined()
})
