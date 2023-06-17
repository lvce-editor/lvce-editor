/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.js'
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
const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.js')

test('event - input', () => {
  const state = ViewletSearch.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSearch.attachEvents(state)
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = 'test search'
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  })
  $ViewletSearchInput.dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleInput', 'test search')
})

test('event - click', () => {
  const state = ViewletSearch.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSearch.attachEvents(state)
  ViewletSearch.setResults(state, [
    {
      name: './test.txt',
      path: '/test/test.txt',
    },
  ])
  const { $ListItems } = state
  const event = new Event('mousedown', {
    bubbles: true,
    cancelable: true,
  })
  $ListItems.children[0].dispatchEvent(event)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0)
})

test('event - contextmenu - activated via keyboard', () => {
  const state = ViewletSearch.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSearch.attachEvents(state)
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  const event = new MouseEvent('contextmenu', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: -1,
    cancelable: true,
  })
  const { $ListItems } = state
  $ListItems.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', -1, 50, 50)
})

test('event - contextmenu - activated via mouse', () => {
  const state = ViewletSearch.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletSearch.attachEvents(state)
  ViewletSearch.setResults(state, [
    {
      name: './result-1.txt',
    },
  ])
  const event = new MouseEvent('contextmenu', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: MouseEventType.LeftClick,
    cancelable: true,
  })
  const { $ListItems } = state
  $ListItems.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', 0, 50, 50)
})
