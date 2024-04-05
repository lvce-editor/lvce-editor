/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.ts'
import { beforeEach, test, expect } from '@jest/globals'

beforeEach(() => {
  jest.restoreAllMocks()
})

test('create', () => {
  const state = ViewletExtensions.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  ViewletExtensions.dispose()
})

test('handleError', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.handleError(state, 'TypeError: x is not a function')
  const { $ListItems } = state
  expect($ListItems.textContent).toBe('TypeError: x is not a function')
})
