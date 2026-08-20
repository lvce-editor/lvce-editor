import { beforeEach, expect, test } from '@jest/globals'
import { getConfiguredWorkerUrl } from '../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as RuntimeWorkerPaths from '../src/parts/RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

beforeEach(() => {
  RuntimeWorkerPaths.initialize()
})

test('prefers a runtime worker url', () => {
  RuntimeWorkerPaths.initialize({
    'develop.mainAreaWorkerPath': '/remote/test/main-area-worker.js',
  })

  expect(getConfiguredWorkerUrl('develop.mainAreaWorkerPath', '/fallback.js')).toBe('/remote/test/main-area-worker.js')
})
