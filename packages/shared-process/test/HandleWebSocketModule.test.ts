import { expect, test } from '@jest/globals'
import * as HandleWebSocketForProcessExplorer from '../src/parts/HandleWebSocketForProcessExplorer/HandleWebSocketForProcessExplorer.js'
import * as HandleWebSocketModule from '../src/parts/HandleWebSocketModule/HandleWebSocketModule.js'

test('process explorer', () => {
  expect(HandleWebSocketModule.load('process-explorer')).toBe(HandleWebSocketForProcessExplorer)
})
