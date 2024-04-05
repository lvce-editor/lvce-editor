/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as EnterKeyHintType from '../src/parts/EnterKeyHintType/EnterKeyHintType.ts'
import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.ts'

test('create', () => {
  const state = ViewletSearch.create()
  expect(state).toBeDefined()
})

test('refresh', () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  ViewletSearch.refresh(state)
})

test.skip('accessibility - input box should have enterkeyhint search', () => {
  const state = ViewletSearch.create()
  // @ts-ignore
  const { $ViewletSearchInput } = state
  expect($ViewletSearchInput.enterKeyHint).toBe(EnterKeyHintType.Search)
})
