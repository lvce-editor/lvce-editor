/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ViewletFindWidget = await import('../src/parts/ViewletFindWidget/ViewletFindWidget.js')
const ComponentUid = await import('../src/parts/ComponentUid/ComponentUid.js')
const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')

test('event - input', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletFindWidget.attachEvents(state)
  const { $InputBox } = state
  $InputBox.value = 'abc'
  const event = new InputEvent('input')
  $InputBox.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'abc')
})
