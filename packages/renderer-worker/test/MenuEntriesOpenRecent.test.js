import { jest } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RecentlyOpened/RecentlyOpened.js',
  () => {
    return {
      getRecentlyOpened: jest.fn(),
    }
  }
)

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(),
  }
})

const MenuEntriesOpenRecent = await import(
  '../src/parts/MenuEntriesOpenRecent/MenuEntriesOpenRecent.js'
)
const RecentlyOpened = await import(
  '../src/parts/RecentlyOpened/RecentlyOpened.js'
)
const Command = await import('../src/parts/Command/Command.js')

test('getMenuEntries', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return ['/workspace/folder-1', '/workspace/folder-2']
  })
  const menuEntries = await MenuEntriesOpenRecent.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Workspace.setPath',
    flags: MenuItemFlags.None,
    label: '/workspace/folder-1',
    args: ['/workspace/folder-1'],
  })
  expect(menuEntries).toContainEqual({
    command: 'Workspace.setPath',
    flags: MenuItemFlags.None,
    label: '/workspace/folder-2',
    args: ['/workspace/folder-2'],
  })
})

test('getMenuEntries - should not show separator when there are no recent items', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return []
  })
  const menuEntries = await MenuEntriesOpenRecent.getMenuEntries()
  expect(menuEntries[0]).toEqual({
    args: ['QuickPick', 'recent'],
    command: 'Viewlet.openWidget',
    flags: 0,
    id: 'more',
    label: 'More ...',
  })
})

test('getMenuEntries - error with recently opened', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(MenuEntriesOpenRecent.getMenuEntries()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
