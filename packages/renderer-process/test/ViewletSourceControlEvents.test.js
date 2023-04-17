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
const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.js')

test('event - click', () => {
  const state = ViewletSourceControl.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSourceControl.attachEvents(state)
  ViewletSourceControl.setChangedFiles(state, [
    {
      file: '/test/file-1',
      type: 'file',
    },
    {
      file: '/test/file-2',
      type: 'file',
    },
  ])
  const { $ViewletTree } = state
  $ViewletTree.children[0].dispatchEvent(
    new Event('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0)
})

test('event - mouseover', () => {
  const state = ViewletSourceControl.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSourceControl.attachEvents(state)
  ViewletSourceControl.setChangedFiles(state, [
    {
      file: '/test/file-1',
      type: 'file',
    },
    {
      file: '/test/file-2',
      type: 'file',
    },
  ])
  const { $ViewletTree } = state
  const event = new Event('mouseover', {
    bubbles: true,
    cancelable: true,
  })
  $ViewletTree.children[0].dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleMouseOver', 0)
})

test('event - contextmenu', () => {
  const state = ViewletSourceControl.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSourceControl.attachEvents(state)
  ViewletSourceControl.setChangedFiles(state, [
    {
      file: '/test/file-1',
      type: 'file',
    },
    {
      file: '/test/file-2',
      type: 'file',
    },
  ])
  const { $ViewletTree } = state
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: 10,
    clientY: 20,
  })
  $ViewletTree.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', 0, 10, 20)
})

test('event - input', () => {
  const state = ViewletSourceControl.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSourceControl.attachEvents(state)
  const { $ViewSourceControlInput } = state
  $ViewSourceControlInput.value = 'test'
  const event = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
  })
  $ViewSourceControlInput.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'test')
})
