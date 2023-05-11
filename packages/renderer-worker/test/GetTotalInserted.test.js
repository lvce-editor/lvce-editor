import * as GetTotalInserted from '../src/parts/GetTotalInserted/GetTotalInserted.js'
import { div } from '../src/parts/VirtualDomHelpers/VirtualDomHelpers.js'

test('getTotalInserted - single node', () => {
  const dom = [div({}, 0)]
  const startIndex = 0
  expect(GetTotalInserted.getTotalInserted(dom, startIndex)).toBe(1)
})

test('getTotalInserted - one of two nodes', () => {
  const dom = [div({}, 0), div({}, 0)]
  const startIndex = 0
  expect(GetTotalInserted.getTotalInserted(dom, startIndex)).toBe(1)
})

test('getTotalInserted - node with child', () => {
  const dom = [div({}, 1), div({}, 0)]
  const startIndex = 0
  expect(GetTotalInserted.getTotalInserted(dom, startIndex)).toBe(2)
})

test('getTotalInserted - multiple nodes', () => {
  const dom = [div({}, 1), div({}, 1), div({}, 4), div({}, 0), div({}, 0), div({}, 0), div({}, 0)]
  const startIndex = 0
  expect(GetTotalInserted.getTotalInserted(dom, startIndex)).toBe(7)
})
