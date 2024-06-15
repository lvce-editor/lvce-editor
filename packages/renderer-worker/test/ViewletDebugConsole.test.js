import { expect, test } from '@jest/globals'
import * as ViewletDebugConsole from '../src/parts/ViewletDebugConsole/ViewletDebugConsole.js'

test('create', () => {
  const state = ViewletDebugConsole.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletDebugConsole.create()
  expect(await ViewletDebugConsole.loadContent(state)).toMatchObject({})
})
