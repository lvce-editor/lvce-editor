import { expect, test } from '@jest/globals'
import * as GetRuntimeWorkerUrl from '../src/parts/GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'
import * as RuntimeWorkerPaths from '../src/parts/RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

test('initializes runtime values received from renderer process IPC', () => {
  const config = {
    assetDir: '/test-assets',
    platform: 2,
    workerUrls: {
      'develop.editorWorkerPath': '/test-assets/packages/editor-worker/dist/editorWorkerMain.js',
    },
  }
  RuntimeConfig.initialize(config)
  expect(RuntimeConfig.runtimeConfig).toEqual(config)
  RuntimeConfig.initialize()
  expect(RuntimeConfig.runtimeConfig).toEqual({})
})

test('uses configured worker URLs before development fallbacks', () => {
  RuntimeWorkerPaths.initialize({ 'develop.editorWorkerPath': '/configured/editorWorkerMain.js' })

  expect(GetRuntimeWorkerUrl.getRuntimeWorkerUrl('develop.editorWorkerPath', '/source/editorWorkerMain.ts')).toBe('/configured/editorWorkerMain.js')
  expect(GetRuntimeWorkerUrl.getRuntimeWorkerUrl('develop.otherWorkerPath', '/source/otherWorkerMain.ts')).toBe('/source/otherWorkerMain.ts')

  RuntimeWorkerPaths.initialize()
})

test('loads asset and platform values before deriving worker URLs', async () => {
  const assetDir = '/test-assets'
  RuntimeConfig.initialize({
    assetDir,
    platform: 2,
    workerUrls: {
      'develop.editorWorkerPath': `${assetDir}/configured/editorWorkerMain.js`,
    },
  })
  RuntimeWorkerPaths.initialize(RuntimeConfig.runtimeConfig.workerUrls)

  const [EditorWorkerUrl, Platform, AssetDir] = await Promise.all([
    import('../src/parts/EditorWorkerUrl/EditorWorkerUrl.js'),
    import('../src/parts/Platform/Platform.js'),
    import('../src/parts/AssetDir/AssetDir.js'),
  ])

  expect(AssetDir.assetDir).toBe(assetDir)
  expect(Platform.getPlatform()).toBe(2)
  expect(EditorWorkerUrl.editorWorkerUrl).toBe(`${assetDir}/configured/editorWorkerMain.js`)
  RuntimeWorkerPaths.initialize()
  RuntimeConfig.initialize()
})
