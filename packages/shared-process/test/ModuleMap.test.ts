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

test('getModuleId - SecretStorage.get', () => {
  expect(ModuleMap.getModuleId('SecretStorage.get')).toBe(ModuleId.SecretStorage)
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
