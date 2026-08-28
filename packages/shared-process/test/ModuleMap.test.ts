import { expect, test } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'
import * as ModuleMap from '../src/parts/ModuleMap/ModuleMap.js'

test('getModuleId - Platform.getConfigJsonPath', () => {
  expect(ModuleMap.getModuleId('Platform.getConfigJsonPath')).toBe(ModuleId.Platform)
})

test('getModuleId - Platform.getConfigUri', () => {
  expect(ModuleMap.getModuleId('Platform.getConfigUri')).toBe(ModuleId.Platform)
})

test('getModuleId - SendMessagePortToMainProcess.sendMessagePortToMainProcess', () => {
  expect(ModuleMap.getModuleId('SendMessagePortToMainProcess.sendMessagePortToMainProcess')).toBe(ModuleId.SendMessagePortToMainProcess)
})

test('getModuleId - FirefoxCookieImport.importCookies', () => {
  expect(ModuleMap.getModuleId('FirefoxCookieImport.importCookies')).toBe(ModuleId.FirefoxCookieImport)
})

test('getModuleId - GetElectronFileResponse.resolveElectronFileUri', () => {
  expect(ModuleMap.getModuleId('GetElectronFileResponse.resolveElectronFileUri')).toBe(ModuleId.GetElectronFileResponse)
})

test('getModuleId - IpcTrace.append', () => {
  expect(ModuleMap.getModuleId('IpcTrace.append')).toBe(ModuleId.IpcTrace)
})

test('getModuleId - LanguageServer.disposeAll', () => {
  expect(ModuleMap.getModuleId('LanguageServer.disposeAll')).toBe(ModuleId.LanguageServer)
})

test('getModuleId - HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess', () => {
  expect(ModuleMap.getModuleId('HandleMessagePortForExtensionNodeProcess.handleMessagePortForExtensionNodeProcess')).toBe(
    ModuleId.HandleMessagePortForExtensionNodeProcess,
  )
})

test('getModuleId - HandleMessagePortForFileWatcherExplorer.handleMessagePortForFileWatcherExplorer', () => {
  expect(ModuleMap.getModuleId('HandleMessagePortForFileWatcherExplorer.handleMessagePortForFileWatcherExplorer')).toBe(
    ModuleId.HandleMessagePortForFileWatcherExplorer,
  )
})

test('getModuleId - FileWatcherExplorer.decreaseRefCount', () => {
  expect(ModuleMap.getModuleId('FileWatcherExplorer.decreaseRefCount')).toBe(ModuleId.FileWatcherExplorer)
})

test('getModuleId - ExtensionManagement.getLinkedExtensionDevelopmentConfig', () => {
  expect(ModuleMap.getModuleId('ExtensionManagement.getLinkedExtensionDevelopmentConfig')).toBe(ModuleId.ExtensionManagement)
})
