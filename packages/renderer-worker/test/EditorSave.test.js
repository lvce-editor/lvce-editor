import { jest } from '@jest/globals'
import * as EditorSave from '../src/parts/EditorCommand/EditorCommandSave.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as ErrorHandling from '../src/parts/ErrorHandling/ErrorHandling.js'

test('editorSave', async () => {
  const editor = {
    uri: '/tmp/some-file.txt',
    lines: ['line 1', 'line 2'],
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorSave.editorSave(editor)).toBe(editor)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: 3,
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: ['/tmp/some-file.txt', 'line 1\nline 2'],
  })
})

test.skip('editorSave - error with fileSystem', async () => {
  const editor = {
    uri: '/tmp/some-file.txt',
    lines: ['line 1', 'line 2'],
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  ErrorHandling.state.handleError = jest.fn()
  await EditorSave.editorSave(editor)
  expect(ErrorHandling.state.handleError).toHaveBeenCalledWith(
    new Error('Failed to save file "/tmp/some-file.txt"') // TODO test error.cause once available in jest
  )
})
