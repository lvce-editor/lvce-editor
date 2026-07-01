import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn()

jest.unstable_mockModule(
  '../src/parts/ProcessExplorerWorker/ProcessExplorerWorker.js',
  () => {
    return {
      invoke,
    }
  },
)

const MenuEntryId = await import('../src/parts/MenuEntryId/MenuEntryId.js')
const ViewletProcessExplorerMenuEntries = await import(
  '../src/parts/ViewletProcessExplorer/ViewletProcessExplorerMenuEntries.js'
)

beforeEach(() => {
  invoke.mockReset()
})

test('getMenus', async () => {
  // @ts-ignore
  invoke.mockResolvedValueOnce([MenuEntryId.ProcessExplorer])

  const menus = await ViewletProcessExplorerMenuEntries.getMenus()

  expect(invoke).toHaveBeenCalledWith('ProcessExplorer.getMenuEntryIds')
  expect(menus).toHaveLength(1)
  expect(menus[0].id).toBe(MenuEntryId.ProcessExplorer)

  const props = {
    index: 0,
    menuId: MenuEntryId.ProcessExplorer,
  }
  const entries = [
    {
      command: 'ProcessExplorer.killProcess',
      flags: 0,
      id: 'killProcess',
      label: 'Kill Process',
    },
  ]
  // @ts-ignore
  invoke.mockResolvedValueOnce(entries)

  await expect(menus[0].getMenuEntries(7, props)).resolves.toBe(entries)
  expect(invoke).toHaveBeenLastCalledWith(
    'ProcessExplorer.getMenuEntries',
    7,
    props,
  )
})

test('getMenus - fallback menu id', async () => {
  // @ts-ignore
  invoke.mockRejectedValueOnce(new Error('not ready'))

  const menus = await ViewletProcessExplorerMenuEntries.getMenus()

  expect(menus).toHaveLength(1)
  expect(menus[0].id).toBe(MenuEntryId.ProcessExplorer)
})
