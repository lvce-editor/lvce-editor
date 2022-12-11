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

test('setButtons', () => {
  const state = ViewletSourceControl.create()
  const { $ViewletTree } = state
  ViewletSourceControl.setChangedFiles(state, [
    {
      label: 'file-1',
      title: '/test/file-1',
      icon: '',
      posInSet: 1,
      setSize: 2,
    },
  ])
  ViewletSourceControl.setItemButtons(state, 0, [
    {
      icon: '/icons/reset.svg',
      label: 'Reset',
    },
    {
      icon: '/icons/add.svg',
      label: 'Add',
    },
  ])
  const $Item = $ViewletTree.children[0]
  const $Button1 = $Item.children[2]
  const $Button2 = $Item.children[3]
  // @ts-ignore
  expect($Button1.children[0].style.maskImage).toBe(`url('/icons/reset.svg')`)
  expect($Button1.ariaLabel).toBe('Reset')
  // @ts-ignore
  expect($Button2.children[0].style.maskImage).toBe(`url('/icons/add.svg')`)
  expect($Button2.ariaLabel).toBe('Add')
})
