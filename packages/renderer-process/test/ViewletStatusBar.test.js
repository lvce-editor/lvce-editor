/**
 * @jest-environment jsdom
 */
import * as Layout from '../src/parts/Layout/Layout.js'
import * as ViewletStatusBar from '../src/parts/Viewlet/ViewletStatusBar.js'

beforeEach(() => {
  Layout.state.$StatusBar = document.createElement('div')
})

test.skip('create', () => {
  const state = ViewletStatusBar.create(
    [
      {
        name: 'Item 1',
        text: 'Item 1',
        tooltip: '',
        command: 909021,
      },
    ],
    [
      {
        name: 'Item 2',
        text: 'Item 2',
        tooltip: '',
        command: 909021,
      },
    ]
  )
  expect(state.$StatusBarItemsLeft.children).toHaveLength(1)
  expect(state.$StatusBarItemsLeft.firstChild.textContent).toBe('Item 1')
  expect(state.$StatusBarItemsRight.children).toHaveLength(1)
  expect(state.$StatusBarItemsRight.firstChild.textContent).toBe('Item 2')
})

test.skip('accessibility - status bar should have role status, tabIndex 0,  ariaLabel and ariaLive', () => {
  const state = ViewletStatusBar.create([], [])
  expect(state.$StatusBar.getAttribute('role')).toBe('status')
  expect(state.$StatusBar.ariaLabel).toBe('Status Bar')
  expect(state.$StatusBar.ariaLive).toBe('off')
  expect(state.$StatusBar.tabIndex).toBe(0)
})
