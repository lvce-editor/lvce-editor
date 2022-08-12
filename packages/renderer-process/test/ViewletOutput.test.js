/**
 * @jest-environment jsdom
 */
import * as ViewletOutput from '../src/parts/ViewletOutput/ViewletOutput.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

const getSimpleList = (state) => {
  return Array.from(state.content.children).map((node) => node.textContent)
}

test('name', () => {
  expect(ViewletOutput.name).toBe('Output')
})

test('create', () => {
  const state = ViewletOutput.create()
  expect(state).toBeDefined()
})

test('setOptions', () => {
  const state = ViewletOutput.create()
  ViewletOutput.setOptions(state, [
    {
      name: 'Shared Process',
      file: '/tmp/log-shared-process.txt',
    },
    {
      name: 'Extension Host',
      file: '/tmp/log-extension-host.txt',
    },
  ])
  expect(state.$Select.children).toHaveLength(2)
  expect(state.$Select.children[0].textContent).toBe('Shared Process')
  expect(state.$Select.children[1].textContent).toBe('Extension Host')
})

test('accessibility - should have role log', () => {
  const state = ViewletOutput.create()
  // @ts-ignore
  expect(state.$Content.role).toBe('log')
})

test('append', () => {
  const state = ViewletOutput.create()
  ViewletOutput.append(state, 'line 1')
  expect(getSimpleList(state)).toEqual(['line 1'])
  ViewletOutput.append(state, 'line 2')
  expect(getSimpleList(state)).toEqual(['line 1', 'line 2'])
})

test('clear', () => {
  const state = ViewletOutput.create()
  ViewletOutput.clear(state)
  expect(getSimpleList(state)).toEqual([])
})

test('focus', () => {
  const state = ViewletOutput.create()
  Viewlet.mount(document.body, state)
  ViewletOutput.focus(state)
  expect(document.activeElement).toBe(state.$ViewletOutputContent)
})

test('handleError', () => {
  const state = ViewletOutput.create()
  ViewletOutput.handleError(state, 'Error: test error')
  expect(state.$Viewlet.textContent).toBe('Error: test error')
})

test('accessibility - ViewletOutputContent should have role log', () => {
  const state = ViewletOutput.create()
  // @ts-ignore
  expect(state.$Content.role).toBe('log')
})
