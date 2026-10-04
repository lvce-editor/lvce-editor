import { expect, test } from '@jest/globals'
import * as GetRuntimeWorkerUrl from '../src/parts/GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'
import * as RuntimeWorkerPaths from '../src/parts/RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

test('parses runtime values passed to the worker URL', () => {
  const config = {
    assetDir: '/test-assets',
    platform: 2,
    workerUrls: {
      'develop.editorWorkerPath': '/test-assets/packages/editor-worker/dist/editorWorkerMain.js',
    },
  }
  const url = new URL('/worker.js', 'https://example.test')
  url.searchParams.set('config', JSON.stringify(config))

  expect(RuntimeConfig.parseRuntimeConfig(url.href)).toEqual(config)
})

test('uses defaults when the worker URL has no runtime config', () => {
  expect(RuntimeConfig.parseRuntimeConfig('https://example.test/worker.js')).toEqual({})
})

test('uses configured worker URLs before development fallbacks', () => {
  RuntimeWorkerPaths.initialize({ 'develop.editorWorkerPath': '/configured/editorWorkerMain.js' })

  expect(GetRuntimeWorkerUrl.getRuntimeWorkerUrl('develop.editorWorkerPath', '/source/editorWorkerMain.ts')).toBe('/configured/editorWorkerMain.js')
  expect(GetRuntimeWorkerUrl.getRuntimeWorkerUrl('develop.otherWorkerPath', '/source/otherWorkerMain.ts')).toBe('/source/otherWorkerMain.ts')

  RuntimeWorkerPaths.initialize()
})
