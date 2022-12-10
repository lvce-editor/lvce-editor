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

test('setChangedFiles', () => {
  const state = ViewletSourceControl.create()
  ViewletSourceControl.setChangedFiles(state, [
    {
      label: 'file-1',
      title: '/test/file-1',
      icon: '',
      posInSet: 1,
      setSize: 2,
    },
    {
      label: 'file-2',
      title: '/test/file-2',
      icon: '',
      posInSet: 1,
      setSize: 2,
    },
  ])
  expect(getSimpleList(state)).toEqual(['file-1', 'file-2'])
})

test('focus', () => {
  const state = ViewletSourceControl.create()
  Viewlet.mount(document.body, state)
  ViewletSourceControl.focus(state)
  expect(document.activeElement).toBe(state.$ViewSourceControlInput)
})

test('accessibility - SourceControlInput should have aria-label', () => {
  const state = ViewletSourceControl.create()
  const { $ViewSourceControlInput } = state
  expect($ViewSourceControlInput.ariaLabel).toBe('Source Control Input')
})
