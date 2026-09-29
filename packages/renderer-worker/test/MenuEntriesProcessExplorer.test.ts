import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ProcessExplorerWorker/ProcessExplorerWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    getState: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const MenuEntryId = await import('../src/parts/MenuEntryId/MenuEntryId.js')
const ProcessExplorerWorker = await import('../src/parts/ProcessExplorerWorker/ProcessExplorerWorker.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const MenuEntriesProcessExplorer = await import('../src/parts/MenuEntriesProcessExplorer/MenuEntriesProcessExplorer.js')

test('id', () => {
  expect(MenuEntriesProcessExplorer.id).toBe(MenuEntryId.ProcessExplorer)
})

test('getMenuEntries', async () => {
  const menuEntries = [
    {
      id: 'killProcess',
    },
  ]
  // @ts-ignore
  Viewlet.getState.mockReturnValue({
    uid: 42,
  })
  // @ts-ignore
  ProcessExplorerWorker.invoke.mockResolvedValue(menuEntries)

  const result = await MenuEntriesProcessExplorer.getMenuEntries()

  expect(Viewlet.getState).toHaveBeenCalledTimes(1)
  expect(Viewlet.getState).toHaveBeenCalledWith('ProcessExplorer')
  expect(ProcessExplorerWorker.invoke).toHaveBeenCalledTimes(1)
  expect(ProcessExplorerWorker.invoke).toHaveBeenCalledWith('ProcessExplorer.getMenuEntries', 42)
  expect(result).toBe(menuEntries)
})
