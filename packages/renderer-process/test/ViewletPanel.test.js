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

const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.js')
const Layout = await import('../src/parts/Layout/Layout.js')

// TODO side effect here is bad
beforeAll(() => {
  Layout.state.$Panel = document.createElement('div')
})

test('create', () => {
  const state = ViewletPanel.create()
  expect(state).toBeDefined()
})

test('setTabs', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
})

test('event - mousedown - first tab clicked', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$PanelTabs.children[0].dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 1,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Panel.selectIndex', 0)
})

test('event - mousedown - no tab clicked', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$PanelTabs.dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 1,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('accessibility - PanelTabs should have role tablist', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
  // @ts-ignore
  expect(state.$PanelTabs.role).toBe('tablist')
})

test('accessibility - PanelTab should have role tab', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
  const $PanelTabProblems = state.$PanelTabs.children[0]
  // @ts-ignore
  expect($PanelTabProblems.role).toBe('tab')
})

test('setSelectedIndex', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
  ViewletPanel.setSelectedIndex(state, -1, 0)
  expect(state.$PanelTabs.getAttribute('aria-activedescendant')).toBe(
    'PanelTab-1'
  )
})
