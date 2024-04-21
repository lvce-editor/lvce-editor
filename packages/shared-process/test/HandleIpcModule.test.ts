import { expect, test } from '@jest/globals'
import * as HandleIpcModule from '../src/parts/HandleIpcModule/HandleIpcModule.js'
import * as HandleIpcSharedProcess from '../src/parts/HandleIpcSharedProcess/HandleIpcSharedProcess.js'
import * as HandleIpcTerminalProcess from '../src/parts/HandleIpcTerminalProcess/HandleIpcTerminalProcess.js'
import * as HandleIpcExtensionHostHelperProcess from '../src/parts/HandleIpcExtensionHostHelperProcess/HandleIpcExtensionHostHelperProcess.js'
import * as HandleIpcProcessExplorer from '../src/parts/HandleIpcProcessExplorer/HandleIpcProcessExplorer.js'
import * as HandleIpcSearchProcess from '../src/parts/HandleIpcSearchProcess/HandleIpcSearchProcess.js'
import * as HandleIpcEmbedsProcess from '../src/parts/HandleIpcEmbedsProcess/HandleIpcEmbedsProcess.js'
import * as IpcId from '../src/parts/IpcId/IpcId.js'

test('shared process', () => {
  expect(HandleIpcModule.getModule(IpcId.SharedProcess)).toBe(HandleIpcSharedProcess)
})

test('embeds process', () => {
  expect(HandleIpcModule.getModule(IpcId.EmbedsProcess)).toBe(HandleIpcEmbedsProcess)
})

test('terminal process', () => {
  expect(HandleIpcModule.getModule(IpcId.TerminalProcess)).toBe(HandleIpcTerminalProcess)
})

test('extension host helper process', () => {
  expect(HandleIpcModule.getModule(IpcId.ExtensionHostHelperProcess)).toBe(HandleIpcExtensionHostHelperProcess)
})

test('process explorer', () => {
  expect(HandleIpcModule.getModule(IpcId.ProcessExplorer)).toBe(HandleIpcProcessExplorer)
})

test('search process', () => {
  expect(HandleIpcModule.getModule(IpcId.SearchProcess)).toBe(HandleIpcSearchProcess)
})

test('unknown', () => {
  expect(() => HandleIpcModule.getModule(IpcId.Unknown)).toThrow(new Error('unexpected incoming ipc'))
})
