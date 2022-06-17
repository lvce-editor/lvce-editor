import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import * as ExtensionHostColorTheme from '../src/parts/ExtensionHost/ExtensionHostColorTheme.js'
import * as Platform from '../src/parts/Platform/Platform.js'
import * as ExtensionManagement from '../src/parts/ExtensionManagement/ExtensionManagement.js'
import * as JsonFile from '../src/parts/JsonFile/JsonFile.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('getColorThemeNames - empty', async () => {
  const tmpDir = await getTmpDir()
  Platform.state.getExtensionsPath = () => {
    return tmpDir
  }
  Platform.state.getBuiltinExtensionsPath = () => {
    return tmpDir
  }
  expect(await ExtensionHostColorTheme.getColorThemes()).toEqual([])
})

test.skip('getColorThemeJson - theme id contains number', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getThemeExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.test-cobalt2',
        colorThemes: [
          {
            id: 'cobalt2',
            label: 'Cobalt2 Theme',
            path: 'color-theme.json',
          },
        ],
        path: join(tmpDir, 'builtin.theme-cobalt-2'),
      },
    ]
  }
  const colorThemePath = join(
    tmpDir,
    'builtin.theme-cobalt2',
    'color-theme.json'
  )
  await mkdir(dirname(colorThemePath), { recursive: true })
  await writeFile(colorThemePath, '{}')
  expect(await ExtensionHostColorTheme.getColorThemeJson('cobalt2')).toEqual({})
})

test('getColorThemeJson - invalid json', async () => {
  const tmpDir = await getTmpDir()
  Platform.state.getBuiltinExtensionsPath = () => {
    return tmpDir
  }
  await JsonFile.writeJson(
    join(tmpDir, 'builtin.theme-test', 'extension.json'),
    {
      id: 'builtin.test-theme',
      colorThemes: [
        {
          id: 'test-theme',
          label: 'Test Theme',
          path: 'color-theme.json',
        },
      ],
      path: tmpDir,
    }
  )
  const colorThemePath = join(tmpDir, 'builtin.theme-test', 'color-theme.json')
  await writeFile(colorThemePath, '{ 1 }')
  await expect(
    ExtensionHostColorTheme.getColorThemeJson('test-theme')
  ).rejects.toThrowError(
    'Failed to load color theme "test-theme": Unexpected number in JSON at position 2 while parsing \'{ 1 }\''
  )
})

test('getColorThemeJson - wrong/invalid path', async () => {
  const tmpDir = await getTmpDir()
  Platform.state.getBuiltinExtensionsPath = () => {
    return tmpDir
  }
  await JsonFile.writeJson(
    join(tmpDir, 'builtin.theme-test', 'extension.json'),
    {
      id: 'builtin.theme-test',
      colorThemes: [
        {
          id: 'test-theme',
          label: 'Test Theme',
          path: 'color-theme.json',
        },
      ],
      path: tmpDir,
    }
  )
  const colorThemePath = join(tmpDir, 'builtin.theme-test', 'color-theme.json')
  await expect(
    ExtensionHostColorTheme.getColorThemeJson('test-theme')
  ).rejects.toThrowError(
    `Failed to load color theme "test-theme": ENOENT: no such file or directory, open '${colorThemePath}'`
  )
})

test('getColorThemes', async () => {
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.theme-slime',
        colorThemes: [
          {
            id: 'slime',
            label: 'Slime',
            path: 'color-theme.json',
          },
        ],
        path: '/test',
      },
    ]
  }
  expect(await ExtensionHostColorTheme.getColorThemes()).toEqual([
    {
      id: 'slime',
      label: 'Slime',
      path: 'color-theme.json',
    },
  ])
})

test.skip('getColorThemeJson - not found', async () => {
  ExtensionHost.state.builtinExtensions = []
  ExtensionHost.state.installedExtensions = []
  await expect(
    ExtensionHost.getColorThemeJson('test-theme')
  ).rejects.toThrowError(
    'Color theme "test-theme" not found in extensions folder'
  )
})
