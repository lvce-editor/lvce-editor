import * as SearchFileWeb from '../src/parts/SearchFileWeb/SearchFileWeb.js'
import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'

beforeEach(() => {
  FileSystemWeb.state.files = Object.create(null)
})

test('searchFile', async () => {
  FileSystemWeb.state.files = {
    '/file-1.txt': '',
  }
  expect(await SearchFileWeb.searchFile('')).toEqual(['/file-1.txt'])
})
