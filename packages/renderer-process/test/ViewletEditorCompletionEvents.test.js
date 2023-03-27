/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as WheelEventType from '../src/parts/WheelEventType/WheelEventType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {}),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')
const ViewletEditorCompletion = await import('../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js')

test('event - mousedown', () => {
  const state = ViewletEditorCompletion.create()
  ViewletEditorCompletion.attachEvents(state)
  ViewletEditorCompletion.setItems(state, [
    {
      label: 'item 1',
    },
    {
      label: 'item 2',
    },
    {
      label: 'item 3',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$Viewlet.children[0].dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('EditorCompletion.handleClickAt', 0, 0)
})

test('event - click outside', () => {
  const state = ViewletEditorCompletion.create()
  ViewletEditorCompletion.attachEvents(state)
  ViewletEditorCompletion.setItems(state, [
    {
      label: 'item 1',
    },
    {
      label: 'item 2',
    },
    {
      label: 'item 3',
    },
  ])
  state.$ListItems.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('EditorCompletion.handleClickAt', 0, 0)
})

test('event - wheel', () => {
  const state = ViewletEditorCompletion.create()
  ViewletEditorCompletion.attachEvents(state)
  const event = new WheelEvent('wheel', {
    deltaY: 53,
    deltaMode: WheelEventType.DomDeltaLine,
  })
  const { $Viewlet } = state
  $Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('EditorCompletion.handleWheel', WheelEventType.DomDeltaLine, 53)
})
