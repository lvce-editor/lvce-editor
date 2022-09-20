import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'
import * as TextSearchWeb from '../src/parts/TextSearch/TextSearchWeb.js'

beforeEach(() => {
  FileSystemWeb.state.files = Object.create(null)
})

test('textSearch', async () => {
  FileSystemWeb.state.files = {
    './index.txt': 'value',
  }
  expect(TextSearchWeb.textSearch('', '', 'val')).toEqual([
    [
      './index.txt',
      [
        {
          absoluteOffset: 0,
          preview: 'value',
        },
      ],
    ],
  ])
})
