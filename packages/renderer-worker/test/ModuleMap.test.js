import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'

test('getModule - not found', () => {
  expect(() => ModuleMap.getModuleId('NotFound.command')).toThrowError(new Error(`module NotFound not found`))
})

test('getModule', () => {
  expect(ModuleMap.getModuleId('About.showAbout')).toBe(ModuleId.About)
})
