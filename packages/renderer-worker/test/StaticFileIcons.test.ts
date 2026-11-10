import { afterEach, expect, test } from '@jest/globals'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'
import { commandMap, isEnabled } from '../src/parts/StaticFileIcons/StaticFileIcons.ts'

afterEach(() => RuntimeConfig.initialize())

test('static icons preserve the icon RPC shape without loading a theme', () => {
  expect(isEnabled()).toBe(false)
  RuntimeConfig.initialize({
    staticFileIcons: {
      'main.ts': '/icons/typescript.svg',
      'folder:src': '/icons/folder-src.svg',
      defaultFileIcon: '/icons/file-default.svg',
      defaultFolderIcon: '/icons/folder-default.svg',
    },
  })
  expect(isEnabled()).toBe(true)
  expect(commandMap['IconTheme.getFileIcon']('memfs:///demo/main.ts')).toBe('/icons/typescript.svg')
  expect(commandMap['IconTheme.getFileIcons'](['main.ts', 'other.ts'])).toEqual(['/icons/typescript.svg', '/icons/file-default.svg'])
  expect(commandMap['IconTheme.getFolderIcon']('memfs:///demo/src')).toBe('/icons/folder-src.svg')
  expect(commandMap['IconTheme.getFolderIcon']('memfs:///demo/node_modules')).toBe('/icons/folder-default.svg')
  expect(
    commandMap['IconTheme.getIcons']([
      { name: 'main.ts', type: 1 },
      { name: 'src', type: 2 },
      { name: 'other.ts', type: 1 },
    ]),
  ).toEqual(['/icons/typescript.svg', '/icons/folder-src.svg', '/icons/file-default.svg'])
  expect(commandMap['IconTheme.getFolderIcon']()).toBe('/icons/folder-default.svg')
})
