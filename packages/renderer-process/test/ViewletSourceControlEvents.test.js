/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')
const ViewletSourceControl = await import('../src/parts/ViewletSourceControl/ViewletSourceControl.js')

test('event - click', () => {
  const state = ViewletSourceControl.create()
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
  expect(RendererWorker.send).toHaveBeenCalledWith('Source Control.handleClick', 0)
})

test('event - mouseover', () => {
  const state = ViewletSourceControl.create()
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
  expect(RendererWorker.send).toHaveBeenCalledWith('Source Control.handleMouseOver', 0)
})

test('event - contextmenu', () => {
  const state = ViewletSourceControl.create()
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
  expect(RendererWorker.send).toHaveBeenCalledWith('Source Control.handleContextMenu', 0, 10, 20)
})

test('event - input', () => {
  const state = ViewletSourceControl.create()
  ViewletSourceControl.attachEvents(state)
  const { $ViewSourceControlInput } = state
  $ViewSourceControlInput.value = 'test'
  const event = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
  })
  $ViewSourceControlInput.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledWith('Source Control.handleInput', 'test')
})
