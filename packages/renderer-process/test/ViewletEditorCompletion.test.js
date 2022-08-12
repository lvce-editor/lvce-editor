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

const ViewletEditorCompletion = await import(
  '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'
)

const getTextContent = (node) => {
  return node.textContent
}

const getSimpleList = ($Element) => {
  return Array.from($Element.childNodes).map(getTextContent)
}

test('name', () => {
  expect(ViewletEditorCompletion.name).toBe('EditorCompletion')
})

test('create', () => {
  const state = ViewletEditorCompletion.create()
  expect(state).toBeDefined()
})

test('show', () => {
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
  expect(getSimpleList(state.$Viewlet)).toEqual(['item 1', 'item 2', 'item 3'])

  // TODO
  //  expect(
  //   Main.state.activeEditorState.$EditorInput.getAttribute(
  //     'aria-activedescendant'
  //   )
  // ).toBe('CompletionItem-0')
})

test('show - no results', () => {
  const state = ViewletEditorCompletion.create()
  ViewletEditorCompletion.setItems(state, [])
  expect(getSimpleList(state.$Viewlet)).toEqual(['No Results'])
})

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
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$Viewlet.dispatchEvent(
    new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('dispose', () => {
  const state = ViewletEditorCompletion.create()
  ViewletEditorCompletion.setItems(state, [
    {
      label: 'item 1',
    },
  ])
  ViewletEditorCompletion.dispose(state)

  // TODO
  // EditorCompletion.dispose()
  // expect(EditorCompletion.state.$Completions.isConnected).toBe(false)
  // expect(
  //   Main.state.activeEditorState.$EditorInput.getAttribute(
  //     'aria-activedescendant'
  //   )
  // ).toBeNull()
})

test('focusIndex', () => {
  const state = ViewletEditorCompletion.create()
  const $CompletionItemOne = document.createElement('li')
  $CompletionItemOne.className = 'CompletionItem Focused'
  const $CompletionItemTwo = document.createElement('li')
  state.$Viewlet.append($CompletionItemOne)
  state.$Viewlet.append($CompletionItemTwo)
  ViewletEditorCompletion.focusIndex(state, 0, 1)
  expect($CompletionItemOne.classList.contains('Focused')).toBe(false)
  expect($CompletionItemTwo.classList.contains('Focused')).toBe(true)
})

test('focusIndex - oldIndex is negative', () => {
  const state = ViewletEditorCompletion.create()
  const $CompletionItemOne = document.createElement('li')
  const $CompletionItemTwo = document.createElement('li')
  state.$Viewlet.append($CompletionItemOne)
  state.$Viewlet.append($CompletionItemTwo)
  ViewletEditorCompletion.focusIndex(state, -1, 1)
  expect($CompletionItemOne.classList.contains('Focused')).toBe(false)
  expect($CompletionItemTwo.classList.contains('Focused')).toBe(true)
})

test('focusIndex - newIndex is negative', () => {
  const state = ViewletEditorCompletion.create()
  const $CompletionItemOne = document.createElement('li')
  $CompletionItemOne.className = 'CompletionItem Focused'
  const $CompletionItemTwo = document.createElement('li')
  state.$Viewlet.append($CompletionItemOne)
  state.$Viewlet.append($CompletionItemTwo)
  ViewletEditorCompletion.focusIndex(state, 0, -1)
  expect($CompletionItemOne.classList.contains('Focused')).toBe(false)
  expect($CompletionItemTwo.classList.contains('Focused')).toBe(false)
})

test('move', () => {
  const state = ViewletEditorCompletion.create()
  ViewletEditorCompletion.move(state, 100, 200)
  expect(state.$Viewlet.style.transform).toBe('translate(100px, 200px)')
})
