/**
 * @jest-environment jsdom
 */
import * as ViewletOutput from '../src/parts/ViewletOutput/ViewletOutput.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

const getText = ($Node) => {
  return $Node.textContent
}

const getSimpleList = (state) => {
  const { $Content } = state
  return Array.from($Content.children).map(getText)
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
  // @ts-ignore
  expect($Content.role).toBe('log')
})

test('accessibility - select should have an aria label', () => {
  const state = ViewletOutput.create()
  const { $Select } = state
  expect($Select.ariaLabel).toBe('Select a Log')
})

test('setText', () => {
  const state = ViewletOutput.create()
  ViewletOutput.setLines(state, 'line 1')
  expect(getSimpleList(state)).toEqual(['line 1'])
  ViewletOutput.setLines(state, 'line 2')
  expect(getSimpleList(state)).toEqual(['line 1', 'line 2'])
})

test('focus', () => {
  const state = ViewletOutput.create()
  Viewlet.mount(document.body, state)
  ViewletOutput.focus(state)
  const { $Content } = state
  expect(document.activeElement).toBe($Content)
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
