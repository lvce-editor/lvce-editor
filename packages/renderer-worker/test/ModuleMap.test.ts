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
  expect(ModuleMap.getModuleId('ExtensionHostManagement.activateByEvent')).toBe(ModuleId.ExtensionManagement)
  expect(ModuleMap.getModuleId('ExtensionHostSourceControl.getChangedFiles')).toBe(ModuleId.ExtensionManagement)
  expect(ModuleMap.getModuleId('ExtensionHostTextDocument.syncFull')).toBe(ModuleId.ExtensionHostCode)
  expect(ModuleMap.getModuleId('License.openLicense')).toBe(ModuleId.License)
  expect(ModuleMap.getModuleId('SendMessagePortToMainProcess.sendMessagePortToMainProcess')).toBe(ModuleId.SendMessagePortToMainProcess)
})

test('legacy text document synchronization commands are isolated-host compatibility no-ops', async () => {
  const loadedModule = await Module.load(ModuleMap.getModuleId('ExtensionHostTextDocument.syncFull'))
  const commands = (loadedModule as { Commands: Record<string, (...args: readonly unknown[]) => unknown> }).Commands

  expect(commands['ExtensionHostTextDocument.syncFull']('file:///test.txt', 1, 'text', 'content')).toBeUndefined()
  expect(commands['ExtensionHostTextDocument.syncIncremental'](1, [])).toBeUndefined()
  expect(commands['ExtensionHostTextDocument.setLanguageId'](1, 'javascript')).toBeUndefined()
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

test('getModule - public user data directory command', async () => {
  const moduleId = ModuleMap.getModuleId('Platform.getUserDataDir')
  const loadedModule = await Module.load(moduleId)
  const commands = (loadedModule as { Commands: Record<string, unknown> })
    .Commands

  expect(moduleId).toBe(ModuleId.PlatformPaths)
  expect(commands['Platform.getUserDataDir']).toBeDefined()
})
