import { beforeEach, expect, test } from '@jest/globals'
import * as ConfigState from '../src/parts/ConfigState/ConfigState.js'
import * as GetConfiguredWorkerUrl from '../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as PreferencesState from '../src/parts/PreferencesState/PreferencesState.js'

beforeEach(() => {
  ConfigState.reset()
  PreferencesState.set('develop.testWorkerPath', '')
  PreferencesState.set('develop.someWorkerPath', '')
})

test('returns config worker url without adding remote prefix', () => {
  ConfigState.set({
    testWorkerUrl: '/remote/test/packages/test-worker/dist/testWorkerMain.js',
  })

  const url = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.testWorkerPath', '/fallback/testWorkerMain.js')

  expect(url).toBe('/remote/test/packages/test-worker/dist/testWorkerMain.js')
})

test('falls back to preferences path with remote prefix', () => {
  PreferencesState.set('develop.someWorkerPath', '/test/packages/some-worker/dist/someWorkerMain.js')

  const url = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.someWorkerPath', '/fallback/someWorkerMain.js')

  expect(url).toBe('/remote/test/packages/some-worker/dist/someWorkerMain.js')
})

test('config worker url has priority over preferences', () => {
  ConfigState.set({
    testWorkerUrl: '/remote/config/packages/test-worker/dist/testWorkerMain.js',
  })
  PreferencesState.set('develop.testWorkerPath', '/test/preferences/testWorkerMain.js')

  const url = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.testWorkerPath', '/fallback/testWorkerMain.js')

  expect(url).toBe('/remote/config/packages/test-worker/dist/testWorkerMain.js')
})
