import * as InputSource from '../InputSource/InputSource.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as StorageKey from '../StorageKey/StorageKey.ts'
import * as UpdateExtensionSearchRenderState from '../UpdateExtensionSearchRenderState/UpdateExtensionSearchRenderState.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import { getKeyBindings as getActivityBarKeyBindings } from '../ViewletActivityBar/ViewletActivityBarKeyBindings.js'
import { getQuickPickMenuEntries as getActivityBarQuickPickMenuEntries } from '../ViewletActivityBar/ViewletActivityBarQuickPickMenuEntries.js'
import { getKeyBindings as getDiffViewKeyBindings } from '../ViewletDiffEditor2/ViewletExplorerKeyBindings.js'
import { menus as explorerMenus } from '../ViewletExplorer/ViewletExplorerMenuEntries.js'
import { getDisplayName as getExplorerDisplayName } from '../ViewletExplorer/ViewletExplorerName.js'
import { renderActions as renderExtensionActions } from '../ViewletExtensions/ViewletExtensionsRenderActions.js'
import { getKeyBindings as getProblemsKeyBindings } from '../ViewletProblems/ViewletProblemsKeyBindings.js'
import { menus as processExplorerMenus } from '../ViewletProcessExplorer/ViewletProcessExplorerMenuEntries.js'
import { resize as resizeTitleBar } from '../ViewletTitleBar/ViewletTitleBarResize.js'
import { wrapActivityBarCommand } from '../WrapActivityBarCommand/WrapActivityBarCommand.ts'
import { wrapDiffViewCommand } from '../WrapDiffViewCommand/WrapDiffViewCommand.ts'
import { wrapExplorerCommand } from '../WrapExplorerCommand/WrapExplorerCommand.ts'
import { wrapExtensionSearchCommand } from '../WrapExtensionSearchCommand/WrapExtensionSearchCommand.ts'
import { wrapProblemsCommand } from '../WrapProblemsCommand/WrapProblemsCommand.ts'
import { wrapProcessExplorerCommand } from '../WrapProcessExplorerCommand/WrapProcessExplorerCommand.ts'

export const activityBar = {
  extendModule() {
    return {
      ActivityBar: StorageKey.ActivityBar,
      getDisplayName() {
        return 'ActivityBar'
      },
      getKeyBindings: getActivityBarKeyBindings,
      getQuickPickMenuEntries: getActivityBarQuickPickMenuEntries,
    }
  },
  wrapCommand: wrapActivityBarCommand,
}

export const chatDebug = {
  wrapCommand(command, _defaultWrapCommand, { worker }) {
    return async (state, ...args) => {
      const result = await worker.invoke(`ChatDebug.${command}`, state.uid, ...args)
      if (command === 'getPayload' || command === 'getResponse') {
        return result
      }
      const diff = await worker.invoke('ChatDebug.diff2', state.uid)
      const commands = await worker.invoke('ChatDebug.render2', state.uid, diff)
      if (commands.length === 0) {
        return state
      }
      return { ...state, commands }
    }
  },
}

export const diffView = {
  async afterLoadContent({ isHotReload, state, worker }) {
    if (!isHotReload && state.uri.startsWith('inline-diff://')) {
      await worker.invoke('DiffView.setDiffMode', state.uid, 'inline')
    }
  },
  extendModule() {
    return { getKeyBindings: getDiffViewKeyBindings }
  },
  wrapCommand: wrapDiffViewCommand,
}

export const explorer = {
  extendCommands(Commands, _workerViewlet, { worker }) {
    Commands.getMouseActions = async () => {
      try {
        return await worker.invoke('Explorer.getMouseActions')
      } catch {
        return []
      }
    }
  },
  extendModule(_workerViewlet, { worker }) {
    const resizeWithDependencies = async (state, dimensions, invoke) => {
      await invoke('Explorer.handleResize', state.uid, dimensions)
      const diff = await invoke('Explorer.diff2', state.uid)
      if (diff.length === 0) {
        return state
      }
      const commands = await invoke('Explorer.render2', state.uid, diff)
      return { ...state, ...dimensions, commands }
    }
    return {
      dispose() {},
      getDisplayName: getExplorerDisplayName,
      async getMouseActions() {
        try {
          return await worker.invoke('Explorer.getMouseActions')
        } catch {
          return []
        }
      },
      menus: explorerMenus,
      resize(state, dimensions) {
        return resizeWithDependencies(state, dimensions, worker.invoke)
      },
      resizeWithDependencies,
      restoreState(savedState) {
        return worker.invoke('Explorer.restoreState', savedState)
      },
    }
  },
  prepareHotReloadState(state) {
    return { ...state, items: [] }
  },
  wrapCommand: wrapExplorerCommand,
}

export const extensions = {
  extendCommands(Commands, workerViewlet) {
    Commands.focus = workerViewlet.focus
  },
  extendModule() {
    return {
      dispose() {},
      focus(state) {
        return {
          ...state,
          commands: [['Viewlet.focusSelector', '[name="extensions"]']],
        }
      },
      renderActions: renderExtensionActions,
      resize(state) {
        return state
      },
    }
  },
  prepareHotReloadState(state) {
    return { ...state, items: [] }
  },
  transformRenderedState(state) {
    const renderState = UpdateExtensionSearchRenderState.updateExtensionSearchRenderState(state, state.commands)
    return {
      ...renderState,
      title: renderState.title || 'Extensions: Installed',
    }
  },
  wrapCommand: wrapExtensionSearchCommand,
}

export const preview = {
  extendModule() {
    return {
      decrement(state) {
        return { ...state, count: state.count - 1 }
      },
      dispose(state) {
        return { ...state, disposed: true }
      },
      increment(state) {
        return { ...state, count: state.count + 1 }
      },
    }
  },
  prepareLoadState(state, { isHotReload }) {
    if (isHotReload) {
      return state
    }
    const layoutState = ViewletStates.getState(ViewletModuleId.Layout)
    return { ...state, uri: layoutState.previewUri || state.uri }
  },
}

export const problems = {
  extendModule(_workerViewlet, { worker }) {
    const resizeWithDependencies = async (state, dimensions, invoke) => {
      await invoke('Problems.resize', state.uid, dimensions)
      const diff = await invoke('Problems.diff2', state.uid)
      const commands = await invoke('Problems.render2', state.uid, diff)
      return { ...state, ...dimensions, commands }
    }
    return {
      getBadgeCount() {
        return 0
      },
      getKeyBindings: getProblemsKeyBindings,
      resize(state, dimensions) {
        return resizeWithDependencies(state, dimensions, worker.invoke)
      },
      resizeWithDependencies,
    }
  },
  wrapCommand: wrapProblemsCommand,
}

export const processExplorer = {
  extendModule() {
    return { menus: processExplorerMenus }
  },
  wrapCommand: wrapProcessExplorerCommand,
}

export const quickPick = {
  extendModule() {
    return {
      dispose(state) {
        return state
      },
      saveState() {
        return {}
      },
    }
  },
  transformState(state) {
    return {
      ...state,
      inputSource: InputSource.User,
      recentPickIds: new Map(),
    }
  },
}

export const settings = {
  wrapCommand(command, _defaultWrapCommand, { worker }) {
    return async (state, ...args) => {
      await worker.invoke(`Settings.${command}`, state.uid, ...args)
      const diff = await worker.invoke('Settings.diff2', state.uid)
      if (diff.length === 0) {
        return state
      }
      const commands = await worker.invoke('Settings.render2', state.uid, diff)
      const actionsDom = await worker.invoke('Settings.renderActions', state.uid)
      if (commands.length === 0) {
        return state
      }
      const latestState = ViewletStates.getState(ViewletModuleId.Settings)
      return { ...latestState, actionsDom, commands }
    }
  },
}

export const textSearch = {
  extendModule(_workerViewlet, { wrapCommand }) {
    return {
      dispose(state) {
        return { ...state }
      },
      wrapTextSearchCommand: wrapCommand,
    }
  },
  transformState(state) {
    return {
      ...state,
      isSearchEditor: state.uri.startsWith('search-editor://'),
    }
  },
  wrapCommand(command, _defaultWrapCommand, { worker }) {
    return async (state, ...args) => {
      await worker.invoke(`TextSearch.${command}`, state.uid, ...args)
      const diff = await worker.invoke('TextSearch.diff2', state.uid, ...args)
      if (diff.length === 0) {
        return state
      }
      const commands = await worker.invoke('TextSearch.render2', state.uid, diff)
      return { ...state, commands }
    }
  },
}

export const titleBar = {
  extendModule() {
    return {
      handleFocusChange(state, isFocused) {
        return { ...state, isFocused }
      },
      resize: resizeTitleBar,
    }
  },
  prepareHotReloadState(state) {
    return { ...state, items: [] }
  },
  transformLoadedState(state, { isHotReload }) {
    if (isHotReload) {
      return state
    }
    return {
      ...state,
      isFocused: true,
      titleBarTitleEnabled: Preferences.get('titleBar.titleEnabled') ?? false,
    }
  },
  transformState(state) {
    return {
      ...state,
      controlsOverlayEnabled: Preferences.get('window.controlsOverlay.enabled') === true,
      titleBarStyleCustom: Preferences.get('window.titleBarStyle') === 'custom',
    }
  },
}
