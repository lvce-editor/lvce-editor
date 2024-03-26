/**
 * @jest-environment jsdom
 */
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.js'
import * as EnterKeyHintType from '../src/parts/EnterKeyHintType/EnterKeyHintType.js'
import { beforeEach, test, expect } from '@jest/globals'

test('create', () => {
  const state = ViewletSearch.create()
  expect(state).toBeDefined()
})

test('refresh', () => {
  const state = ViewletSearch.create()
  ViewletSearch.refresh(state)
})

test.skip('accessibility - input box should have enterkeyhint search', () => {
  const state = ViewletSearch.create()
  const { $ViewletSearchInput } = state
  expect($ViewletSearchInput.enterKeyHint).toBe(EnterKeyHintType.Search)
})
