/* eslint-disable jest/no-restricted-jest-methods -- Isolate the Explorer worker transport and legacy view lookup. */
import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (..._args: readonly any[]): Promise<any> => [])
jest.unstable_mockModule('../src/parts/ExplorerViewWorker/ExplorerViewWorker.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ getState: (): { uid: number } => ({ uid: 999 }) }))
const { getMenuEntries } = await import('../src/parts/MenuEntriesExplorer/MenuEntriesExplorer.js')

test('queries the Explorer that opened the menu instead of the last Explorer instance', async () => {
  await getMenuEntries(42)
  await getMenuEntries(43)
  expect(invoke).toHaveBeenNthCalledWith(1, 'Explorer.getMenuEntries2', 42)
  expect(invoke).toHaveBeenNthCalledWith(2, 'Explorer.getMenuEntries2', 43)
})

test('keeps legacy menus without a view owner working', async () => {
  await getMenuEntries(undefined)
  expect(invoke).toHaveBeenLastCalledWith('Explorer.getMenuEntries2', 999)
})

test('routes Explorer commands to their owning view and preserves separators and other commands', async () => {
  const separator = { flags: 1 }
  const workspaceEntry = { command: 'Workspace.close' }
  invoke.mockResolvedValue([{ args: ['file.txt'], command: 'Explorer.newFile', label: 'New File...' }, separator, workspaceEntry])
  expect(await getMenuEntries(42)).toEqual([
    { args: [42, 'newFile', 'file.txt'], command: 'Viewlet.executeViewletCommand', label: 'New File...' },
    separator,
    workspaceEntry,
  ])
})
