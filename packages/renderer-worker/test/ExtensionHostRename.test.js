import { jest } from '@jest/globals'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js',
  () => {
    return {
      execute: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
const ExtensionHostEditor = await import(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js'
)

const ExtensionHostRename = await import(
  '../src/parts/ExtensionHost/ExtensionHostRename.js'
)

test('executePrepareRenameProvider - no result', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  const editor = { id: 1, languageId: 'test' }

  expect(
    await ExtensionHostRename.executePrepareRenameProvider(editor, 0)
  ).toEqual([])
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    combineResults: expect.any(Function),
    event: ExtensionHostActivationEvent.OnRename,
    method: 'ExtensionHostRename.executePrepareRename',
    noProviderFoundMessage: 'No rename provider found',
    args: [0],
  })
})

test('executePrepareRenameProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostRename.executePrepareRenameProvider({ id: 1 }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('executeRenameProvider - no result', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return []
  })
  expect(await ExtensionHostRename.executeRenameProvider({ id: 1 }, 0)).toEqual(
    []
  )
})

test('executeRenameProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostRename.executeRenameProvider({ id: 1 }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
