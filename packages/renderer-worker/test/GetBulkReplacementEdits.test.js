import * as GetBulkReplacementEdits from '../src/parts/GetBulkReplacementEdits/GetBulkReplacementEdits.js'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getBulkReplacementEdits', () => {
  const workspacePath = '/test'
  const matches = [
    {
      type: TextSearchResultType.File,
      text: './file.txt',
    },
    {
      type: TextSearchResultType.Match,
      title: '',
      lineNumber: 1,
      matchLength: 1,
      matchStart: 0,
    },
  ]
  expect(GetBulkReplacementEdits.getBulkReplacementEdits(workspacePath, matches)).toEqual({ files: ['/test/file.txt'], ranges: [4, 0, 0, 0, 1] })
})
