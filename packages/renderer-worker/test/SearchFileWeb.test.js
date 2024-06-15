import { beforeEach, expect, test } from '@jest/globals'
import * as FileSystemWeb from '../src/parts/FileSystem/FileSystemWeb.js'
import * as SearchFileWeb from '../src/parts/SearchFileWeb/SearchFileWeb.js'

beforeEach(() => {
  FileSystemWeb.state.files = Object.create(null)
})

test('searchFile', async () => {
  FileSystemWeb.state.files = {
    '/file-1.txt': '',
  }
  expect(await SearchFileWeb.searchFile('')).toEqual(['file-1.txt'])
})
