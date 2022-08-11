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

const ViewletSideBar = await import(
  '../src/parts/ViewletSideBar/ViewletSideBar.js'
)
const Layout = await import('../src/parts/Layout/Layout.js')

// TODO side effect here is bad
beforeAll(() => {
  Layout.state.$SideBar = document.createElement('div')
})

test('create', () => {
  // TODO ideally sidebar and sidebar content html elements should be created and mounted
  // at the same time so that there is only one layout and recalc style
  const state = ViewletSideBar.create()
  expect(state.$SideBar.innerHTML).toBe(
    '<div id="SideBarTitleArea"><h2 id="SideBarTitleAreaTitle"></h2><div id="SideBarTitleAreaButtons"></div></div>'
  )
})

// TODO test loadContent

test('dispose', () => {
  const state = ViewletSideBar.create()
  // TODO what to test?
  ViewletSideBar.dispose(state)
})

test('appendViewlet', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletSideBar.create()
  const $TestViewlet = document.createElement('div')
  $TestViewlet.id = 'TestViewlet'
  ViewletSideBar.appendViewlet(state, 'Test', $TestViewlet)
  const $SideBarContent = state.$SideBarContent
  const $SideBarTitleAreaTitle = state.$SideBarTitleAreaTitle
  expect($SideBarTitleAreaTitle.textContent).toBe('Test')
  expect($SideBarContent).toBe($TestViewlet)
})

test('appendViewlet - a viewlet already exists', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletSideBar.create()
  const $TestViewlet1 = document.createElement('div')
  $TestViewlet1.id = 'TestViewlet1'
  ViewletSideBar.appendViewlet(state, 'Test 1', $TestViewlet1)
  const $TestViewlet2 = document.createElement('div')
  $TestViewlet2.id = 'TestViewlet2'
  ViewletSideBar.appendViewlet(state, 'Test 2', $TestViewlet2)
  const $SideBarContent = state.$SideBarContent
  const $SideBarTitleAreaTitle = state.$SideBarTitleAreaTitle
  expect($SideBarTitleAreaTitle.textContent).toBe('Test 2')
  expect($SideBarContent).toBe($TestViewlet2)
})
