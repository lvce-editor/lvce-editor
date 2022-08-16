import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Languages = await import('../src/parts/Languages/Languages.js')
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

beforeEach(() => {
  Languages.state.loaded = false
})

test('getLanguageConfiguration - error - languages must be loaded before requesting language configuration', async () => {
  Languages.state.loaded = true
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'ExtensionHost.getLanguageConfiguration':
        return {
          comments: {
            blockComment: ['<!--', '-->'],
          },
        }
      default:
        throw new Error('unexpected message')
    }
  })
  expect(
    await Languages.getLanguageConfiguration({
      uri: '',
      languageId: 'html',
    })
  ).toEqual({
    comments: {
      blockComment: ['<!--', '-->'],
    },
  })
})

test('getLanguageConfiguration - error - languages must be loaded before requesting language configuration', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'ExtensionHost.getLanguageConfiguration':
        return {
          comments: {
            blockComment: ['<!--', '-->'],
          },
        }
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(Languages.getLanguageConfiguration('html')).rejects.toThrowError(
    new Error(
      'languages must be loaded before requesting language configuration'
    )
  )
})

test.skip('hydrate', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'ExtensionHost.getLanguages':
        return {
          id: 'html',
          extensions: ['.html'],
          tokenize: '/tmp/src/tokenizeHtml.js',
          configuration: '/tmp/languageConfiguration.json',
        }
      default:
        throw new Error('unexpected message')
    }
  })
  await Languages.hydrate()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionHost.getLanguages'
  )
})

test('getLanguageId - by extension', () => {
  Languages.state.languages = [
    {
      id: 'plaintext',
      extensions: ['.txt'],
    },
  ]
  expect(Languages.getLanguageId('/test/index.txt')).toBe('plaintext')
})

test('getLanguageId - by file name', () => {
  Languages.state.languages = [
    {
      id: 'dockerfile',
      fileNames: ['Dockerfile'],
    },
  ]
  expect(Languages.getLanguageId('Dockerfile')).toBe('dockerfile')
})
