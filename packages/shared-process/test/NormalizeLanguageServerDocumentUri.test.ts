import { expect, test } from '@jest/globals'
import { pathToFileURL } from 'node:url'
import { normalizeLanguageServerDocumentUri } from '../src/parts/NormalizeLanguageServerDocumentUri/NormalizeLanguageServerDocumentUri.ts'

test('normalizes an absolute path', () => {
  expect(normalizeLanguageServerDocumentUri('/tmp/README.md')).toBe(pathToFileURL('/tmp/README.md').href)
})

test('normalizes a Windows file URI', () => {
  expect(normalizeLanguageServerDocumentUri('file:///D:/workspace/README.md')).toBe('file:///d%3A/workspace/README.md')
})

test('normalizes an encoded Windows file URI', () => {
  expect(normalizeLanguageServerDocumentUri('file:///D%3A/workspace/README.md')).toBe('file:///d%3A/workspace/README.md')
})

test('preserves a normalized file URI', () => {
  expect(normalizeLanguageServerDocumentUri('file:///tmp/README.md')).toBe('file:///tmp/README.md')
})

test('normalizes a remote file URL', () => {
  expect(normalizeLanguageServerDocumentUri('http://localhost:41283/remote/C:/My%20Project/src/Main.elm')).toBe(
    'file:///c%3A/My%20Project/src/Main.elm',
  )
})

test('preserves a non-file URI', () => {
  expect(normalizeLanguageServerDocumentUri('memfs:///workspace/README.md')).toBe('memfs:///workspace/README.md')
})
