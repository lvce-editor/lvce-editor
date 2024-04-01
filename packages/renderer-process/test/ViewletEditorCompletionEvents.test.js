/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.ts'
import { beforeEach, test, expect } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')
const ViewletEditorCompletion = await import('../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.ts')

test('event - wheel', () => {
  const state = ViewletEditorCompletion.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorCompletion.attachEvents(state)
  const event = new WheelEvent('wheel', {
    deltaY: 53,
    deltaMode: WheelEventType.DomDeltaLine,
  })
  $Viewlet.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleWheel', WheelEventType.DomDeltaLine, 53)
})
