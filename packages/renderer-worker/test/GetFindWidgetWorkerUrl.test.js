import { beforeEach, expect, test } from '@jest/globals'
import * as FindWidgetWorkerUrl from '../src/parts/FindWidgetWorkerUrl/FindWidgetWorkerUrl.js'
import * as GetFindWidgetWorkerUrl from '../src/parts/GetFindWidgetWorkerUrl/GetFindWidgetWorkerUrl.js'
import * as RuntimeWorkerPaths from '../src/parts/RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

beforeEach(() => {
  RuntimeWorkerPaths.initialize()
})

test('uses the linked find widget worker path', () => {
  RuntimeWorkerPaths.initialize({
    'develop.findWidgetWorkerPath': '/remote/test/find-widget-worker.js',
  })

  expect(GetFindWidgetWorkerUrl.getFindWidgetWorkerUrl()).toBe('/remote/test/find-widget-worker.js')
})

test('uses the packaged worker path when none is linked', () => {
  expect(GetFindWidgetWorkerUrl.getFindWidgetWorkerUrl()).toBe(FindWidgetWorkerUrl.findWidgetWorkerUrl)
})
