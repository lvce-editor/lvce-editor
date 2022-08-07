import * as MenuEntries from '../src/parts/MenuEntries/MenuEntries.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

test.skip('getMenuEntries - activityBar', async () => {
  expect(await MenuEntries.getMenuEntries('activityBar')).toBeInstanceOf(Array)
})

test('getMenuEntries - edit', async () => {
  expect(await MenuEntries.getMenuEntries('edit')).toBeInstanceOf(Array)
})

test('getMenuEntries - editor', async () => {
  expect(await MenuEntries.getMenuEntries('editor')).toBeInstanceOf(Array)
})

test('getMenuEntries - explorer', async () => {
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: -1,
      dirents: [],
    },
  })
  expect(await MenuEntries.getMenuEntries('explorer')).toBeInstanceOf(Array)
})

test('getMenuEntries - file', async () => {
  expect(await MenuEntries.getMenuEntries('file')).toBeInstanceOf(Array)
})

test('getMenuEntries - go', async () => {
  expect(await MenuEntries.getMenuEntries('go')).toBeInstanceOf(Array)
})

test('getMenuEntries - help', async () => {
  expect(await MenuEntries.getMenuEntries('help')).toBeInstanceOf(Array)
})

test('getMenuEntries - manageExtension', async () => {
  expect(await MenuEntries.getMenuEntries('manageExtension')).toBeInstanceOf(
    Array
  )
})

test.skip('getMenuEntries - openRecent', async () => {
  expect(await MenuEntries.getMenuEntries('openRecent')).toBeInstanceOf(Array)
})

test('getMenuEntries - run', async () => {
  expect(await MenuEntries.getMenuEntries('run')).toBeInstanceOf(Array)
})

test('getMenuEntries - settings', async () => {
  expect(await MenuEntries.getMenuEntries('settings')).toBeInstanceOf(Array)
})

test('getMenuEntries - selection', async () => {
  expect(await MenuEntries.getMenuEntries('selection')).toBeInstanceOf(Array)
})

test('getMenuEntries - tab', async () => {
  expect(await MenuEntries.getMenuEntries('tab')).toBeInstanceOf(Array)
})

test('getMenuEntries - terminal', async () => {
  expect(await MenuEntries.getMenuEntries('terminal')).toBeInstanceOf(Array)
})

test('getMenuEntries - titleBar', async () => {
  expect(await MenuEntries.getMenuEntries('titleBar')).toBeInstanceOf(Array)
})

test('getMenuEntries - view', async () => {
  expect(await MenuEntries.getMenuEntries('view')).toBeInstanceOf(Array)
})

test('getMenuEntries - invalid id', async () => {
  await expect(MenuEntries.getMenuEntries('non-existing')).rejects.toThrowError(
    'module not found "non-existing"'
  )
})
