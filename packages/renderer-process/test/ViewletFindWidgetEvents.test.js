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

test('event - click on focusPrevious', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletFindWidget.attachEvents(state)
  const { $ButtonFocusPrevious } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonFocusPrevious.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'focusPrevious')
})

test('event - click on focusNext', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletFindWidget.attachEvents(state)
  const { $ButtonFocusNext } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonFocusNext.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'focusNext')
})

test('event - click on close', () => {
  const state = ViewletFindWidget.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletFindWidget.attachEvents(state)
  const { $ButtonClose } = state
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  $ButtonClose.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'close')
})
