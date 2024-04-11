/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletStatusBar from '../src/parts/ViewletStatusBar/ViewletStatusBar.ts'

test.skip('create', () => {
  const state = ViewletStatusBar.create(
    // @ts-ignore
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
    ],
  )
  // @ts-ignore
  expect(state.$StatusBarItemsLeft.children).toHaveLength(1)
  // @ts-ignore
  expect(state.$StatusBarItemsLeft.firstChild.textContent).toBe('Item 1')
  // @ts-ignore
  expect(state.$StatusBarItemsRight.children).toHaveLength(1)
  // @ts-ignore
  expect(state.$StatusBarItemsRight.firstChild.textContent).toBe('Item 2')
})

test.skip('accessibility - status bar should have role status, tabIndex 0,  ariaLabel and ariaLive', () => {
  // @ts-ignore
  const state = ViewletStatusBar.create([], [])
  // @ts-ignore
  expect(state.$StatusBar.getAttribute('role')).toBe('status')
  // @ts-ignore
  expect(state.$StatusBar.ariaLabel).toBe('Status Bar')
  // @ts-ignore
  expect(state.$StatusBar.ariaLive).toBe('off')
  // @ts-ignore
  expect(state.$StatusBar.tabIndex).toBe(0)
})

test('accessibility - status bar should have aria role description attribute', () => {
  // @ts-ignore
  const state = ViewletStatusBar.create([], [])
  const { $Viewlet } = state
  expect($Viewlet.ariaRoleDescription).toBe('Status Bar')
})
