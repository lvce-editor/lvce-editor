/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import { beforeEach, test, expect } from '@jest/globals'

const isLeaf = (node) => {
  return node.childElementCount === 0
}

const getTextContent = (node) => {
  return node.textContent
}

const getSimpleList = (state) => {
  const { $ListItems } = state
  return Array.from($ListItems.children).map((node) => {
    const children = node.querySelectorAll('*')
    return Array.from(children).filter(isLeaf).map(getTextContent).filter(Boolean)
  })
}

beforeEach(() => {
  jest.restoreAllMocks()
})

test('create', () => {
  const state = ViewletExtensions.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.dispose(state)
})

test('dispose', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.dispose(state)
})

test('handleError', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.handleError(state, 'TypeError: x is not a function')
  const { $ListItems } = state
  expect($ListItems.textContent).toBe('TypeError: x is not a function')
})
