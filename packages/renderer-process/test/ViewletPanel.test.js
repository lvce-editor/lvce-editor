/**
 * @jest-environment jsdom
 */
import * as ViewletPanel from '../src/parts/Viewlet/ViewletPanel.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'
import * as Layout from '../src/parts/Layout/Layout.js'
import { jest } from '@jest/globals'

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
  expect(RendererWorker.send).toHaveBeenCalledWith(['Panel.tabsHandleClick', 0])
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
  expect(state.$PanelTabs.getAttribute('role')).toBe('tablist')
})

test('accessibility - PanelTab should have role tab and tabindex 0', () => {
  const state = ViewletPanel.create()
  ViewletPanel.setTabs(state, [
    'Problems',
    'Output',
    'Debug Console',
    'Terminal',
  ])
  const $PanelTabProblems = state.$PanelTabs.children[0]
  expect($PanelTabProblems.getAttribute('role')).toBe('tab')
  expect($PanelTabProblems.getAttribute('tabindex')).toBe('-1')
})
