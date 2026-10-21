import { afterEach, expect, test } from '@jest/globals'
import * as IpcState from '../src/parts/IpcState/IpcState.js'
import * as RuntimeConfig from '../src/parts/RuntimeConfig/RuntimeConfig.ts'
import * as ShouldUsePreloadedWorker from '../src/parts/ShouldUsePreloadedWorker/ShouldUsePreloadedWorker.ts'

afterEach(() => {
  RuntimeConfig.initialize()
  IpcState.setConfig(false)
})

test('missing configuration uses the default precreated worker ports', () => {
  IpcState.setConfig(true)
  for (const id of ['editorWorker', 'syntaxHighlightingWorker', 'extensionManagementWorker', 'fileSystemWorker']) {
    expect(ShouldUsePreloadedWorker.shouldUsePreloadedWorker(id)).toBe(true)
  }
})

test('an empty list keeps each optional worker on its normal lazy creation path', () => {
  IpcState.setConfig(true)
  RuntimeConfig.initialize({ preloadWorkers: [] })
  for (const id of ['editorWorker', 'syntaxHighlightingWorker', 'extensionManagementWorker', 'fileSystemWorker']) {
    expect(ShouldUsePreloadedWorker.shouldUsePreloadedWorker(id)).toBe(false)
  }
})

test('a subset only acquires cached ports for selected workers', () => {
  IpcState.setConfig(true)
  RuntimeConfig.initialize({ preloadWorkers: ['fileSystemWorker'] })
  expect(ShouldUsePreloadedWorker.shouldUsePreloadedWorker('fileSystemWorker')).toBe(true)
  expect(ShouldUsePreloadedWorker.shouldUsePreloadedWorker('editorWorker')).toBe(false)
})

test('single-worker mode never expects a precreated port', () => {
  IpcState.setConfig(false)
  RuntimeConfig.initialize({ preloadWorkers: ['fileSystemWorker'] })
  expect(ShouldUsePreloadedWorker.shouldUsePreloadedWorker('fileSystemWorker')).toBe(false)
})
