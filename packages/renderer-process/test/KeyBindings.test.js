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
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')

beforeAll(() => {
  KeyBindings.hydrate()
})

test('handleKeyDown', async () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyDown',
    /* isCtrlKey */ false,
    /* isShiftKey */ false,
    /* isAltKey */ false,
    /* key */ 'a'
  )
})

test('handleKeyDown - with ctrl key', async () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyDown',
    /* isCtrlKey */ true,
    /* isShiftKey */ false,
    /* isAltKey */ false,
    /* key */ 'a'
  )
})

test('handleKeyDown - with shift key', async () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyDown',
    /* isCtrlKey */ false,
    /* isShiftKey */ true,
    /* isAltKey */ false,
    /* key */ 'a'
  )
})

test('handleKeyDown - with alt key', async () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
      altKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyDown',
    /* isCtrlKey */ false,
    /* isShiftKey */ false,
    /* isAltKey */ true,
    /* key */ 'a'
  )
})
