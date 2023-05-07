/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.js'
import * as DomAttributeType from '../src/parts/DomAttributeType/DomAttributeType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')
const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.js')

test.skip('event - mousedown - first tab clicked', () => {
  const state = ViewletPanel.create()
  ViewletPanel.attachEvents(state)
  ViewletPanel.setTabs(state, ['Problems', 'Output', 'Debug Console', 'Terminal'])
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

test.skip('event - mousedown - no tab clicked', () => {
  const state = ViewletPanel.create()
  ViewletPanel.attachEvents(state)
  ViewletPanel.setTabs(state, ['Problems', 'Output', 'Debug Console', 'Terminal'])
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

test.skip('accessibility - PanelTabs should have role tablist', () => {
  const state = ViewletPanel.create()
  ViewletPanel.attachEvents(state)
  ViewletPanel.setTabs(state, ['Problems', 'Output', 'Debug Console', 'Terminal'])
  expect(state.$PanelTabs.role).toBe(AriaRoles.TabList)
})

test.skip('accessibility - PanelTab should have role tab', () => {
  const state = ViewletPanel.create()
  ViewletPanel.attachEvents(state)
  ViewletPanel.setTabs(state, ['Problems', 'Output', 'Debug Console', 'Terminal'])
  const $PanelTabProblems = state.$PanelTabs.children[0]
  expect($PanelTabProblems.role).toBe(AriaRoles.Tab)
})

test.skip('setSelectedIndex', () => {
  const state = ViewletPanel.create()
  ViewletPanel.attachEvents(state)
  ViewletPanel.setTabs(state, ['Problems', 'Output', 'Debug Console', 'Terminal'])
  ViewletPanel.setSelectedIndex(state, -1, 0)
  expect(state.$PanelTabs.getAttribute(DomAttributeType.AriaActiveDescendant)).toBe('PanelTab-1')
})
