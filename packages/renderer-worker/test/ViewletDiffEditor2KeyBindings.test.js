import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = /** @type {import('jest-mock').Mock<(...args: readonly any[]) => Promise<any>>} */ (jest.fn())

jest.unstable_mockModule('../src/parts/DiffViewWorker/DiffViewWorker.js', () => {
  return {
    invoke,
  }
})

const ViewletDiffEditor2KeyBindings = await import('../src/parts/ViewletDiffEditor2/ViewletExplorerKeyBindings.js')

beforeEach(() => {
  invoke.mockReset()
})

test('getKeyBindings', async () => {
  invoke.mockResolvedValue([
    {
      key: 2,
      command: 'DiffView.moveCursorDown',
    },
  ])

  expect(await ViewletDiffEditor2KeyBindings.getKeyBindings()).toEqual([
    {
      key: 2,
      command: 'DiffView.moveCursorDown',
    },
  ])
  expect(invoke).toHaveBeenCalledWith('DiffView.getKeyBindings')
})

test('getKeyBindings - command not found', async () => {
  const error = new Error('Command not found DiffView.getKeyBindings')
  error.name = 'CommandNotFoundError'
  invoke.mockRejectedValue(error)

  expect(await ViewletDiffEditor2KeyBindings.getKeyBindings()).toEqual([])
})

test('getKeyBindings - error', async () => {
  const error = new Error('Failed to load diff view worker')
  invoke.mockRejectedValue(error)

  await expect(ViewletDiffEditor2KeyBindings.getKeyBindings()).rejects.toThrow(error)
})
