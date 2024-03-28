import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getModule - not found', () => {
  expect(() => ModuleMap.getModuleId('NotFound.command')).toThrow(new Error('module NotFound not found'))
})

test('getModule', () => {
  expect(ModuleMap.getModuleId('About.showAbout')).toBe(ModuleId.About)
})
