import { expect, test } from '@jest/globals'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as GetElectronFileResponse from '../src/parts/GetElectronFileResponse/GetElectronFileResponse.ts'
import * as Root from '../src/parts/Root/Root.ts'

test('resolveElectronFileUri - resolves a development source uri', () => {
  const uri = GetElectronFileResponse.resolveElectronFileUri('lvce-oss://-/packages/renderer-worker/dist/rendererWorkerMain.js')

  expect(uri).toBe(pathToFileURL(join(Root.root, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')).toString())
})

test('resolveElectronFileUri - resolves a built source uri', () => {
  const uri = GetElectronFileResponse.resolveElectronFileUri('lvce-oss://-/abc123/packages/renderer-worker/dist/rendererWorkerMain.js')

  expect(uri).toBe(pathToFileURL(join(Root.root, 'static', 'abc123', 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')).toString())
})
