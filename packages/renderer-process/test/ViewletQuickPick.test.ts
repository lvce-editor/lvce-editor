/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as DomAttributeType from '../src/parts/DomAttributeType/DomAttributeType.ts'
import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.ts'

test('create', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setValue(state, '>')
  expect(state.$QuickPick).toBeDefined()
  expect(state.$QuickPickInput.value).toBe('>')
})

test('accessibility - QuickPick should have aria label', () => {
  const state = ViewletQuickPick.create()
  expect(state.$QuickPick.ariaLabel).toBe('Quick open')
})

test('accessibility - aria-activedescendant should point to quick pick item', () => {
  const state = ViewletQuickPick.create()
  ViewletQuickPick.setFocusedIndex(state, -1, 0)
  expect(state.$QuickPickInput.getAttribute(DomAttributeType.AriaActiveDescendant)).toBe('QuickPickItemActive')
})

test('hideStatus', () => {
  const state = ViewletQuickPick.create()
  // @ts-ignore
  ViewletQuickPick.showNoResults(state)
  ViewletQuickPick.hideStatus(state)
  expect(state.$QuickPickStatus).toBeUndefined()
})
