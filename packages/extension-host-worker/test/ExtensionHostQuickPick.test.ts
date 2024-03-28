import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.js', () => {
  return {
    invoke: jest.fn(() => {}),
  }
})

const ExtensionHostQuickPick = await import('../src/parts/ExtensionHostQuickPick/ExtensionHostQuickPick.js')
const Rpc = await import('../src/parts/Rpc/Rpc.js')

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
