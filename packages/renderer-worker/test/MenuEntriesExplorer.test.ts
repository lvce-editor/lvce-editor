/* eslint-disable jest/no-restricted-jest-methods -- Isolate the Explorer and extension management worker transports. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (..._args: readonly any[]): Promise<any> => ({
  context: { isDirectory: false, uri: 'file:///clicked.js' },
  entries: [],
}))
const invokeExtensions = jest.fn(async (..._args: readonly any[]): Promise<any> => [])
jest.unstable_mockModule('../src/parts/ExplorerViewWorker/ExplorerViewWorker.js', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke: invokeExtensions }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ getState: (): { uid: number } => ({ uid: 999 }) }))
const { getMenuEntries } = await import('../src/parts/MenuEntriesExplorer/MenuEntriesExplorer.js')

beforeEach(() => {
  invoke.mockClear()
  invokeExtensions.mockClear()
  invoke.mockResolvedValue({ context: { isDirectory: false, uri: 'file:///clicked.js' }, entries: [] })
  invokeExtensions.mockResolvedValue([])
})

test('queries the Explorer that opened the menu instead of the last Explorer instance', async () => {
  await getMenuEntries(42)
  await getMenuEntries(43)
  expect(invoke).toHaveBeenNthCalledWith(1, 'Explorer.getContextMenuData', 42)
  expect(invoke).toHaveBeenNthCalledWith(2, 'Explorer.getContextMenuData', 43)
})

test('keeps legacy menus without a view owner working', async () => {
  await getMenuEntries(undefined)
  expect(invoke).toHaveBeenLastCalledWith('Explorer.getContextMenuData', 999)
})

test('routes Explorer commands to their owning view and preserves separators and other commands', async () => {
  const separator = { flags: 1 }
  const workspaceEntry = { command: 'Workspace.close' }
  invoke.mockResolvedValue({
    context: { isDirectory: true, uri: 'file:///workspace' },
    entries: [{ args: ['file.txt'], command: 'Explorer.newFile', label: 'New File...' }, separator, workspaceEntry],
  })
  expect(await getMenuEntries(42)).toEqual([
    { args: [42, 'newFile', 'file.txt'], command: 'Viewlet.executeViewletCommand', label: 'New File...' },
    separator,
    workspaceEntry,
  ])
})

test('queries and executes contributions in the application that opened the menu', async () => {
  const context = { isDirectory: false, uri: 'file:///clicked.js' }
  invoke.mockResolvedValue({ applicationId: 'preview', context, entries: [] })
  const contribution = { args: ['runner.run', context.uri], command: 'ExtensionHost.executeCommand', id: 'run', label: 'Run' }
  invokeExtensions.mockResolvedValue([contribution])
  expect(await getMenuEntries(42)).toEqual([
    { ...contribution, args: ['preview', 'ExtensionHost.executeCommand', 'runner.run', context.uri], command: 'Application.execute' },
  ])
  expect(invokeExtensions).toHaveBeenCalledWith('Extensions.invokeForApplication', 'preview', 'Extensions.getExplorerContextMenuEntries', context)
})
