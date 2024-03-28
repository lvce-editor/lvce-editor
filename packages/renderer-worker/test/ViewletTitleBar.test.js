import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('create', () => {
  const state = ViewletTitleBar.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTitleBar.create()
  expect(ViewletTitleBar.loadContent(state)).toMatchObject({
    isFocused: true,
  })
})
