import { expect, test } from '@jest/globals'
import * as GetTotalChildCount from '../src/parts/GetTotalChildCount/GetTotalChildCount.js'
import { div } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test('getTotalChildCount - no children', () => {
  const dom = [div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(0)
})

test('getTotalChildCount - single child', () => {
  const dom = [div({}, 1), div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(1)
})

test('getTotalChildCount - two direct children', () => {
  const dom = [div({}, 2), div({}, 0), div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(2)
})

test('getTotalChildCount - three direct children', () => {
  const dom = [div({}, 3), div({}, 0), div({}, 0), div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(3)
})

test('getTotalChildCount - nested children', () => {
  const dom = [div({}, 1), div({}, 1), div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(2)
})

test('getTotalChildCount - second child has nested children', () => {
  const dom = [div({}, 2), div({}, 0), div({}, 2), div({}, 1), div({}, 0), div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(5)
})

test('getTotalChildCount - mixed', () => {
  const dom = [div({}, 4), div({}, 1), div({}, 0), div({}, 0), div({}, 2), div({}, 0), div({}, 0), div({}, 1), div({}, 1), div({}, 0)]
  const index = 0
  expect(GetTotalChildCount.getTotalChildCount(dom, index)).toBe(9)
})
