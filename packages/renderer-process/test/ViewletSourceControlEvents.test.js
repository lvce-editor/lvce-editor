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
      send: jest.fn(),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletSourceControl = await import(
  '../src/parts/ViewletSourceControl/ViewletSourceControl.js'
)

test('event - click', () => {
  const state = ViewletSourceControl.create()
  ViewletSourceControl.setChangedFiles(state, [
    {
      file: '/test/file-1',
    },
    {
      file: '/test/file-2',
    },
  ])
  const { $ViewletTree } = state
  console.log({ child: $ViewletTree.children[0] })
  $ViewletTree.children[0].dispatchEvent(
    new Event('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Viewlet.send',
    'Source Control',
    'handleClick',
    0
  )
})
