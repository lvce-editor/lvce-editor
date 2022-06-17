/**
 * @jest-environment jsdom
 */
import * as Layout from '../src/parts/Layout/Layout.js'
import * as ViewletTitleBar from '../src/parts/Viewlet/ViewletTitleBar.js'

const getTextContent = (node) => {
  return node.innerHTML
}

const getSimpleList = ($TitleBar) => {
  return Array.from($TitleBar.children[0].children[0].children).map(
    getTextContent
  )
}

beforeAll(() => {
  Layout.state.$TitleBar = document.createElement('div')
})

test.skip('create', () => {
  const titleBarEntries = [
    {
      id: 'file',
      name: 'File',
      children: [],
    },
    {
      id: 'edit',
      name: 'Edit',
      children: [],
    },
    {
      id: 'selection',
      name: 'Selection',
      children: [],
    },
  ]
  ViewletTitleBar.create(titleBarEntries)
  expect(getSimpleList(Layout.state.$TitleBar)).toEqual([
    'File',
    'Edit',
    'Selection',
  ])
})

test.skip('focus', () => {
  const titleBarEntries = [
    {
      id: 'file',
      name: 'File',
      children: [],
    },
    {
      id: 'edit',
      name: 'Edit',
      children: [],
    },
    {
      id: 'selection',
      name: 'Selection',
      children: [],
    },
  ]
  ViewletTitleBar.hydrate(titleBarEntries)
  document.body.append(Layout.state.$TitleBar)
  ViewletTitleBar.focus()
  expect(document.activeElement).toBe(
    ViewletTitleBar.state.$TitleBarMenu.firstChild
  )
})

test.skip('accessibility - title bar should have role of contentinfo', () => {
  ViewletTitleBar.create()
  expect(Layout.state.$TitleBar.getAttribute('role')).toBe('contentinfo')
})
