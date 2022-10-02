/**
 * @jest-environment jsdom
 */
import * as Layout from '../src/parts/Layout/Layout.js'
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.js'

beforeAll(() => {
  Layout.state.$TitleBar = document.createElement('div')
})

test('accessibility - title bar should have role of contentinfo', () => {
  const state = ViewletTitleBar.create()
  const { $TitleBar } = state
  expect($TitleBar.role).toBe('contentinfo')
})
