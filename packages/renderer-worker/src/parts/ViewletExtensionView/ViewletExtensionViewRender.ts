import type { ViewletExtensionViewState } from './ViewletExtensionViewState.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderIframe = {
  isEqual(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): boolean {
    return (
      oldState.iframeSrc === newState.iframeSrc &&
      oldState.iframeSandbox === newState.iframeSandbox &&
      oldState.csp === newState.csp &&
      oldState.credentialless === newState.credentialless
    )
  },
  apply(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): readonly unknown[] {
    return ['setIframe', newState.iframeSrc, newState.iframeSandbox, '', newState.csp, newState.credentialless, newState.title]
  },
}

const renderDom = {
  isEqual(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): boolean {
    return newState.kind !== 'virtualDom' || oldState.dom === newState.dom
  },
  apply(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): readonly unknown[] {
    return ['Viewlet.setDom2', newState.dom]
  },
}

const renderPatches = {
  isEqual(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): boolean {
    return newState.kind !== 'virtualDom' || oldState.patches === newState.patches || newState.patches.length === 0
  },
  apply(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): readonly unknown[] {
    return ['Viewlet.setPatches', newState.patches]
  },
}

const renderCss = {
  isEqual(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): boolean {
    return !newState.css || (oldState.css === newState.css && oldState.cssId === newState.cssId)
  },
  apply(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): readonly unknown[] {
    return [['Viewlet.setCss', newState.cssId, newState.css]]
  },
  multiple: true,
}

const renderCommands = {
  isEqual(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): boolean {
    return newState.commands.length === 0
  },
  apply(oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): readonly unknown[] {
    return newState.commands
  },
  multiple: true,
}

export const render = [renderIframe, renderDom, renderPatches, renderCss, renderCommands]

const defaultEventListeners = [
  {
    name: 'handleInput',
    params: ['handleInput', 'event.target.name', 'event.target.value'],
  },
  {
    name: 'handleClick',
    params: ['handleClick', 'event.target.name'],
  },
  {
    name: 'handleSubmit',
    params: ['handleSubmit', 'event.target.name'],
    preventDefault: true,
  },
  {
    name: 'handleFocus',
    params: ['handleFocus', 'event.target.name'],
  },
  {
    name: 'handleBlur',
    params: ['handleBlur', 'event.target.name'],
  },
  {
    name: 'handleContextMenu',
    params: ['handleContextMenu', 'event.target.name', 'event.clientX', 'event.clientY'],
    preventDefault: true,
  },
  {
    name: 'handleDragStart',
    params: ['handleViewEvent', 'dragstart', 'event.target.name'],
  },
  {
    name: 'handleDragEnd',
    params: ['handleViewEvent', 'dragend', 'event.target.name'],
  },
  {
    name: 'handleDragOver',
    params: ['handleViewEvent', 'dragover', 'event.target.name'],
    preventDefault: true,
  },
  {
    name: 'handleDragLeave',
    params: ['handleViewEvent', 'dragleave', 'event.target.name'],
  },
  {
    name: 'handleDrop',
    params: ['handleViewEvent', 'drop', 'event.target.name'],
    preventDefault: true,
  },
]

export const renderEventListeners = (state?: ViewletExtensionViewState): readonly any[] => {
  return [
    ...defaultEventListeners,
    ...(state?.eventListeners || []),
  ]
}
