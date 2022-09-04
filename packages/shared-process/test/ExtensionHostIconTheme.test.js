import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { jest } from '@jest/globals'
import * as ExtensionManifestStatus from '../src/parts/ExtensionManifestStatus/ExtensionManifestStatus.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionManagement/ExtensionManagement.js',
  () => {
    return {
      getExtensions: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostIconTheme = await import(
  '../src/parts/ExtensionManagement/ExtensionManagementIconTheme.js'
)
const ExtensionManagement = await import(
  '../src/parts/ExtensionManagement/ExtensionManagement.js'
)

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

test('getIconTheme - not found', async () => {
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(async () => {
    return []
  })
  await expect(
    ExtensionHostIconTheme.getIconTheme('test-theme')
  ).rejects.toThrowError(
    'Icon theme "test-theme" not found in extensions folder'
  )
})

test('getIconTheme - wrong/invalid path', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(async () => {
    return [
      {
        status: ExtensionManifestStatus.Resolved,
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
  })
  const iconThemeJsonPath = join(tmpDir, 'icon-theme.json')
  await expect(
    ExtensionHostIconTheme.getIconTheme('test')
  ).rejects.toThrowError(
    `Failed to load icon theme "test": File not found '${iconThemeJsonPath}'`
  )
})

test('getIconTheme - invalid json', async () => {
  const tmpDir = await getTmpDir()
  // @ts-ignore
  ExtensionManagement.getExtensions.mockImplementation(async () => {
    return [
      {
        status: ExtensionManifestStatus.Resolved,
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
  })
  const iconThemeJsonPath = join(tmpDir, 'icon-theme.json')
  await writeFile(iconThemeJsonPath, '{ 2 }')
  await expect(
    ExtensionHostIconTheme.getIconTheme('test')
  ).rejects.toThrowError('Failed to load icon theme "test": Json Parsing Error')
})
