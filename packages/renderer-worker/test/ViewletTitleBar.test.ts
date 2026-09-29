import { expect, test } from '@jest/globals'
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.js'

test('create', () => {
  const state = ViewletTitleBar.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletTitleBar.create()
  expect(ViewletTitleBar.loadContent(state)).toMatchObject({
    isFocused: true,
  })
})
