import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as ExtensionHostLanguages from '../src/parts/ExtensionManagement/ExtensionManagementLanguages.js'
import * as ExtensionManagement from '../src/parts/ExtensionManagement/ExtensionManagement.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('getLanguages', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.plaintext',
        languages: [
          {
            id: 'plaintext',
            label: 'Plaintext',
            tokenize: 'src/tokenizePlainText.js',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  expect(await ExtensionHostLanguages.getLanguages()).toEqual([
    {
      id: 'plaintext',
      label: 'Plaintext',
      tokenize: `/remote/${pathToFileURL(
        join(tmpDir, 'src/tokenizePlainText.js')
      )
        .toString()
        .slice(8)}`,
    },
  ])
})

// TODO
test('getLanguages - error - property languages is not of type array', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.plaintext',
        languages: {},
        path: tmpDir,
      },
    ]
  }
  // TODO should handle error gracefully
  await expect(ExtensionHostLanguages.getLanguages()).rejects.toThrowError(
    new TypeError('extension.languages.map is not a function')
  )
})

test('getLanguages - language without tokenize property', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.icon-theme-test',
        languages: [
          {
            id: 'plaintext',
            label: 'Plaintext',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  expect(await ExtensionHostLanguages.getLanguages()).toEqual([
    {
      id: 'plaintext',
      label: 'Plaintext',
    },
  ])
})

test('getLanguages - error - property tokenize is of type array', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.test',
        languages: [
          {
            id: 'python',
            extensions: ['.py'],
            configuration: './languageConfiguration.json',
            tokenize: ['src/tokenizePython.js'],
          },
        ],
        path: tmpDir,
      },
    ]
  }
  expect(await ExtensionHostLanguages.getLanguages()).toEqual([
    {
      configuration: './languageConfiguration.json',
      extensions: ['.py'],
      id: 'python',
      tokenize: '',
    },
  ])
})

test('getLanguageConfiguration', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(
    join(tmpDir, 'languageConfiguration.json'),
    `{
    "comments": {
      "lineComment": "//",
      "blockComment": ["/*", "*/"]
    }
}
`
  )

  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.javascript',
        languages: [
          {
            id: 'javascript',
            extensions: ['.js'],
            tokenize: 'src/tokenizeJavaScript.js',
            configuration: './languageConfiguration.json',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  expect(
    await ExtensionHostLanguages.getLanguageConfiguration('javascript')
  ).toEqual({
    comments: {
      blockComment: ['/*', '*/'],
      lineComment: '//',
    },
  })
})
test('getLanguageConfiguration - error - language configuration not found', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.javascript',
        languages: [
          {
            id: 'javascript',
            extensions: ['.js'],
            tokenize: 'src/tokenizeJavaScript.js',
            configuration: './languageConfiguration.json',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  const languageConfigurationPath = join(tmpDir, 'languageConfiguration.json')
  await expect(
    ExtensionHostLanguages.getLanguageConfiguration('javascript')
  ).rejects.toThrowError(
    new Error(
      `Failed to load language configuration for javascript: ENOENT: no such file or directory, open '${languageConfigurationPath}'`
    )
  )
})

test('getLanguageConfiguration - error - language configuration has invalid json', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'languageConfiguration.json'), '{')
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.javascript',
        languages: [
          {
            id: 'javascript',
            extensions: ['.js'],
            tokenize: 'src/tokenizeJavaScript.js',
            configuration: './languageConfiguration.json',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  // TODO should display path as well
  await expect(
    ExtensionHostLanguages.getLanguageConfiguration('javascript')
  ).rejects.toThrowError(
    new Error(
      'Failed to load language configuration for javascript: Unexpected end of JSON input while parsing "{"'
    )
  )
})
