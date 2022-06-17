import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostCore.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostManagement.js',
  () => {
    return {
      activateByEvent: jest.fn(),
    }
  }
)

const ExtensionHostRename = await import(
  '../src/parts/ExtensionHost/ExtensionHostRename.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executePrepareRenameProvider - no result', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostRename.executePrepareRenameProvider({ id: 1 }, 0)
  ).toEqual([])
})

test('executePrepareRenameProvider - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostRename.executePrepareRenameProvider({ id: 1 }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('executeRenameProvider - no result', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return []
  })
  expect(await ExtensionHostRename.executeRenameProvider({ id: 1 }, 0)).toEqual(
    []
  )
})

test('executeRenameProvider - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostRename.executeRenameProvider({ id: 1 }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
