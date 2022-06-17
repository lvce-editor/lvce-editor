/**
 * @jest-environment jsdom
 */
import * as EditorGroup from '../src/parts/EditorGroup/EditorGroup.js'
import * as Layout from '../src/parts/Layout/Layout.js'

beforeAll(() => {
  Layout.state.$Main = document.createElement('div')
})

test('create', () => {
  const state = EditorGroup.create()
  expect(state).toBeDefined()
})

test.skip('replace', () => {
  const state = EditorGroup.create()
  const createEditor = (index) => {
    const $Editor = document.createElement('div')
    $Editor.className = `Editor-${index}`
    return $Editor
  }
  // @ts-ignore
  EditorGroup.replaceOne(state, 'file1', createEditor(1))
  expect(state.$EditorTabs.children).toHaveLength(1)
  expect(state.$EditorTabs.firstChild.textContent).toBe('file1')
  expect(state.$Editors.children).toHaveLength(1)
  // @ts-ignore
  expect(state.$Editors.firstChild.className).toBe('Editor-1')
  // @ts-ignore
  EditorGroup.replaceOne(state, 'file2', createEditor(2))
  expect(state.$EditorTabs.children).toHaveLength(1)
  expect(state.$EditorTabs.firstChild.textContent).toBe('file2')
  expect(state.$Editors.children).toHaveLength(1)
  // @ts-ignore
  expect(state.$Editors.firstChild.className).toBe('Editor-2')
  // @ts-ignore
  EditorGroup.replaceOne(state, 'file3', createEditor(3))
  expect(state.$EditorTabs.children).toHaveLength(1)
  expect(state.$EditorTabs.firstChild.textContent).toBe('file3')
  expect(state.$Editors.children).toHaveLength(1)
  // @ts-ignore
  expect(state.$Editors.firstChild.className).toBe('Editor-3')
})
