import { expect, test } from '@jest/globals'
import * as GetViewletStorageKey from '../src/parts/GetViewletStorageKey/GetViewletStorageKey.js'

test('namespaces viewlet state by workspace', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Explorer', '/home/user/project')).toBe('viewlet:%2Fhome%2Fuser%2Fproject:Explorer')
})

test('keeps layout state global', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Layout', '/home/user/project')).toBe('Layout')
})

test('uses distinct keys for the same viewlet in different workspaces', () => {
  const first = GetViewletStorageKey.getViewletStorageKey('Main', '/workspace/one')
  const second = GetViewletStorageKey.getViewletStorageKey('Main', '/workspace/two')

  expect(first).not.toBe(second)
})

test('uses the empty workspace scope when no workspace is open', () => {
  expect(GetViewletStorageKey.getViewletStorageKey('Explorer')).toBe('viewlet::Explorer')
})
