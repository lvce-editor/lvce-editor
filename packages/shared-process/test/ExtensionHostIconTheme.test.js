import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as ExtensionHostIconTheme from '../src/parts/ExtensionManagement/ExtensionManagementIconTheme.js'
import * as ExtensionManagement from '../src/parts/ExtensionManagement/ExtensionManagement.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('getIconTheme - not found', async () => {
  ExtensionManagement.state.getExtensions = async () => {
    return []
  }
  await expect(
    ExtensionHostIconTheme.getIconTheme('test-theme')
  ).rejects.toThrowError(
    'Icon theme "test-theme" not found in extensions folder'
  )
})

test('getIconTheme - wrong/invalid path', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.theme-test',
        iconThemes: [
          {
            id: 'test',
            label: 'Test',
            path: 'icon-theme.json',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  const iconThemeJsonPath = join(tmpDir, 'icon-theme.json')
  await expect(
    ExtensionHostIconTheme.getIconTheme('test')
  ).rejects.toThrowError(
    `Failed to load icon theme "test": ENOENT: no such file or directory, open '${iconThemeJsonPath}'`
  )
})

test('getIconTheme - invalid json', async () => {
  const tmpDir = await getTmpDir()
  ExtensionManagement.state.getExtensions = async () => {
    return [
      {
        status: 'fulfilled',
        id: 'builtin.icon-theme-test',
        iconThemes: [
          {
            id: 'test',
            label: 'Test',
            path: 'icon-theme.json',
          },
        ],
        path: tmpDir,
      },
    ]
  }
  const iconThemeJsonPath = join(tmpDir, 'icon-theme.json')
  await writeFile(iconThemeJsonPath, '{ 2 }')
  await expect(
    ExtensionHostIconTheme.getIconTheme('test')
  ).rejects.toThrowError(
    'Failed to load icon theme "test": Unexpected number in JSON at position 2 while parsing \'{ 2 }\''
  )
})
