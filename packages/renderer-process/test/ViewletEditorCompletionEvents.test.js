/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletEditorCompletion = await import('../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js')

test('event - mousedown', () => {
  const state = ViewletEditorCompletion.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorCompletion.attachEvents(state)
  ViewletEditorCompletion.setItems(state, [
    {
      label: 'item 1',
      highlights: [],
    },
    {
      label: 'item 2',
      highlights: [],
    },
    {
      label: 'item 3',
      highlights: [],
    },
  ])
  $Viewlet.children[0].dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickAt', 0, 0)
})

test('event - click outside', () => {
  const state = ViewletEditorCompletion.create()
  const { $Viewlet, $ListItems } = state
  ComponentUid.set($Viewlet, 1)
  ViewletEditorCompletion.attachEvents(state)
  ViewletEditorCompletion.setItems(state, [
    {
      label: 'item 1',
      highlights: [],
    },
    {
      label: 'item 2',
      highlights: [],
    },
    {
      label: 'item 3',
      highlights: [],
    },
  ])
  $ListItems.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    })
  )
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClickAt', 0, 0)
})

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
