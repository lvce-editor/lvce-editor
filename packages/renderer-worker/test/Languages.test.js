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
  Languages.state.fileNameMap = Object.create(null)
  Languages.state.extensionMap = Object.create(null)
  Languages.state.tokenizerMap = Object.create(null)
  Languages.state.firstLines = []
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

test('getLanguageId - by extension', async () => {
  await Languages.addLanguages([
    {
      id: 'plaintext',
      extensions: ['.txt'],
    },
  ])
  expect(Languages.getLanguageId('/test/index.txt')).toBe('plaintext')
})

test('getLanguageId - by second file extension', async () => {
  await Languages.addLanguages([
    {
      id: 'json',
      extensions: ['.js.map'],
    },
  ])
  expect(Languages.getLanguageId('/test/index.js.map')).toBe('json')
})

test('getLanguageId - by PascalCase file extension', async () => {
  await Languages.addLanguages([
    {
      id: 'dockerfile',
      extensions: ['.dockerfile'],
    },
  ])
  expect(Languages.getLanguageId('/test/test.Dockerfile')).toBe('dockerfile')
})

test('getLanguageId - by file name', async () => {
  await Languages.addLanguages([
    {
      id: 'dockerfile',
      fileNames: ['Dockerfile'],
    },
  ])
  expect(Languages.getLanguageId('Dockerfile')).toBe('dockerfile')
})

test("addLanguage - don't override tokenize path", async () => {
  await Languages.addLanguages([
    {
      id: 'html',
      tokenize: 'src/tokenizeHtml.js',
    },
    {
      id: 'html',
    },
  ])
  expect(Languages.state.tokenizerMap['html']).toBe('src/tokenizeHtml.js')
})

// TODO this could be even more accurate with exact line numbers
// and reading exact extension.json file
test('addLanguage - error - lower case filename property', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  Languages.addLanguage({
    id: 'test',
    filenames: ['Test'],
  })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    `Please use \"fileNames\" instead of \"filenames\" for language test
  1 | {
  2 |   \"id\": \"test\",
> 3 |   \"filenames\": [
    |    ^^^^^^^^^
  4 |     \"Test\"
  5 |   ]
  6 | }
`
  )
  expect(Languages.state.fileNameMap).toEqual({ test: 'test' })
})

test('getLanguageByFirstLine', () => {
  Languages.state.firstLines = [
    {
      regex: '^#!.*\\bnode',
      languageId: 'javascript',
    },
  ]
  expect(Languages.getLanguageIdByFirstLine('#!/usr/bin/env node')).toBe(
    'javascript'
  )
})
