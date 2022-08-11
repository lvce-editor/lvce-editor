const MODULE_FILE_SYSTEM = 1
const MODULE_WORKSPACE = 2
const MODULE_TERMINAL = 3
const MODULE_SEARCH = 5
const MODULE_SEARCH_FILE = 6
const MODULE_OUTPUT_CHANNEL = 7
const MODULE_DEVELOPER = 8
const MODULE_EXTENSION_MANAGEMENT = 9
const MODULE_EXTENSION_HOST = 10
const MODULE_PREFERENCES = 11
const MODULE_NATIVE = 12
const MODULE_CLIPBOARD = 13
const MODULE_TEXT_DOCUMENT = 14
const MODULE_ELECTRON = 15
const MODULE_WEBSOCKET_SERVER = 16
const MODULE_PLATFORM = 17

const commands = Object.create(null)
const invocables = Object.create(null)

const pendingModules = Object.create(null)

const loadModule = (moduleId) => {
  switch (moduleId) {
    case MODULE_FILE_SYSTEM:
      return import('../FileSystem/FileSystem.ipc.js')
    case MODULE_WORKSPACE:
      return import('../Workspace/Workspace.ipc.js')
    case MODULE_TERMINAL:
      return import('../Terminal/Terminal.ipc.js')
    case MODULE_SEARCH:
      return import('../Search/Search.ipc.js')
    case MODULE_SEARCH_FILE:
      return import('../SearchFile/SearchFile.ipc.js')
    case MODULE_OUTPUT_CHANNEL:
      return import('../OutputChannel/OutputChannel.ipc.js')
    case MODULE_DEVELOPER:
      return import('../Developer/Developer.ipc.js')
    case MODULE_EXTENSION_MANAGEMENT:
      return import('../ExtensionManagement/ExtensionManagement.ipc.js')
    case MODULE_EXTENSION_HOST:
      return import('../ExtensionHost/ExtensionHost.ipc.js')
    case MODULE_PREFERENCES:
      return import('../Preferences/Preferences.ipc.js')
    case MODULE_NATIVE:
      return import('../Native/Native.ipc.js')
    case MODULE_CLIPBOARD:
      return import('../ClipBoard/ClipBoard.ipc.js')
    case MODULE_TEXT_DOCUMENT:
      return import('../TextDocument/TextDocument.ipc.js')
    case MODULE_ELECTRON:
      return import('../Electron/Electron.ipc.js')
    case MODULE_WEBSOCKET_SERVER:
      return import('../WebSocketServer/WebSocketServer.ipc.js')
    case MODULE_PLATFORM:
      return import('../Platform/Platform.ipc.js')
    default:
      throw new Error(`unknown module ${moduleId}`)
  }
}

const initializeModule = (module) => {
  if (typeof module.__initialize__ !== 'function') {
    if (module.Commands) {
      for (const [key, value] of Object.entries(module.Commands)) {
        register(key, value)
      }
      return
    }
    throw new Error(
      `module ${module.name} is missing an initialize function and commands`
    )
  }
  return module.__initialize__()
}

const getOrLoadModule = (moduleId) => {
  if (!pendingModules[moduleId]) {
    const importPromise = loadModule(moduleId)
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
    case 'FileSystem.readFile':
    case 'FileSystem.writeFile':
    case 'FileSystem.readDirWithFileTypes':
    case 'FileSystem.remove':
    case 'FileSystem.mkdir':
    case 'FileSystem.createFile':
    case 'FileSystem.createFolder':
    case 'FileSystem.rename':
    case 'FileSystem.ensureFile':
    case 'FileSystem.copy':
    case 'FileSystem.getPathSeparator':
      return MODULE_FILE_SYSTEM
    case 'Workspace.resolveRoot':
    case 'Workspace.getHomeDir':
      return MODULE_WORKSPACE
    case 'Native.openFolder':
      return MODULE_NATIVE
    case 'ClipBoard.readFiles':
    case 'ClipBoard.writeFiles':
      return MODULE_CLIPBOARD
    case 'Developer.sharedProcessStartupPerformance':
    case 'Developer.sharedProcessMemoryUsage':
    case 'Developer.allocateMemory':
    case 'Developer.crashSharedProcess':
    case 'Developer.createHeapSnapshot':
    case 'Developer.createProfile':
    case 'Developer.getNodeStartupTiming':
    case 'Developer.getNodeStartupTime':
      return MODULE_DEVELOPER
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
      return MODULE_EXTENSION_HOST
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
      return MODULE_EXTENSION_MANAGEMENT
    case 'Search.search':
      return MODULE_SEARCH
    case 'Platform.getConfigDir':
    case 'Platform.getAppDir':
    case 'Platform.getHomeDir':
    case 'Platform.getDataDir':
    case 'Platform.getExtensionsPath':
    case 'Platform.getBuiltinExtensionsPath':
    case 'Platform.getDisabledExtensionsPath':
    case 'Platform.getCachedExtensionsPath':
    case 'Platform.getMarketplaceUrl':
    case 'Platform.getLogsDir':
    case 'Platform.getUserSettingsPath':
    case 'Platform.getRecentlyOpenedPath':
    case 'Platform.getCacheDir':
    case 'Platform.setEnvironmentVariables':
      return MODULE_PLATFORM
    case 'Terminal.create':
    case 'Terminal.dispose':
    case 'Terminal.write':
    case 'Terminal.resize':
      return MODULE_TERMINAL
    case 'Preferences.getAll':
      return MODULE_PREFERENCES
    case 4820:
      return MODULE_TEXT_DOCUMENT
    case 5621:
      return MODULE_WEBSOCKET_SERVER
    case 'SearchFile.searchFile':
      return MODULE_SEARCH_FILE
    case 'OutputChannel.open':
    case 'OutputChannel.close':
      return MODULE_OUTPUT_CHANNEL
    case 'Electron.toggleDevtools':
    case 'Electron.windowMinimize':
    case 'Electron.windowMaximize':
    case 'Electron.windowUnmaximize':
    case 'Electron.windowClose':
    case 'Electron.about':
    case 'Electron.showOpenDialog':
    case 'Electron.windowReload':
    case 'Electron.getPerformanceEntries':
    case 'Electron.crashMainProcess':
    case 'Electron.showMessageBox':
    case 'Electron.windowOpenNew':
    case 'Electron.exit':
    case 'Electron.openProcessExplorer':
      return MODULE_ELECTRON
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
