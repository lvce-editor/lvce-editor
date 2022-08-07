import * as ViewletDebugConsole from '../src/parts/ViewletDebugConsole/ViewletDebugConsole.js'

test('name', () => {
  expect(ViewletDebugConsole.name).toBe('Debug Console')
})

test('create', () => {
  const state = ViewletDebugConsole.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletDebugConsole.create()
  expect(await ViewletDebugConsole.loadContent(state)).toEqual({
    disposed: false,
  })
})

test('dispose', () => {
  const state = ViewletDebugConsole.create()
  expect(ViewletDebugConsole.dispose(state)).toEqual({
    disposed: true,
  })
})
