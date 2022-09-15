/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Layout from '../src/parts/Layout/Layout.js'

beforeEach(() => {
  jest.resetAllMocks()
  Layout.state.$ActivityBar = document.createElement('div')
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletKeyBindings = await import(
  '../src/parts/ViewletKeyBindings/ViewletKeyBindings.js'
)

test('event - input', () => {
  const state = ViewletKeyBindings.create()
  const { $InputBox } = state
  $InputBox.value = 'abc'
  $InputBox.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleInput',
    'abc'
  )
})
