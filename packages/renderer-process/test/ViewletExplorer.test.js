/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

/**
 * @jest-environment jsdom
 */

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(),
  }
})

const ViewletExplorer = await import('../src/parts/ViewletExplorer/ViewletExplorer.ts')

beforeEach(() => {
  document.body.textContent = ''
})

test('create', () => {
  const state = ViewletExplorer.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.dispose(state)
})

test('handleError', () => {
  const state = ViewletExplorer.create()
  const { $Viewlet } = state
  ViewletExplorer.handleError(state, 'Error: Oops')
  expect($Viewlet.textContent).toBe('Error: Oops')
})

test('setDropTargets - remove outer as drop target', () => {
  const state = ViewletExplorer.create()
  const { $Viewlet } = state
  ViewletExplorer.setDropTargets(state, [], [-1])
  ViewletExplorer.setDropTargets(state, [-1], [])
  expect($Viewlet.classList.contains('DropTarget')).toBe(false)
})
