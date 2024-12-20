import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletExtensions from './ViewletExtensions.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

// prettier-ignore
export const Commands = {
  closeSuggest: ViewletExtensions.closeSuggest,
  handleInstall: ViewletExtensions.handleInstall,
  handleUninstall: ViewletExtensions.handleUninstall,
  openSuggest: ViewletExtensions.openSuggest,
  toggleSuggest: ViewletExtensions.toggleSuggest,
}

// prettier-ignore
export const LazyCommands = {
  handleClick: () => import('./ViewletExtensionsHandleClick.js'),
  handleClickCurrent: () => import('./ViewletExtensionsHandleClickCurrent.js'),
  handleClickCurrentButKeepFocus: () => import('./ViewletExtensionsHandleClickCurrentButKeepFocus.js'),
  handleContextMenu: () => import('./ViewletExtensionsHandleContextMenu.js'),
  clearSearchResults: () => import('./ViewletExtensionsClearSearchResults.js'),
  handleInput: () => import('./ViewletExtensionsHandleInput.js'),
  handleFocus: () => import('./ViewletExtensionsHandleFocus.js'),
  ...VirtualList.LazyCommands
}

const wrapCommand = (fn) => {
  const wrapped = async (state, ...args) => {
    const newState = await fn(state, ...args)
    const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render', state, newState)
    newState.commands = commands
    return newState
  }
  return wrapped
}

for (const [key, value] of Object.entries(Commands)) {
  Commands[key] = wrapCommand(value)
}
for (const [key, value] of Object.entries(LazyCommands)) {
  LazyCommands[key] = async () => {
    const module = await value()
    const fn = module[key]
    return {
      [key]: wrapCommand(fn),
    }
  }
}
