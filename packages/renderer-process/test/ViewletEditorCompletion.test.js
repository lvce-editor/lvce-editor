/**
 * @jest-environment jsdom
 */
import * as ViewletEditorCompletion from '../src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js'

const getTextContent = (node) => {
  return node.textContent
}

test('create', () => {
  const state = ViewletEditorCompletion.create()
  expect(state).toBeDefined()
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
