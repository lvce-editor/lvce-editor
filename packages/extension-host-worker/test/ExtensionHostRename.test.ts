import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostRename from '../src/parts/ExtensionHostRename/ExtensionHostRename.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostRename.reset()
})

test('executeRenameProvider - no results', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostRename.registerRenameProvider({
    languageId: 'javascript',
    async prepareRename() {
      return []
    },
  })
  // @ts-ignore
  expect(await ExtensionHostRename.executeprepareRenameProvider(1, 0)).toEqual([])
})

test('executeRename - error - rename provider throws error', async () => {
  TextDocument.setFiles([
    {
      path: '/test.index.ts',
      id: 1,
      languageId: 'javascript',
      content: '',
    },
  ])
  ExtensionHostRename.registerRenameProvider({
    languageId: 'javascript',
    rename() {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostRename.executeRenameProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute rename provider: TypeError: x is not a function'),
  )
})
