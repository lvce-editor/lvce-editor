import { expect, test } from '@jest/globals'
import * as FileSystemFetch from '../src/parts/FileSystem/FileSystemFetch.js'

test('isReadonly', () => {
  expect(FileSystemFetch.isReadonly()).toBe(true)
})
