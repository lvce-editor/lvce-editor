import { expect, test } from '@jest/globals'
import * as PathToFileUri from '../src/parts/PathToFileUri/PathToFileUri.js'

test('converts a Linux path with spaces and umlauts', () => {
  expect(PathToFileUri.pathToFileUri('/home/simon/Downloads/aegypten/2025 Ägypten')).toBe('file:///home/simon/Downloads/aegypten/2025%20%C3%84gypten')
})

test('converts Windows path separators', () => {
  expect(PathToFileUri.pathToFileUri('C:\\Users\\test\\My Folder')).toBe('file:///C:/Users/test/My%20Folder')
})

test('encodes reserved path characters', () => {
  expect(PathToFileUri.pathToFileUri('/tmp/100% #?.txt')).toBe('file:///tmp/100%25%20%23%3F.txt')
})
