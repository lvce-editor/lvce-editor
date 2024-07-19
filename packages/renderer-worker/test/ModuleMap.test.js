import { expect, test } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'

test('getModule - not found', () => {
  expect(() => ModuleMap.getModuleId('NotFound.command')).toThrow(new Error('module NotFound not found'))
})

test('getModule', () => {
  expect(ModuleMap.getModuleId('About.showAbout')).toBe(ModuleId.About)
})
