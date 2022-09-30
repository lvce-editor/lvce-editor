/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {}),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletEditorCompletion = await import(
  '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'
)

test('event - mousedown', () => {
  const state = ViewletEditorCompletion.create()
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
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'EditorCompletion.selectIndex',
    0
  )
})

test('event - click outside', () => {
  const state = ViewletEditorCompletion.create()
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
  state.$Viewlet.dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})
