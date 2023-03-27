/**
 * @jest-environment jsdom
 */
import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'

const getTextContent = (node) => {
  return node.textContent
}

const getSimpleList = ($Element) => {
  return Array.from($Element.childNodes).map(getTextContent)
}

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
  expect(getSimpleList(state.$ListItems)).toEqual(['item 1', 'item 2', 'item 3'])

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
  state.$ListItems.append($CompletionItemOne)
  state.$ListItems.append($CompletionItemTwo)
  ViewletEditorCompletion.setFocusedIndex(state, 0, 1)
  expect($CompletionItemOne.classList.contains('Focused')).toBe(false)
  expect($CompletionItemTwo.classList.contains('Focused')).toBe(true)
})

test('focusIndex - oldIndex is negative', () => {
  const state = ViewletEditorCompletion.create()
  const $CompletionItemOne = document.createElement('li')
  const $CompletionItemTwo = document.createElement('li')
  state.$ListItems.append($CompletionItemOne)
  state.$ListItems.append($CompletionItemTwo)
  ViewletEditorCompletion.setFocusedIndex(state, -1, 1)
  expect($CompletionItemOne.classList.contains('Focused')).toBe(false)
  expect($CompletionItemTwo.classList.contains('Focused')).toBe(true)
})

test('focusIndex - newIndex is negative', () => {
  const state = ViewletEditorCompletion.create()
  const $CompletionItemOne = document.createElement('li')
  $CompletionItemOne.className = 'CompletionItem Focused'
  const $CompletionItemTwo = document.createElement('li')
  state.$ListItems.append($CompletionItemOne)
  state.$ListItems.append($CompletionItemTwo)
  ViewletEditorCompletion.setFocusedIndex(state, 0, -1)
  expect($CompletionItemOne.classList.contains('Focused')).toBe(false)
  expect($CompletionItemTwo.classList.contains('Focused')).toBe(false)
})
