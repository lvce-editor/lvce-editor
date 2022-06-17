import { jest } from '@jest/globals'
import * as Languages from '../src/parts/Languages/Languages.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

beforeEach(() => {
  Languages.state.loaded = false
})

test('getLanguageConfiguration - error - languages must be loaded before requesting language configuration', async () => {
  Languages.state.loaded = true
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 'ExtensionHost.getLanguageConfiguration') {
      SharedProcess.state.receive({
        jsonrpc: '2.0',
        id: message.id,
        result: [
          {
            comments: {
              blockComment: ['<!--', '-->'],
            },
          },
        ],
      })
    } else {
      throw new Error('unexpected message')
    }
  })
  expect(
    await Languages.getLanguageConfiguration({
      uri: '',
      languageId: 'html',
    })
  ).toEqual([
    {
      comments: {
        blockComment: ['<!--', '-->'],
      },
    },
  ])
})

test('getLanguageConfiguration - error - languages must be loaded before requesting language configuration', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 'ExtensionHost.getLanguageConfiguration') {
      SharedProcess.state.receive({
        jsonrpc: '2.0',
        id: message.id,
        result: [
          {
            comments: {
              blockComment: ['<!--', '-->'],
            },
          },
        ],
      })
    } else {
      throw new Error('unexpected message')
    }
  })
  await expect(Languages.getLanguageConfiguration('html')).rejects.toThrowError(
    new Error(
      'languages must be loaded before requesting language configuration'
    )
  )
})

test('hydrate', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 'ExtensionHost.getLanguages') {
      SharedProcess.state.receive({
        jsonrpc: '2.0',
        id: message.id,
        result: [
          {
            id: 'html',
            extensions: ['.html'],
            tokenize: '/tmp/src/tokenizeHtml.js',
            configuration: '/tmp/languageConfiguration.json',
          },
        ],
      })
    } else {
      throw new Error('unexpected message')
    }
  })
  await Languages.hydrate()
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ExtensionHost.getLanguages',
    params: [],
  })
})
