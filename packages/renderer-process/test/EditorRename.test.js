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

const EditorRename = await import('../src/parts/EditorRename/EditorRename.js')

test('create', () => {
  const state = EditorRename.create(10, 20)
  const $RenameWidget = state.$RenameWidget
  expect($RenameWidget).toBeDefined()
  expect($RenameWidget.style.left).toBe('10px')
  expect($RenameWidget.style.top).toBe('20px')
  const $RenameWidgetInputBox = $RenameWidget.querySelector('input')
  expect(document.activeElement).toBe($RenameWidgetInputBox)
})

test('dispose', () => {
  const state = EditorRename.create(10, 20)
  EditorRename.dispose(state)
  expect(document.activeElement).toBe(document.body)
})

test('finish', () => {
  const state = EditorRename.create(10, 20)
  state.$RenameWidgetInputBox.value = 'abc'
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  expect(EditorRename.finish(state)).toBe('abc')
  expect(RendererWorker.send).not.toHaveBeenCalled()
})
