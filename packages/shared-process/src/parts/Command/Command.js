import * as ModuleId from '../ModuleId/ModuleId.js'
import * as Module from '../Module/Module.js'

const commands = Object.create(null)
const invocables = Object.create(null)
const pendingModules = Object.create(null)

const initializeModule = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      register(key, value)
    }
    return
  }
  throw new Error(`module ${module.name} is missing commands`)
}

const getOrLoadModule = (moduleId) => {
  if (!pendingModules[moduleId]) {
    const importPromise = Module.load(moduleId)
    pendingModules[moduleId] = importPromise
      .then(initializeModule)
      .catch((error) => {
        console.error(error)
      })
  }
  return pendingModules[moduleId]
}

const getModuleId = (commandId) => {
  switch (commandId) {
    case 'FileSystem.chmod':
    case 'FileSystem.copy':
    case 'FileSystem.createFile':
    case 'FileSystem.createFolder':
    case 'FileSystem.ensureFile':
    case 'FileSystem.getPathSeparator':
    case 'FileSystem.mkdir':
    case 'FileSystem.readDirWithFileTypes':
    case 'FileSystem.readFile':
    case 'FileSystem.remove':
    case 'FileSystem.rename':
    case 'FileSystem.writeFile':
      return ModuleId.FileSystem
    case 'Workspace.resolveRoot':
    case 'Workspace.getHomeDir':
      return ModuleId.Workspace
    case 'Native.openFolder':
      return ModuleId.Native
    case 'ClipBoard.readFiles':
    case 'ClipBoard.writeFiles':
      return ModuleId.ClipBoard
    case 'Developer.sharedProcessStartupPerformance':
    case 'Developer.sharedProcessMemoryUsage':
    case 'Developer.allocateMemory':
    case 'Developer.crashSharedProcess':
    case 'Developer.createHeapSnapshot':
    case 'Developer.createProfile':
    case 'Developer.getNodeStartupTiming':
    case 'Developer.getNodeStartupTime':
      return ModuleId.Developer
    case 'ExtensionHost.executeTabCompletionProvider':
    case 'ExtensionHostLanguages.getLanguages':
    case 'ExtensionHostKeyBindings.getKeyBindings':
    case 'ExtensionHost.executeCommand':
    case 'ExtensionHost.getMemoryUsage':
    case 'ExtensionHost.getSourceControlBadgeCount':
    case 'ExtensionHost.format':
    case 'ExtensionHostTextDocument.syncInitial':
    case 'ExtensionHostHover.execute':
    case 'ExtensionHostDiagnostic.execute':
    case 'ExtensionHostTextDocument':
    case 'EXtensionHostRename.executePrepareRename':
    case 'ExtensionHostRename.executeRename':
    case 'ExtensionHostDefinition.executeDefinitionProvider':
    case 'ExtensionHostFileSystem.readFile':
    case 'ExtensionHostFileSystem.writeFile':
    case 'ExtensionHostFileSystem.readDirWithFileTypes':
    case 'ExtensionHostFileSystem.remove':
    case 'ExtensionHostFileSystem.rename':
    case 'ExtensionHostSourceControl.acceptInput':
    case 'ExtensionHost.start':
    case 'ExtensionHost.dispose':
    case 'ExtensionHostManagement.activateAll':
    case 'ExtensionHostManagement.enableExtensions':
    case 'ExtensionHostFileSystem.getPathSeparator':
    case 'ExtensionHostWorkspace.setWorkspacePath':
    case 'ExtensionHostOutput.getOutputChannels':
    case 'ExtensionHost.getStatusBarItems':
    case 'ExtensionHost.registerChangeListener':
    case 'ExtensionHostTextDocument.setLanguageId':
    case 'ExtensionHostQuickPick.handleQuickPickResult':
    case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
    case 'ExtensionHostReferences.executeReferenceProvider':
    case 'ExtensionHostImplementation.executeImplementationProvider':
    case 'ExtensionHostClosingTag.executeTypeDefinitionProvider':
    case 'ExtensionHostClosingTag.execute':
    case 'ExtensionHostTextDocument.syncFull':
    case 'ExtensionHost.setWorkspacePath':
    case 'ExtensionHost.enableExtension':
    case 'ExtensionHostCompletion.execute':
    case 'ExtensionHostTextDocument.syncIncremental':
    case 'ExtensionHostClosingTag.executeClosingTagProvider':
    case 'ExtensionHost.sourceControlGetChangedFiles':
    case 'ExtensionHostSemanticTokens.executeSemanticTokenProvider':
      return ModuleId.ExtensionHost
    case 'ExtensionHost.getColorThemeJson':
    case 'ExtensionHost.getColorThemeNames':
    case 'ExtensionHost.getColorThemes':
    case 'ExtensionHost.getIconTheme':
    case 'ExtensionHost.getIconThemeJson':
    case 'ExtensionHost.getLanguageConfiguration':
    case 'ExtensionHost.getLanguages':
    case 'ExtensionManagement.disable':
    case 'ExtensionManagement.enable':
    case 'ExtensionManagement.getAllExtensions':
    case 'ExtensionManagement.getExtensions':
    case 'ExtensionManagement.install':
    case 'ExtensionManagement.uninstall':
      return ModuleId.ExtensionManagement
    case 'Search.search':
      return ModuleId.Search
    case 'Platform.getAppDir':
    case 'Platform.getBuiltinExtensionsPath':
    case 'Platform.getCachedExtensionsPath':
    case 'Platform.getCacheDir':
    case 'Platform.getConfigDir':
    case 'Platform.getDataDir':
    case 'Platform.getDisabledExtensionsPath':
    case 'Platform.getExtensionsPath':
    case 'Platform.getHomeDir':
    case 'Platform.getLogsDir':
    case 'Platform.getMarketplaceUrl':
    case 'Platform.getRecentlyOpenedPath':
    case 'Platform.getTestPath':
    case 'Platform.getUserSettingsPath':
    case 'Platform.setEnvironmentVariables':
      return ModuleId.Platform
    case 'Terminal.create':
    case 'Terminal.dispose':
    case 'Terminal.write':
    case 'Terminal.resize':
      return ModuleId.Terminal
    case 'Preferences.getAll':
      return ModuleId.Preferences
    case 4820:
      return ModuleId.TextDocument
    case 5621:
      return ModuleId.WebSocketServer
    case 'SearchFile.searchFile':
      return ModuleId.SearchFile
    case 'OutputChannel.open':
    case 'OutputChannel.close':
      return ModuleId.OutputChannel
    case 'RecentlyOpened.addPath':
      return ModuleId.RecentlyOpened
    default:
      throw new Error(`[shared-process] command ${commandId} not found`)
  }
}

const loadCommand = (command) => getOrLoadModule(getModuleId(command))

export const register = (commandId, listener) => {
  commands[commandId] = listener
}

export const registerInvocable = (commandId, listener) => {
  invocables[commandId] = listener
}

export const invoke = async (command, ...args) => {
  if (!(command in commands)) {
    await loadCommand(command)
    if (!(command in commands)) {
      console.warn(`[shared process] Unknown command "${command}"`)
      throw new Error(`Command ${command} not found`)
    }
  }
  if (typeof commands[command] !== 'function') {
    throw new TypeError(`Command ${command} is not a function`)
  }
  return commands[command](...args)
}

export const execute = (command, ...args) => {
  if (command in commands) {
    commands[command](...args)
  } else {
    loadCommand(command)
      // TODO can skip then block in prod (only to prevent endless loop in dev)
      .then(() => {
        if (!(command in commands)) {
          console.warn(`Unknown command "${command}"`)
          return
        }
        try {
          execute(command, ...args)
        } catch (error) {
          console.error('[shared process] command failed to execute')
          console.error(error)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
