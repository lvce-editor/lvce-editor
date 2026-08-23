import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: any[]) => Promise<any>>()
const isCreated = jest.fn(() => false)

jest.unstable_mockModule('../src/parts/QuickPickWorker/QuickPickWorker.js', () => ({
  invoke,
  isCreated,
}))

const MenuEntriesState = await import('../src/parts/MenuEntriesState/MenuEntriesState.js')

beforeEach(() => {
  jest.resetAllMocks()
  MenuEntriesState.state.menuEntries = []
})

test('stores menu entries without launching quick pick', async () => {
  const entries = [{ id: 'test.command', label: 'Test Command' }]

  await MenuEntriesState.add(entries)

  expect(MenuEntriesState.getAll()).toEqual(entries)
  expect(invoke).not.toHaveBeenCalled()
})

test('updates quick pick when it is already running', async () => {
  const entries = [{ id: 'test.command', label: 'Test Command' }]
  isCreated.mockReturnValue(true)

  await MenuEntriesState.add(entries)

  expect(invoke).toHaveBeenCalledWith('QuickPick.addMenuEntries', entries)
})
