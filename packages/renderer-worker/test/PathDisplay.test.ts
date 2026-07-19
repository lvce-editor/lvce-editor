import { expect, test } from '@jest/globals'
import * as PathDisplay from '../src/parts/PathDisplay/PathDisplay.js'
import * as Workspace from '../src/parts/Workspace/Workspace.js'

test('getLabel - process explorer', () => {
  expect(PathDisplay.getLabel('process-explorer://')).toBe('Process Explorer')
})

test('getFileIcon - process explorer', () => {
  expect(PathDisplay.getFileIcon('process-explorer://')).toBe('MaskIconDebugAlt2')
})

test('getLabel - running extensions', () => {
  expect(PathDisplay.getLabel('running-extensions://')).toBe('Running Extensions')
})

test('getFileIcon - running extensions', () => {
  expect(PathDisplay.getFileIcon('running-extensions://')).toBe('MaskIconExtensions')
})

test('getLabel - diff editor', () => {
  expect(PathDisplay.getLabel('diff://data://const value = 1<->/workspace/src/example.ts')).toBe('example.ts')
})

test('getLabel - inline diff editor', () => {
  expect(PathDisplay.getLabel('inline-diff://data://const value = 1<->/workspace/src/example.ts')).toBe('example.ts')
})

test('getTitle - diff editor', () => {
  expect(PathDisplay.getTitle('diff://data://const value = 1<->/workspace/src/example.ts')).toBe('/workspace/src/example.ts')
})

test('getTitle - file uri in home directory', () => {
  Workspace.state.homeDir = '/home/test'

  expect(PathDisplay.getTitle('file:///home/test/Documents/my%20file.txt')).toBe('~/Documents/my file.txt')
})
