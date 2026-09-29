import { beforeEach, expect, jest, test } from '@jest/globals'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as ExtensionManifestStatus from '../src/parts/ExtensionManifestStatus/ExtensionManifestStatus.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagement.js', () => {
  return {
    getExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getThemeExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostLanguages = await import('../src/parts/ExtensionManagement/ExtensionManagementLanguages.js')

const ExtensionManagement = await import('../src/parts/ExtensionManagement/ExtensionManagement.js')

const getTmpDir = (): any => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test.skip('getLanguages', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.plaintext',
        languages: [
          {
            id: 'plaintext',
            label: 'Plaintext',
            tokenize: 'src/tokenizePlainText.js',
          },
        ],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  expect(await ExtensionHostLanguages.getLanguages()).toEqual([
    {
      extensionPath: expect.any(String),
      id: 'plaintext',
      label: 'Plaintext',
      tokenize: `/remote/${pathToFileURL(join(tmpDir, 'src/tokenizePlainText.js')).toString().slice(8)}`,
    },
  ])
})

// TODO
test.skip('getLanguages - error - property languages is not of type array', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.plaintext',
        languages: {},
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  // TODO should handle error gracefully
  await expect(ExtensionHostLanguages.getLanguages()).rejects.toThrow(new TypeError('extension.languages.map is not a function'))
})

test.skip('getLanguages - language without tokenize property', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.icon-theme-test',
        languages: [
          {
            id: 'plaintext',
            label: 'Plaintext',
          },
        ],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  expect(await ExtensionHostLanguages.getLanguages()).toEqual([
    {
      id: 'plaintext',
      label: 'Plaintext',
    },
  ])
})

test.skip('getLanguages - error - property tokenize is of type array', async () => {
  const tmpDir = await getTmpDir()
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.test',
        languages: [
          {
            configuration: './languageConfiguration.json',
            extensions: ['.py'],
            id: 'python',
            tokenize: ['src/tokenizePython.js'],
          },
        ],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  expect(await ExtensionHostLanguages.getLanguages()).toEqual([
    {
      configuration: './languageConfiguration.json',
      extensionPath: expect.any(String),
      extensions: ['.py'],
      id: 'python',
      tokenize: '',
    },
  ])
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[info] python: language.tokenize must be of type string but was of type object')
})

test.skip('getLanguageConfiguration', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'languageConfiguration.json'),
    `{
    "comments": {
      "lineComment": "//",
      "blockComment": ["/*", "*/"]
    }
}
`,
  )

  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.javascript',
        languages: [
          {
            configuration: './languageConfiguration.json',
            extensions: ['.js'],
            id: 'javascript',
            tokenize: 'src/tokenizeJavaScript.js',
          },
        ],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  expect(await ExtensionHostLanguages.getLanguageConfiguration('javascript')).toEqual({
    comments: {
      blockComment: ['/*', '*/'],
      lineComment: '//',
    },
  })
})

test.skip('getLanguageConfiguration - error - language configuration file not found', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.javascript',
        languages: [
          {
            configuration: './languageConfiguration.json',
            extensions: ['.js'],
            id: 'javascript',
            tokenize: 'src/tokenizeJavaScript.js',
          },
        ],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  const languageConfigurationPath = join(tmpDir, 'languageConfiguration.json')
  await expect(ExtensionHostLanguages.getLanguageConfiguration('javascript')).rejects.toThrow(
    new Error(`Failed to load language configuration for javascript: File not found: '${languageConfigurationPath}'`),
  )
})

test.skip('getLanguageConfiguration - error - language configuration has invalid json', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'languageConfiguration.json'), '{')
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.javascript',
        languages: [
          {
            configuration: './languageConfiguration.json',
            extensions: ['.js'],
            id: 'javascript',
            tokenize: 'src/tokenizeJavaScript.js',
          },
        ],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  // TODO should display path as well
  await expect(ExtensionHostLanguages.getLanguageConfiguration('javascript')).rejects.toThrow(
    new Error(
      `Failed to load language configuration for javascript: Failed to parse json at ${join(
        tmpDir,
        'languageConfiguration.json',
      )}: SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
    ),
  )
})

test.skip('getLanguageConfiguration - error - no language configuration', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.test',
        languages: [],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  expect(await ExtensionHostLanguages.getLanguageConfiguration('test')).toBeUndefined()
})

test.skip('getLanguageConfiguration - error - language is null', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.javascript',
        languages: [null],
        path: tmpDir,
        status: ExtensionManifestStatus.Resolved,
      },
    ]
  })
  await expect(ExtensionHostLanguages.getLanguageConfiguration('test')).rejects.toThrow(
    new Error("Failed to load language configuration for test: TypeError: Cannot read properties of null (reading 'id')"),
  )
})
