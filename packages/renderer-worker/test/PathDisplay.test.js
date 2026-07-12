import { expect, test } from '@jest/globals'
import * as PathDisplay from '../src/parts/PathDisplay/PathDisplay.js'

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
