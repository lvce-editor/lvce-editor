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

const ViewletProblems = await import('../src/parts/Viewlet/ViewletProblems.js')

const getSimpleList = (state) => {
  return Array.from(state.element.children).map((node) => node.textContent)
}

test('name', () => {
  expect(ViewletProblems.name).toBe('Problems')
})

test('create', () => {
  const state = ViewletProblems.create()
  expect(state).toBeDefined()
})

test('refresh - no problems', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setProblems(state, [])
  expect(state.$Viewlet.textContent).toBe(
    'No problems have been detected in the workspace.'
  )
})

test('refresh - multiple problems', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setProblems(state, ['Problem 1', 'Problem 2'])
  expect(state.$Viewlet.textContent).toBe(
    `Problem 1
Problem 2`
  )
})

test('focus', () => {
  const state = ViewletProblems.create()
  document.body.append(state.$Viewlet)
  ViewletProblems.focus(state)
  expect(document.activeElement).toBe(state.$Viewlet)
})

test('event - mousedown', () => {
  const state = ViewletProblems.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    clientX: 15,
    clientY: 30,
    cancelable: true,
  })
  state.$Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(7550, -1)
  expect(event.defaultPrevented).toBe(true)
})

test('setFocusedIndex', () => {
  const state = ViewletProblems.create()
  ViewletProblems.setFocusedIndex(state, -1)
  expect(state.$Viewlet.classList.contains('FocusOutline')).toBe(true)
})

// test('append', () => {
//   const state = ViewletProblems.create()
//   ViewletProblems.append(state, 'line 1')
//   expect(getSimpleList(state)).toEqual(['line 1'])
//   ViewletProblems.append(state, 'line 2')
//   expect(getSimpleList(state)).toEqual(['line 1', 'line 2'])
// })

// test('clear', () => {
//   const state = ViewletProblems.create()
//   ViewletProblems.clear(state)
//   expect(getSimpleList(state)).toEqual([])
// })

// test('handleError', () => {
//   const state = ViewletProblems.create()
//   ViewletProblems.handleError(state, 'test error')
//   expect(state.element.textContent).toBe('Error: test error')
// })
