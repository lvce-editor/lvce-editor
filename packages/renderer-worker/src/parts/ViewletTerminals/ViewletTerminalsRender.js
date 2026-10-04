import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetTerminalsDom from '../GetTerminalsDom/GetTerminalsDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const renderEventListeners = () => {
  return [
    { name: 'handleTabPointerDown', params: ['handleTabPointerDown', 'event.currentTarget.dataset.terminalUid'] },
    {
      name: DomEventListenerFunctions.HandleContextMenuTerminalTab,
      params: ['handleTabContextMenu', 'event.currentTarget.dataset.terminalUid', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    { name: 'handleDragStart', params: ['handleDragStart'], dragEffect: 'move' },
    { name: 'handleDragEnd', params: ['handleDragEnd'] },
    { name: 'handleDragOver', params: ['handleDragOver'], preventDefault: true },
    { name: 'handleDrop', params: ['handleDrop', 'event.dropId'], preventDefault: true },
    {
      name: DomEventListenerFunctions.HandleClickTab,
      params: ['handleClickTab', 'event.currentTarget.dataset.index', 'event.currentTarget.dataset.terminalUid'],
    },
    {
      name: DomEventListenerFunctions.HandleClickTerminalTabAction,
      params: [
        'handleClickTerminalTabAction',
        'event.currentTarget.dataset.index',
        'event.currentTarget.dataset.command',
        'event.currentTarget.dataset.terminalUid',
      ],
      stopPropagation: true,
    },
    {
      name: DomEventListenerFunctions.HandleClickAction,
      params: ['handleClickAction', 'event.target.dataset.command'],
      stopPropagation: true,
    },
    {
      name: 'handle-terminal-rename-input',
      params: ['handleRenameTerminalFocus', 'event.currentTarget.value'],
    },
    {
      name: 'handle-terminal-rename-blur',
      params: ['acceptRenameTerminal', 'event.currentTarget.dataset.tabUid', 'event.currentTarget.value'],
    },
    {
      name: 'handle-terminal-rename-keydown',
      params: ['handleRenameTerminalKeyDown', 'event.currentTarget.dataset.tabUid', 'event.key', 'event.currentTarget.value'],
      stopPropagation: true,
    },
    {
      name: 'handle-terminal-rename-pointerdown',
      params: ['handleRenameTerminalPointerDown'],
      stopPropagation: true,
    },
  ]
}

const renderDom = {
  isEqual(oldState, newState) {
    return (
      oldState.tabs === newState.tabs &&
      oldState.childUids === newState.childUids &&
      oldState.activeTerminalUids === newState.activeTerminalUids &&
      oldState.selectedIndex === newState.selectedIndex &&
      oldState.terminalTabsEnabled === newState.terminalTabsEnabled &&
      oldState.renamingTabUid === newState.renamingTabUid
    )
  },
  apply(oldState, newState) {
    const dom = GetTerminalsDom.getTerminalsDom(newState)
    return ['Viewlet.setDom2', dom]
  },
}

export const renderFocus = {
  isEqual(oldState, newState) {
    return oldState.focusVersion === newState.focusVersion
  },
  apply(oldState, newState) {
    if (newState.childUid === -1) {
      return []
    }
    return [['Viewlet.focus', newState.childUid]]
  },
  multiple: true,
}

export const render = [renderDom, renderFocus]
