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

const ViewletOutput = await import(
  '../src/parts/ViewletOutput/ViewletOutput.js'
)

test('event - change', () => {
  const state = ViewletOutput.create()
  ViewletOutput.setOptions(state, [
    {
      name: 'Shared Process',
      file: '/test/log-shared-process.txt',
    },
    {
      name: 'Extension Host',
      file: '/test/log-extension-host.txt',
    },
  ])
  const { $Select } = state
  const event = new InputEvent('change', {
    bubbles: true,
  })
  $Select.children[1].dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Viewlet.send',
    'Output',
    'setOutputChannel',
    '/test/log-extension-host.txt'
  )
})
