import { jest } from '@jest/globals'
import * as ExtensionHostTypeDefinition from '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as ExtensionHost from '../src/parts/ExtensionHost/ExtensionHostCore.js'
import * as Languages from '../src/parts/Languages/Languages.js'

beforeAll(() => {
  ExtensionHost.state.status = ExtensionHost.STATUS_RUNNING
  Languages.state.loaded = true
})

test('executeTypeDefinitionProvider', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHostClosingTag.executeTypeDefinitionProvider':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  expect(
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([])
})

test('executeTypeDefinitionProvider - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHostClosingTag.executeTypeDefinitionProvider':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  // TODO should also revive error constructor if possible
  // TypeError, SyntaxError, ReferenceError
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
