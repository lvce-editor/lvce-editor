import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as SortExplorerItems from '../src/parts/SortExplorerItems/SortExplorerItems.js'

test('compare dirent - symlink to file and file should be ordered next to each other', () => {
  expect(
    SortExplorerItems.compareDirent(
      {
        name: 'file-1.txt',
        type: DirentType.File,
      },
      {
        name: 'file-1.txt',
        type: DirentType.SymLinkFile,
      },
    ),
  ).toBe(0)
})

test('compare dirent - numeric order', () => {
  expect(
    SortExplorerItems.compareDirent(
      {
        name: 'file-2.txt',
        type: DirentType.File,
      },
      {
        name: 'file-10.txt',
        type: DirentType.File,
      },
    ),
  ).toBe(-1)
})

test('compare dirent - symlink to directory and directory should be ordered next to each other', () => {
  expect(
    SortExplorerItems.compareDirent(
      {
        name: 'folder-1',
        type: DirentType.Directory,
      },
      {
        name: 'folder-1',
        type: DirentType.SymLinkFolder,
      },
    ),
  ).toBe(0)
})

test.only('compare dirent - folder', () => {
  expect(
    SortExplorerItems.compareDirent(
      {
        name: 'test',
        type: DirentType.Directory,
      },
      {
        name: 'f',
        type: DirentType.Directory,
      },
    ),
  ).toBe(1)
})
