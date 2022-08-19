import * as ExtensionHostCommand from '../src/parts/ExtensionHostCommand/ExtensionHostCommand.js'

beforeEach(() => {
  ExtensionHostCommand.reset()
})

test('registerCommand - no argument provided', () => {
  expect(() => ExtensionHostCommand.registerCommand()).toThrowError(
    new Error('Failed to register command: command is not defined')
  )
})

test('registerCommand - missing id', () => {
  expect(() =>
    ExtensionHostCommand.registerCommand({
      execute() {},
    })
  ).toThrowError(new Error('Failed to register command: command is missing id'))
})

test('registerCommand - missing execute function', () => {
  expect(() =>
    ExtensionHostCommand.registerCommand({
      id: 'test',
    })
  ).toThrowError(
    new Error('Failed to register command: command is missing execute function')
  )
})

test('executeCommand - not found', async () => {
  await expect(
    ExtensionHostCommand.executeCommand('xyz', 'abc')
  ).rejects.toThrowError(
    new Error('Failed to execute command: command xyz not found')
  )
})

test('executeCommand - error', async () => {
  ExtensionHostCommand.registerCommand({
    id: 'xyz',
    execute(query) {
      throw new TypeError('x is not a function')
    },
  })
  await expect(
    ExtensionHostCommand.executeCommand('xyz', 'abc')
  ).rejects.toThrowError(
    new Error('Failed to execute command: x is not a function')
  )
})
