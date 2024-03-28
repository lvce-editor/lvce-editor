import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('create', () => {
  const state = ViewletTitleBarMenuBar.create()
  expect(state).toBeDefined()
})
