import { expect, test } from '@jest/globals'
import * as HandleWebSocketForExtensionNodeProcess from '../src/parts/HandleWebSocketForExtensionNodeProcess/HandleWebSocketForExtensionNodeProcess.js'
import * as HandleWebSocketForFileWatcherExplorer from '../src/parts/HandleWebSocketForFileWatcherExplorer/HandleWebSocketForFileWatcherExplorer.js'
import * as HandleWebSocketForProcessExplorer from '../src/parts/HandleWebSocketForProcessExplorer/HandleWebSocketForProcessExplorer.js'
import * as HandleWebSocketModule from '../src/parts/HandleWebSocketModule/HandleWebSocketModule.js'

test('process explorer', () => {
  expect(HandleWebSocketModule.load('process-explorer')).toBe(HandleWebSocketForProcessExplorer)
})

test('file watcher explorer', () => {
  expect(HandleWebSocketModule.load('file-watcher-explorer')).toBe(HandleWebSocketForFileWatcherExplorer)
})

test('extension node process', () => {
  expect(HandleWebSocketModule.load('extension-node-process')).toBe(HandleWebSocketForExtensionNodeProcess)
})
