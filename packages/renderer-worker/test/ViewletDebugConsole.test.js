import * as ViewletDebugConsole from '../src/parts/ViewletDebugConsole/ViewletDebugConsole.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('create', () => {
  const state = ViewletDebugConsole.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletDebugConsole.create()
  expect(await ViewletDebugConsole.loadContent(state)).toMatchObject({})
})
