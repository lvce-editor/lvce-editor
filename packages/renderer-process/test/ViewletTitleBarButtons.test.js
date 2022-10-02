/**
 * @jest-environment jsdom
 */
import * as ViewletTitleBarButtons from '../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.js'

test('name', () => {
  expect(ViewletTitleBarButtons.name).toBe('TitleBarButtons')
})

test('create', () => {
  const state = ViewletTitleBarButtons.create()
  expect(state).toBeDefined()
})
