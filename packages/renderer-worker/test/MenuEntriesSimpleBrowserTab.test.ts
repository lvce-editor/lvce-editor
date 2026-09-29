import { beforeEach, expect, test } from '@jest/globals'
import * as MenuEntriesSimpleBrowserTab from '../src/parts/MenuEntriesSimpleBrowserTab/MenuEntriesSimpleBrowserTab.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

beforeEach(() => {
  ViewletStates.reset()
})

const setSimpleBrowserState = (tabs: readonly Readonly<{ muted: boolean }>[]): void => {
  const state = { tabs, uid: 42 }
  ViewletStates.set('SimpleBrowser', {
    factory: {},
    moduleId: 'SimpleBrowser',
    renderedState: state,
    state,
  })
}

test('returns tab commands targeted at the originating viewlet and tab', () => {
  setSimpleBrowserState([{ muted: false }, { muted: false }, { muted: false }])

  const entries = MenuEntriesSimpleBrowserTab.getMenuEntries(42, 1)

  expect(entries.map((entry) => entry.label)).toEqual([
    'Mute Tab',
    'Duplicate Tab',
    'Reload Tab',
    '',
    'Close Tab',
    'Close Tabs to the Left',
    'Close Tabs to the Right',
    'Close Other Tabs',
  ])
  expect(entries[0]).toMatchObject({ args: [42, 'muteTab', 1], command: 'Viewlet.executeViewletCommand', flags: MenuItemFlags.None })
  expect(entries[5]).toMatchObject({ args: [42, 'closeTabsToTheLeft', 1], flags: MenuItemFlags.None })
  expect(entries[6]).toMatchObject({ args: [42, 'closeTabsToTheRight', 1], flags: MenuItemFlags.None })
  expect(entries[7]).toMatchObject({ args: [42, 'closeOtherTabs', 1], flags: MenuItemFlags.None })
})

test('shows Unmute Tab for muted tabs', () => {
  setSimpleBrowserState([{ muted: true }])

  const entries = MenuEntriesSimpleBrowserTab.getMenuEntries(42, 0)

  expect(entries[0]).toMatchObject({ args: [42, 'muteTab', 0], label: 'Unmute Tab' })
})

test('disables close commands that have no matching tabs', () => {
  setSimpleBrowserState([{ muted: false }])

  const entries = MenuEntriesSimpleBrowserTab.getMenuEntries(42, 0)

  expect(entries[5].flags).toBe(MenuItemFlags.Disabled)
  expect(entries[6].flags).toBe(MenuItemFlags.Disabled)
  expect(entries[7].flags).toBe(MenuItemFlags.Disabled)
})

test('returns no entries for a stale tab index', () => {
  setSimpleBrowserState([{ muted: false }])

  expect(MenuEntriesSimpleBrowserTab.getMenuEntries(42, 3)).toEqual([])
})
