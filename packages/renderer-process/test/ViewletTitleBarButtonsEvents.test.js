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

const ViewletTitleBarButtons = await import('../src/parts/ViewletTitleBarButtons/ViewletTitleBarButtons.js')
const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')

test('event - click - minimize', () => {
  const state = ViewletTitleBarButtons.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  const { $TitleBarButtons } = state
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $TitleBarButtons.children[0].dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickMinimize')
})

test('event - click - toggleMaximize', () => {
  const state = ViewletTitleBarButtons.create()
  const { $TitleBarButtons } = state
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $TitleBarButtons.children[1].dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickToggleMaximize')
})

test('event - click - close', () => {
  const state = ViewletTitleBarButtons.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  const { $TitleBarButtons } = state
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $TitleBarButtons.children[2].dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickClose')
})
