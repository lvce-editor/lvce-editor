/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')
const ViewletKeyBindings = await import('../src/parts/ViewletKeyBindings/ViewletKeyBindings.ts')

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
    }),
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'abc')
})
