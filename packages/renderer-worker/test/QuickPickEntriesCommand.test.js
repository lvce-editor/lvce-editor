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

const QuickPickEntriesCommand = await import(
  '../src/parts/QuickPickEntriesCommand/QuickPickEntriesCommand.js'
)

const ExtensionHostCommands = await import(
  '../src/parts/ExtensionHost/ExtensionHostCommands.js'
)
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)
const Command = await import('../src/parts/Command/Command.js')

test('name', () => {
  expect(QuickPickEntriesCommand.name).toBe('command')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesCommand.getPlaceholder()).toBeDefined()
})

test.skip('getHelpEntries', () => {
  // @ts-ignore
  expect(QuickPickEntriesCommand.getHelpEntries()).toEqual([
    {
      category: 'global commands',
      description: 'Go to file',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickEntriesCommand.getNoResults()).toEqual({
    label: 'No matching results',
  })
})

test('getPicks', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    return []
  })
  await expect(QuickPickEntriesCommand.getPicks()).resolves.toEqual([])
})

test('selectPick', async () => {
  // @ts-ignore
  ExtensionHostCommands.executeCommand.mockImplementation(() => {})
  expect(
    await QuickPickEntriesCommand.selectPick({
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

  await expect(() => QuickPickEntriesCommand.selectPick({})).toThrowError(
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
    await QuickPickEntriesCommand.selectPick({
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
