/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletKeyBindings = await import('../src/parts/ViewletKeyBindings/ViewletKeyBindings.js')

test('event - input', () => {
  const state = ViewletKeyBindings.create()
  ViewletKeyBindings.attachEvents(state)
  const { $InputBox, $Viewlet } = state
  ComponentUid.set($Viewlet, 1)

  $InputBox.value = 'abc'
  $InputBox.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'abc')
})
