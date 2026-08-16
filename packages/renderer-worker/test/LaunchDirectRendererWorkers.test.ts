/* eslint-disable jest/no-restricted-jest-methods -- Worker launch tests use ESM module mocks for transport dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const ipc = {
  send(): void {},
}

jest.unstable_mockModule('../src/parts/GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts', () => ({
  getConfiguredWorkerUrl: jest.fn(() => 'file:///worker.js'),
}))
jest.unstable_mockModule('../src/parts/GetPortTuple/GetPortTuple.js', () => ({
  getPortTuple: jest.fn(() => ({ port1: 'worker-port', port2: 'renderer-process-port' })),
}))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => ({
  handleIpc: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/IpcParent/IpcParent.js', () => ({
  create: jest.fn(async () => ipc),
}))
jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  invoke: jest.fn(async () => undefined),
  invokeAndTransfer: jest.fn(async () => undefined),
}))
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invokeAndTransfer: jest.fn(async () => undefined),
}))
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invokeAndTransfer: jest.fn(async () => undefined),
}))

const GetPortTuple = await import('../src/parts/GetPortTuple/GetPortTuple.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const LaunchAboutViewWorker = await import('../src/parts/LaunchAboutViewWorker/LaunchAboutViewWorker.js')
const LaunchActivityBarWorker = await import('../src/parts/LaunchActivityBarWorker/LaunchActivityBarWorker.ts')
const LaunchChatDebugViewWorker = await import('../src/parts/LaunchChatDebugViewWorker/LaunchChatDebugViewWorker.js')
const LaunchChatViewWorker = await import('../src/parts/LaunchChatViewWorker/LaunchChatViewWorker.js')
const LaunchDiffViewWorker = await import('../src/parts/LaunchDiffViewWorker/LaunchDiffViewWorker.js')
const LaunchExtensionSearchViewWorker = await import('../src/parts/LaunchExtensionSearchViewWorker/LaunchExtensionSearchViewWorker.js')
const LaunchKeyBindingsViewWorker = await import('../src/parts/LaunchKeyBindingsViewWorker/LaunchKeyBindingsViewWorker.js')
const LaunchLanguageModelsViewWorker = await import('../src/parts/LaunchLanguageModelsViewWorker/LaunchLanguageModelsViewWorker.js')
const LaunchMainAreaWorker = await import('../src/parts/LaunchMainAreaWorker/LaunchMainAreaWorker.ts')
const LaunchOutputViewWorker = await import('../src/parts/LaunchOutputViewWorker/LaunchOutputViewWorker.js')
const LaunchPanelWorker = await import('../src/parts/LaunchPanelWorker/LaunchPanelWorker.ts')
const LaunchProblemsWorker = await import('../src/parts/LaunchProblemsWorker/LaunchProblemsWorker.ts')
const LaunchProcessExplorerWorker = await import('../src/parts/LaunchProcessExplorerWorker/LaunchProcessExplorerWorker.js')
const LaunchQuickPickWorker = await import('../src/parts/LaunchQuickPickWorker/LaunchQuickPickWorker.js')
const LaunchRunningExtensionsViewWorker = await import('../src/parts/LaunchRunningExtensionsViewWorker/LaunchRunningExtensionsViewWorker.ts')
const LaunchSettingsViewWorker = await import('../src/parts/LaunchSettingsViewWorker/LaunchSettingsViewWorker.js')
const LaunchSourceControlWorker = await import('../src/parts/LaunchSourceControlWorker/LaunchSourceControlWorker.js')
const LaunchStatusBarWorker = await import('../src/parts/LaunchStatusBarWorker/LaunchStatusBarWorker.js')
const LaunchTextSearchViewWorker = await import('../src/parts/LaunchTextSearchViewWorker/LaunchTextSearchViewWorker.js')
const LaunchTitleBarWorker = await import('../src/parts/LaunchTitleBarWorker/LaunchTitleBarWorker.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test.each([
  ['about', LaunchAboutViewWorker.launchAboutViewWorker, 'About.handleMessagePort', 'About'],
  ['activity bar', LaunchActivityBarWorker.launchActivityBarWorker, 'ActivityBar.handleMessagePort', 'ActivityBar'],
  ['chat', LaunchChatViewWorker.launchChatViewWorker, 'Chat.handleMessagePort', 'Chat'],
  ['chat debug', LaunchChatDebugViewWorker.launchChatDebugViewWorker, 'ChatDebug.handleMessagePort', 'ChatDebug'],
  ['diff', LaunchDiffViewWorker.launchDiffViewWorker, 'DiffView.handleMessagePort', 'DiffView'],
  ['extension search', LaunchExtensionSearchViewWorker.launchExtensionSearchViewWorker, 'SearchExtensions.handleMessagePort', 'SearchExtensions'],
  ['keybindings', LaunchKeyBindingsViewWorker.launchKeyBindingsViewWorker, 'KeyBindings.handleMessagePort', 'KeyBindings'],
  ['language models', LaunchLanguageModelsViewWorker.launchLanguageModelsViewWorker, 'LanguageModels.handleMessagePort', 'LanguageModels'],
  ['main area', LaunchMainAreaWorker.launchMainAreaWorker, 'MainArea.handleMessagePort', 'MainArea'],
  ['output', LaunchOutputViewWorker.launchOutputViewWorker, 'Output.handleMessagePort', 'Output'],
  ['panel', LaunchPanelWorker.launchPanelWorker, 'Panel.handleMessagePort', 'Panel'],
  ['problems', LaunchProblemsWorker.launchProblemsWorker, 'Problems.handleMessagePort', 'Problems'],
  ['process explorer', LaunchProcessExplorerWorker.launchProcessExplorerWorker, 'ProcessExplorer.handleMessagePort', 'ProcessExplorer'],
  ['quick pick', LaunchQuickPickWorker.launchQuickPickWorker, 'QuickPick.handleRendererProcessMessagePort', 'QuickPick'],
  ['source control', LaunchSourceControlWorker.launchSourceControlWorker, 'SourceControl.handleRendererProcessMessagePort', 'SourceControl'],
  ['running extensions', LaunchRunningExtensionsViewWorker.launchRunningExtensionsViewWorker, 'RunningExtensions.handleMessagePort', 'RunningExtensions'],
  ['settings', LaunchSettingsViewWorker.launchSettingsViewWorker, 'Settings.handleMessagePort', 'Settings'],
  ['status bar', LaunchStatusBarWorker.launchStatusBarWorker, 'StatusBar.handleMessagePort', 'StatusBar'],
  ['text search', LaunchTextSearchViewWorker.launchTextSearchViewWorker, 'TextSearch.handleMessagePort', 'TextSearch'],
  ['title bar', LaunchTitleBarWorker.launchTitleBarWorker, 'TitleBar.handleMessagePort', 'TitleBar'],
] as const)('%s worker connects directly to the renderer process', async (_name, launch, command, rpcId) => {
  await launch()

  expect(GetPortTuple.getPortTuple).toHaveBeenCalledTimes(1)
  expect(JsonRpc.invokeAndTransfer).toHaveBeenCalledWith(ipc, command, 'worker-port')
  expect(RendererProcess.invokeAndTransfer).toHaveBeenCalledWith('HandleMessagePort.handleMessagePort', 'renderer-process-port', rpcId)
})
