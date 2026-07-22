import { expect, test } from '@jest/globals'
import * as Module from '../src/parts/Module/Module.js'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

test('getModule - not found', () => {
  expect(() => ModuleMap.getModuleId('NotFound.command')).toThrow(new Error('module NotFound not found'))
})

test('getModule', () => {
  expect(ModuleMap.getModuleId('About.showAbout')).toBe(ModuleId.About)
  expect(ModuleMap.getModuleId('License.openLicense')).toBe(ModuleId.License)
  expect(ModuleMap.getModuleId('SendMessagePortToMainProcess.sendMessagePortToMainProcess')).toBe(ModuleId.SendMessagePortToMainProcess)
})

test('getModule - layout runtime context', async () => {
  const moduleId = ModuleMap.getModuleId('Layout.getAssetDir')
  const loadedModule = await Module.load(moduleId)
  const Layout = await import('../src/parts/Layout/Layout.ipc.js')

  expect(moduleId).toBe(ModuleId.Layout)
  expect(loadedModule).toBe(Layout)
  expect(Layout.name).toBe('Layout')
  expect(Layout.Commands.getAssetDir()).toBe('')
  expect(Layout.Commands.getPlatform()).toBe(PlatformType.Test)
})
