import * as AssetDir from '../AssetDir/AssetDir.js'
import * as AuthWorker from '../AuthWorker/AuthWorker.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as Platform from '../Platform/Platform.js'
import { createAccountLifecycle } from './AccountLifecycle.ts'

export const getAccounts = AuthWorker.getAccounts
export const getAccessToken = (refresh = false): Promise<string> => AuthWorker.invoke('Auth.getAccessToken', refresh ? { refresh: 'if-needed' } : {})
export const getBackendUrl = (): Promise<string> => AuthWorker.invoke('Auth.getBackendUrl')

export const { beginAccountChange, endAccountChange, getAccountChangeState } = createAccountLifecycle({
  execute: ExtensionHostCommands.executeCommand,
  getExtensions: () => ExtensionMeta.getExtensions(AssetDir.assetDir, Platform.getPlatform()),
})
