/**
 * @jest-environment jsdom
 */
import * as ViewletSourceControl from '../src/parts/ViewletSourceControl/ViewletSourceControl.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

const getTextContent = ($Element) => {
  return $Element.textContent
}

const getSimpleList = (state) => {
  const { $ViewletTree } = state
  return Array.from($ViewletTree.children).map(getTextContent)
}

test('create', () => {
  const state = ViewletSourceControl.create()
  expect(state).toBeDefined()
})

test('focus', () => {
  const state = ViewletSourceControl.create()
  Viewlet.mount(document.body, state)
  ViewletSourceControl.focus(state)
  expect(document.activeElement).toBe(state.$ViewSourceControlInput)
})
