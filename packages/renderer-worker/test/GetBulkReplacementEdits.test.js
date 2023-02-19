import * as GetBulkReplacementEdits from '../src/parts/GetBulkReplacementEdits/GetBulkReplacementEdits.js'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

test('getBulkReplacementEdits', () => {
  const matches = [
    {
      type: TextSearchResultType.File,
      title: '/test/file.txt',
    },
    {
      type: TextSearchResultType.Match,
      title: '',
      lineNumber: 1,
      matchLength: 1,
      matchStart: 0,
    },
  ]
  expect(GetBulkReplacementEdits.getBulkReplacementEdits(matches)).toEqual({ files: ['/test/file.txt'], ranges: [4, 0, 0, 0, 1] })
})
