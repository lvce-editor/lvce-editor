import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProviders: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostRename = await import(
  '../src/parts/ExtensionHost/ExtensionHostRename.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executePrepareRenameProvider - no result', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return []
  })
  expect(
    await ExtensionHostRename.executePrepareRenameProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toEqual([])
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledWith({
    combineResults: expect.any(Function),
    event: 'onRename:test',
    method: 'ExtensionHostRename.executePrepareRename',
    noProviderFoundMessage: 'No rename provider found',
    params: [1, 0],
  })
})

test('executePrepareRenameProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostRename.executePrepareRenameProvider({ id: 1 }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('executeRenameProvider - no result', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return []
  })
  expect(await ExtensionHostRename.executeRenameProvider({ id: 1 }, 0)).toEqual(
    []
  )
})

test('executeRenameProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostRename.executeRenameProvider({ id: 1 }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
