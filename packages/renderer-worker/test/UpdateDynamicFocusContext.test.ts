import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => {
  return {
    removeAdditionalFocus: jest.fn(),
    setAdditionalFocus: jest.fn(),
    setFocus: jest.fn(),
  }
})

const Focus = await import('../src/parts/Focus/Focus.js')
const UpdateDynamicFocusContext = await import('../src/parts/UpdateDynamicFocusContext/UpdateDynamicFocusContext.js')
const mockRemoveAdditionalFocus = jest.mocked(Focus.removeAdditionalFocus)
const mockSetAdditionalFocus = jest.mocked(Focus.setAdditionalFocus)
const mockSetFocus = jest.mocked(Focus.setFocus)

beforeEach(() => {
  jest.clearAllMocks()
})

test('removes and applies all dynamic focus commands', () => {
  const commands = [
    ['Viewlet.setFocusContext', 1, 10],
    ['Viewlet.setDom2', 1, []],
    ['Viewlet.setFocusContext', 1, 20],
    ['Viewlet.setAdditionalFocus', 1, 30],
    ['Viewlet.setAdditionalFocus', 1, 40],
    ['Viewlet.unsetAdditionalFocus', 1, 50],
    ['Viewlet.unsetAdditionalFocus', 1, 60],
  ]

  UpdateDynamicFocusContext.updateDynamicFocusContext(commands)

  expect(commands).toEqual([['Viewlet.setDom2', 1, []]])
  expect(mockSetFocus.mock.calls).toEqual([[10], [20]])
  expect(mockSetAdditionalFocus.mock.calls).toEqual([[30], [40]])
  expect(mockRemoveAdditionalFocus.mock.calls).toEqual([[50], [60]])
})
