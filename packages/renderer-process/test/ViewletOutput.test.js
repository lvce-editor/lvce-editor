/**
 * @jest-environment jsdom
 */
import * as ViewletOutput from '../src/parts/ViewletOutput/ViewletOutput.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

const getSimpleList = (state) => {
  return state.content.textContent
}

test('create', () => {
  const state = ViewletOutput.create()
  expect(state).toBeDefined()
})

test('setOptions', () => {
  const state = ViewletOutput.create()
  ViewletOutput.setOptions(state, [
    {
      name: 'Shared Process',
      file: '/test/log-shared-process.txt',
    },
    {
      name: 'Extension Host',
      file: '/test/log-extension-host.txt',
    },
  ])
  const { $Select } = state
  expect($Select.children).toHaveLength(2)
  expect($Select.children[0].textContent).toBe('Shared Process')
  expect($Select.children[1].textContent).toBe('Extension Host')
})

test('accessibility - should have role log', () => {
  const state = ViewletOutput.create()
  const { $Content } = state
  expect($Content.role).toBe('log')
})

test('setText', () => {
  const state = ViewletOutput.create()
  ViewletOutput.setText(state, 'line 1')
  expect(getSimpleList(state)).toBe('line 1')
  ViewletOutput.setText(state, 'line 1\nline 2')
  expect(getSimpleList(state)).toBe('line 1\nline 2')
})

test('clear', () => {
  const state = ViewletOutput.create()
  ViewletOutput.clear(state)
  expect(getSimpleList(state)).toBe('')
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
  expect(state.$Content.role).toBe('log')
})
