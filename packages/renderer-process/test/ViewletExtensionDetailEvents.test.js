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
const ViewletExtensionDetail = await import('../src/parts/ViewletExtensionDetail/ViewletExtensionDetail.js')

test('event - image does not load', () => {
  const state = ViewletExtensionDetail.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletExtensionDetail.attachEvents(state)
  const { $ExtensionDetailIcon } = state
  const event = new ErrorEvent('error')
  $ExtensionDetailIcon.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleIconError')
})
