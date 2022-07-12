import * as ActiveViewlet from './ActiveViewlet.js'

export const state = {
  instances: Object.create(null),
  currentSideBarView: undefined,
  currentPanelView: undefined,
  modules: Object.create(null),
}

const get = (id) => {
  switch (id) {
    case 'Explorer':
      return import('./ViewletExplorer.js')
    case 'Run and Debug':
      return import('./ViewletRunAndDebug.js')
    case 'Search':
      return import('./ViewletSearch.js')
    case 'Source Control':
      return import('./ViewletSourceControl.js')
    case 'Terminal':
      return import('./ViewletTerminal.js')
    case 'Extensions':
      return import('./ViewletExtensions.js')
    case 'Debug Console':
      return import('./ViewletDebugConsole.js')
    case 'Output':
      return import('./ViewletOutput.js')
    case 'Problems':
      return import('./ViewletProblems.js')
    case 'Empty':
      return import('./ViewletEmpty.js')
    case 'EditorText':
      return import('./ViewletEditorText.js')
    case 'EditorPlainText':
      return import('./ViewletEditorPlainText.js')
    case 'EditorImage':
      return import('./ViewletEditorImage.js')
    case 'Clock':
      return import('./ViewletClock.js')
    case 'SideBar':
      return import('./ViewletSideBar.js')
    case 'Panel':
      return import('./ViewletPanel.js')
    case 'ActivityBar':
      return import('./ViewletActivityBar.js')
    case 'ImagePreview':
      return import('../ImagePreview/ImagePreview.js')
    case 'QuickPick':
      return import('./ViewletQuickPick.js')
    case 'StatusBar':
      return import('./ViewletStatusBar.js')
    case 'TitleBar':
      return import('./ViewletTitleBar.js')
    case 'Main':
      return import('./ViewletMain.js')
    case 'EditorCompletion':
      return import('./ViewletEditorCompletion.js')
    case 'References':
      return import('./ViewletReferences.js')
    case 'Implementations':
      return import('./ViewletImplementations.js')
    default:
      throw new Error(`unknown viewlet ${id}`)
  }
}

export const mount = ($Parent, state) => {
  while ($Parent.firstChild) {
    $Parent.firstChild.remove()
  }
  $Parent.append(state.$Viewlet)
}

export const load = async (id, ...args) => {
  const module = await get(id)
  state.modules[id] = module
  state.instances[id] = {
    state: module.create(...args),
    factory: module,
  }
}

export const invoke = (viewletId, method, ...args) => {
  const instance = state.instances[viewletId]
  if (!instance) {
    console.warn(`viewlet instance ${viewletId} not found`)
    return
  }
  if (typeof instance.factory[method] !== 'function') {
    console.warn(`method ${method} not implemented`)
    return
  }
  return instance.factory[method](instance.state, ...args)
}

export const focus = (viewletId) => {
  const instance = state.instances[viewletId]
  if (instance && instance.factory && instance.factory.focus) {
    instance.factory.focus(instance.state)
  } else {
    // TODO push focusContext
  }
}

/**
 * @deprecated
 */
export const refresh = (viewletId, viewletContext) => {
  console.log('REFRESH', viewletId)
  const instance = state.instances[viewletId]
  if (instance) {
    instance.factory.refresh(instance.state, viewletContext)
  } else {
    // console.warn('no instance yet of ' + viewletId)
    state.refreshContext[viewletId] = viewletContext
  }
}

// TODO handle error when viewlet creation fails

// TODO remove send -> use invoke instead
export const send = (viewletId, method, ...args) => {
  const instance = state.instances[viewletId]
  if (instance) {
    instance.factory[method](...args)
  } else {
    // TODO
    console.warn('instance not present')
  }
}

export const sendMultiple = (commands) => {
  for (const command of commands) {
    const [_, viewletId, method, ...args] = command
    invoke(viewletId, method, ...args)
  }
}

/**
 * @deprecated
 */
export const dispose = (id) => {
  ActiveViewlet.deleteState(id)
  const instance = state.instances[id]
  try {
    instance.factory.dispose(instance.state)
    if (instance.state.$Viewlet && instance.state.$Viewlet.isConnected) {
      instance.state.$Viewlet.remove()
    }
  } catch (error) {
    console.error(error)
  }
  delete state.instances[id]
}

/**
 * @deprecated
 */
export const replace = () => {
  // TODO maybe check if viewlet can be recycled
}

export const handleError = (id, parentId, message) => {
  console.log(`[viewlet-error] ${id}: ${message}`)
  const instance = state.instances[id]
  if (instance && instance.factory && instance.factory.handleError) {
    instance.factory.handleError(instance.state, message)
    return
  }
  // TODO error should bubble up to until highest possible component
  const parentInstance = state.instances[parentId]
  if (
    parentInstance &&
    parentInstance.factory &&
    parentInstance.factory.handleError
  ) {
    parentInstance.factory.handleError(instance.state, message)
    return
  }
  if (
    instance &&
    instance.state.$Viewlet &&
    instance.state.$Viewlet.isConnected
  ) {
    instance.state.$Viewlet.textContent = message
  }
}

/**
 * @deprecated
 */
export const hydrate = (id, ...args) => {
  const module = state.modules[id]
  const instanceState = module.create(...args)
  state.instances[id] = { state: instanceState, factory: module }
}

/**
 * @deprecated
 */
export const appendViewlet = (parentId, childId, focus) => {
  if (parentId === 'Widget') {
    // TODO
    return
  }
  const parentInstanceState = state.instances[parentId] // TODO must ensure that parent is already created
  const parentModule = parentInstanceState.factory
  const childInstance = state.instances[childId]
  if (!childInstance) {
    throw new Error('child instance must be defined to be appended to parent')
  }
  parentModule.appendViewlet(
    parentInstanceState.state,
    childInstance.factory.name,
    childInstance.state.$Viewlet
  )
  if (focus) {
    childInstance.factory.focus(childInstance.state)
  }
}
