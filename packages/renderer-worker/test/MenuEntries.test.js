import * as MenuEntries from '../src/parts/MenuEntries/MenuEntries.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

// TODO mock external modules for unit test

test.skip('getMenuEntries - activityBar', async () => {
  expect(
    await MenuEntries.getMenuEntries(MenuEntryId.ActivityBar)
  ).toBeInstanceOf(Array)
})

test('getMenuEntries - edit', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Edit)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - editor', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Editor)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - explorer', async () => {
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  ViewletStates.set('Explorer', {
    state: {
      focusedIndex: -1,
      items: [],
    },
    factory: {},
  })
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Explorer)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - file', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.File)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - go', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Go)).toBeInstanceOf(Array)
})

test('getMenuEntries - help', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Help)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - manageExtension', async () => {
  expect(
    await MenuEntries.getMenuEntries(MenuEntryId.ManageExtension)
  ).toBeInstanceOf(Array)
})

test.skip('getMenuEntries - openRecent', async () => {
  expect(
    await MenuEntries.getMenuEntries(MenuEntryId.OpenRecent)
  ).toBeInstanceOf(Array)
})

test('getMenuEntries - run', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Run)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - settings', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Settings)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - selection', async () => {
  expect(
    await MenuEntries.getMenuEntries(MenuEntryId.Selection)
  ).toBeInstanceOf(Array)
})

test.skip('getMenuEntries - tab', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Tab)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - terminal', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.Terminal)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - titleBar', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.TitleBar)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - view', async () => {
  expect(await MenuEntries.getMenuEntries(MenuEntryId.View)).toBeInstanceOf(
    Array
  )
})

test('getMenuEntries - invalid id', async () => {
  await expect(MenuEntries.getMenuEntries(-1)).rejects.toThrowError(
    'module not found "-1"'
  )
})
