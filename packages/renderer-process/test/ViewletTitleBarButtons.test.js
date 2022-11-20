/**
 * @jest-environment jsdom
 */
import * as ViewletTitleBarButtons from '../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.js'

test('create', () => {
  const state = ViewletTitleBarButtons.create()
  expect(state).toBeDefined()
})
