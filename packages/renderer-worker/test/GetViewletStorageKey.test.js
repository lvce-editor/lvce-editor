import { expect, test } from '@jest/globals'
import * as GetViewletStorageKey from '../src/parts/GetViewletStorageKey/GetViewletStorageKey.js'

test('namespaces viewlet state by workspace', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Explorer', 'file:///home/user/project')).toBe('viewlet:file:///home/user/project:Explorer')
})

test('keeps layout state global', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Layout', 'file:///home/user/project')).toBe('Layout')
})

test('preserves escaped file uri characters', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Explorer', 'file:///home/user/my%20project')).toBe(
    'viewlet:file:///home/user/my%20project:Explorer',
  )
})

test('supports windows file uris', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Explorer', 'file:///C:/Users/user/project')).toBe(
    'viewlet:file:///C:/Users/user/project:Explorer',
  )
})

test('uses distinct keys for the same viewlet in different workspaces', () => {
  const first = GetViewletStorageKey.getViewletStorageKey('Main', 'file:///workspace/one')
  const second = GetViewletStorageKey.getViewletStorageKey('Main', 'file:///workspace/two')

  expect(first).not.toBe(second)
})

test('uses the empty workspace scope when no workspace is open', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Explorer')).toBe('viewlet::Explorer')
})
