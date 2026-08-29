import { expect, jest, test } from '@jest/globals'
import { revealInExplorerWithDependencies } from '../src/parts/RevealInExplorer/RevealInExplorer.ts'

test('shows the Explorer sidebar before revealing the uri in the newest Explorer view', async () => {
  const invocations: unknown[][] = []
  const dependencies = {
    executeCommand: jest.fn(async (...args: unknown[]): Promise<void> => {
      invocations.push(args)
    }),
    executeViewletCommand: jest.fn(async (...args: unknown[]): Promise<void> => {
      invocations.push(args)
    }),
    getAllStates: jest.fn(() => ({
      explorerNew: { parentUid: 4, uid: 12 },
      explorerOld: { parentUid: 4, uid: 8 },
      layout: { uid: 2 },
      sideBar: { currentViewletId: 'Explorer', uid: 4 },
    })),
  }

  await revealInExplorerWithDependencies('/workspace/src/file.ts', dependencies)

  expect(invocations).toEqual([
    ['Layout.showSideBar', 'Explorer'],
    [12, 'revealItem', '/workspace/src/file.ts'],
  ])
})

test('throws when the Explorer sidebar cannot be found', async () => {
  const dependencies = {
    executeCommand: jest.fn(async (): Promise<void> => {}),
    executeViewletCommand: jest.fn(async (): Promise<void> => {}),
    getAllStates: jest.fn(() => ({})),
  }

  await expect(revealInExplorerWithDependencies('/workspace/src/file.ts', dependencies)).rejects.toThrow('Explorer sidebar not found')
})

test('throws when the Explorer view cannot be found', async () => {
  const dependencies = {
    executeCommand: jest.fn(async (): Promise<void> => {}),
    executeViewletCommand: jest.fn(async (): Promise<void> => {}),
    getAllStates: jest.fn(() => ({
      sideBar: { currentViewletId: 'Explorer', uid: 4 },
    })),
  }

  await expect(revealInExplorerWithDependencies('/workspace/src/file.ts', dependencies)).rejects.toThrow('Explorer view not found')
})
