/**
 * @jest-environment jsdom
 */
import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.js'

test('accessibility - title bar should have role of contentinfo', () => {
  const state = ViewletTitleBar.create()
  const { $TitleBar } = state
  // @ts-ignore
  expect($TitleBar.role).toBe('contentinfo')
})
