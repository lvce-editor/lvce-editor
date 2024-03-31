import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => {
  return {
    invoke: jest.fn(() => {}),
  }
})

const ExtensionHostQuickPick = await import('../src/parts/ExtensionHostQuickPick/ExtensionHostQuickPick.ts')
const Rpc = await import('../src/parts/Rpc/Rpc.ts')

test('showQuickPick', async () => {
  const getPicks = () => {
    return []
  }
  const toPick = (value) => {
    return value
  }
  expect(
    await ExtensionHostQuickPick.showQuickPick({
      getPicks,
      toPick,
    }),
  ).toEqual(undefined)
  expect(Rpc.invoke).toHaveBeenCalledTimes(1)
  expect(Rpc.invoke).toHaveBeenCalledWith('ExtensionHostQuickPick.show', [])
})
