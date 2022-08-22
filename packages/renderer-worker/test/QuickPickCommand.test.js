import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostCommands.js',
  () => {
    return {
      executeCommand: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    showErrorDialog: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const QuickPickCommand = await import(
  '../src/parts/QuickPick/QuickPickCommand.js'
)

const ExtensionHostCommands = await import(
  '../src/parts/ExtensionHost/ExtensionHostCommands.js'
)
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)
const Command = await import('../src/parts/Command/Command.js')

test('name', () => {
  expect(QuickPickCommand.name).toBe('command')
})

test('getPlaceholder', () => {
  expect(QuickPickCommand.getPlaceholder()).toBeDefined()
})

test.skip('getHelpEntries', () => {
  // @ts-ignore
  expect(QuickPickCommand.getHelpEntries()).toEqual([
    {
      category: 'global commands',
      description: 'Go to file',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickCommand.getNoResults()).toEqual({
    label: 'No matching results',
  })
})

test('getPicks', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return []
  })
  await expect(QuickPickCommand.getPicks()).resolves.toEqual([])
})

test('selectPick', async () => {
  // @ts-ignore
  ExtensionHostCommands.executeCommand.mockImplementation(() => {})
  expect(
    await QuickPickCommand.selectPick({
      id: 'ext.xyz',
      label: 'xyz',
    })
  ).toEqual({
    command: 'hide',
  })
  expect(ExtensionHostCommands.executeCommand).toHaveBeenCalledTimes(1)
  expect(ExtensionHostCommands.executeCommand).toHaveBeenCalledWith('xyz')
})

test('selectPick - error - selected item has no id', async () => {
  // @ts-ignore
  ExtensionHostCommands.executeCommand.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  ErrorHandling.showErrorDialog.mockImplementation(() => {})

  await expect(QuickPickCommand.selectPick({})).rejects.toThrowError(
    new TypeError(`Cannot read properties of undefined (reading 'startsWith')`)
  )
})

test('selectPick - error', async () => {
  // @ts-ignore
  ExtensionHostCommands.executeCommand.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  ErrorHandling.showErrorDialog.mockImplementation(() => {})

  expect(
    await QuickPickCommand.selectPick({
      id: 'ext.xyz',
      label: 'xyz',
    })
  ).toEqual({
    command: 'hide',
  })
  expect(ErrorHandling.showErrorDialog).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.showErrorDialog).toHaveBeenCalledWith(
    new TypeError('x is not a function')
  )
})
