import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as Assert from '../Assert/Assert.ts'
import * as AuthWorker from '../AuthWorker/AuthWorker.js'
import * as ChatCoordinatorWorker from '../ChatCoordinatorWorker/ChatCoordinatorWorker.js'
import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'
import * as ChatMathWorker from '../ChatMathWorker/ChatMathWorker.js'
import * as ChatMessageParsingWorker from '../ChatMessageParsingWorker/ChatMessageParsingWorker.js'
import * as ChatNetworkWorker from '../ChatNetworkWorker/ChatNetworkWorker.js'
import * as ChatStorageWorker from '../ChatStorageWorker/ChatStorageWorker.js'
import * as ChatToolWorker from '../ChatToolWorker/ChatToolWorker.js'
import * as ChatViewModelWorker from '../ChatViewModelWorker/ChatViewModelWorker.js'
import * as ChatViewWorker from '../ChatViewWorker/ChatViewWorker.js'
import * as ClipBoardWorker from '../ClipBoardWorker/ClipBoardWorker.js'
import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'
import * as DiffWorker from '../DiffWorker/DiffWorker.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ErrorWorker from '../ErrorWorker/ErrorWorker.ts'
import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
import * as HandleDialogWorkerMessagePort from '../HandleDialogWorkerMessagePort/HandleDialogWorkerMessagePort.ts'
import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.js'
import * as IframeWorker from '../IframeWorker/IframeWorker.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'
import * as LanguageModelsViewWorker from '../LanguageModelsViewWorker/LanguageModelsViewWorker.js'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as MarkdownWorker from '../MarkdownWorker/MarkdownWorker.js'
import * as OpenerWorker from '../OpenerWorker/OpenerWorker.js'
import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as PanelWorker from '../PanelWorker/PanelWorker.js'
import * as PreviewSandBoxWorker from '../PreviewSandBoxWorker/PreviewSandBoxWorker.js'
import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'
import * as FileWatcherViewWorker from '../FileWatcherViewWorker/FileWatcherViewWorker.js'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts'
import * as SecretsViewWorker from '../SecretsViewWorker/SecretsViewWorker.ts'
import * as SettingsWorker from '../SettingsWorker/SettingsWorker.js'
import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'
import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'
import * as TextMeasurementWorker from '../TextMeasurementWorker/TextMeasurementWorker.js'
import * as TextSearchViewWorker from '../TextSearchViewWorker/TextSearchViewWorker.js'
import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

const directViewWorkers = {
  About: [AboutViewWorker, 'About.handleMessagePort'],
  ActivityBar: [ActivityBarWorker, 'ActivityBar.handleMessagePort'],
  Chat: [ChatViewWorker, 'Chat.handleMessagePort'],
  ChatDebug: [ChatDebugViewWorker, 'ChatDebug.handleMessagePort'],
  DiffView: [DiffViewWorker, 'DiffView.handleMessagePort'],
  Explorer: [ExplorerViewWorker, 'Explorer.handleMessagePort'],
  ExtensionDetail: [ExtensionDetailViewWorker, 'ExtensionDetail.handleMessagePort'],
  KeyBindings: [KeyBindingsViewWorker, 'KeyBindings.handleMessagePort'],
  LanguageModels: [LanguageModelsViewWorker, 'LanguageModels.handleMessagePort'],
  MainArea: [MainAreaWorker, 'MainArea.handleMessagePort'],
  Output: [OutputViewWorker, 'Output.handleMessagePort'],
  Panel: [PanelWorker, 'Panel.handleMessagePort'],
  Problems: [ProblemsWorker, 'Problems.handleMessagePort'],
  ProcessExplorer: [ProcessExplorerWorker, 'ProcessExplorer.handleMessagePort'],
  FileWatcherExplorer: [FileWatcherViewWorker, 'FileWatcherExplorer.handleMessagePort'],
  QuickPick: [QuickPickWorker, 'QuickPick.handleRendererProcessMessagePort'],
  RunningExtensions: [RunningExtensionsViewWorker, 'RunningExtensions.handleMessagePort'],
  SearchExtensions: [ExtensionSearchViewWorker, 'SearchExtensions.handleMessagePort'],
  SecretsView: [SecretsViewWorker, 'SecretsView.handleMessagePort'],
  Settings: [SettingsViewWorker, 'Settings.handleMessagePort'],
  SourceControl: [SourceControlWorker, 'SourceControl.handleRendererProcessMessagePort'],
  StatusBar: [StatusBarWorker, 'StatusBar.handleMessagePort'],
  TextSearch: [TextSearchViewWorker, 'TextSearch.handleMessagePort'],
  TitleBar: [TitleBarWorker, 'TitleBar.handleMessagePort'],
}

export const sendMessagePortToExtensionHostWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.handleMessagePort', port, rpcId)
}

export const sendMessagePortToSharedProcess = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SharedProcess.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToProcessExplorer = async (port) => {
  Assert.object(port)
  await SharedProcess.invokeAndTransfer('HandleMessagePortForProcessExplorer.handleMessagePortForProcessExplorer', port)
}

export const sendMessagePortToFileWatcherExplorer = async (port) => {
  Assert.object(port)
  if (await WorkspaceConnection.connectMessagePort('file-watcher-explorer', port)) {
    return
  }
  await SharedProcess.invokeAndTransfer('HandleMessagePortForFileWatcherExplorer.handleMessagePortForFileWatcherExplorer', port)
}

export const sendMessagePortToTerminalProcess = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  if (await WorkspaceConnection.connectMessagePort('terminal-process', port)) {
    return
  }
  await SharedProcess.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToErrorWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ErrorWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToDialogWorker = async (port, initialCommand) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await HandleDialogWorkerMessagePort.handleDialogWorkerMessagePort(port)
}

export const sendMessagePortToAuthWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await AuthWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToEditorWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await EditorWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToRendererProcess = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await RendererProcess.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToMarkdownWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await MarkdownWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToClipBoardWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ClipBoardWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToMainAreaWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await MainAreaWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToViewWorker = async (port, rpcId) => {
  Assert.object(port)
  Assert.string(rpcId)
  const target = directViewWorkers[rpcId]
  if (!target) {
    throw new Error(`direct view worker not found: ${rpcId}`)
  }
  const [worker, initialCommand] = target
  await worker.invokeAndTransfer(initialCommand, port, false)
}

export const sendMessagePortToFileSystemWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await FileSystemWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToIconThemeWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await IconThemeWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToTextMeasurementWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await TextMeasurementWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToTextSearchWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await TextSearchWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToSettingsWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SettingsWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToSourceControlWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await SourceControlWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToExtensionManagementWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ExtensionManagementWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToIframeWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await IframeWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToFileSearchWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await FileSearchWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToOpenerWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await OpenerWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToPreviewSandBoxWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await PreviewSandBoxWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToQuickPickWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await QuickPickWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatNetworkWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatNetworkWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatMathWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatMathWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatMessageParsingWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatMessageParsingWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatStorageWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatStorageWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatViewModel = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatViewModelWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatCoordinatorWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatCoordinatorWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

export const sendMessagePortToChatToolWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await ChatToolWorker.invokeAndTransfer(initialCommand, port, rpcId)
}
export const sendMessagePortToDiffWorker = async (port, initialCommand, rpcId) => {
  Assert.object(port)
  Assert.string(initialCommand)
  await DiffWorker.invokeAndTransfer(initialCommand, port, rpcId)
}

// TODO add only one function sendMessagePortToRpc(rpcId) which sends it to the matching rpc module
