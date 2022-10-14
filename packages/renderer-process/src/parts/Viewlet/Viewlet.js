import * as Assert from '../Assert/Assert.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'

export const state = {
  instances: Object.create(null),
  currentSideBarView: undefined,
  currentPanelView: undefined,
  modules: Object.create(null),
}

export const mount = ($Parent, state) => {
  $Parent.replaceChildren(state.$Viewlet)
}

export const load = async (id, ...args) => {
  const module = await ViewletModule.load(id)
  state.modules[id] = module
  state.instances[id] = {
    state: module.create(...args),
    factory: module,
  }
}

export const create = (id) => {
  const module = state.modules[id]
  state.instances[id] = {
    state: module.create(),
    factory: module,
  }
}

export const loadModule = async (id) => {
  const module = await ViewletModule.load(id)
  state.modules[id] = module
}

export const invoke = (viewletId, method, ...args) => {
  const instance = state.instances[viewletId]
  if (!instance) {
    console.warn(`viewlet instance ${viewletId} not found`)
    return
  }
  if (typeof instance.factory[method] !== 'function') {
    console.warn(`method ${method} in ${viewletId} not implemented`)
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

// TODO this code is bad
export const sendMultiple = (commands) => {
  for (const command of commands) {
    const [_, viewletId, method, ...args] = command
    if (_ === 'Viewlet.ariaAnnounce') {
      ariaAnnounce(viewletId)
    } else if (_ === 'Viewlet.setBounds') {
      setBounds(viewletId, method, ...args)
    } else if (_ === 'Viewlet.create') {
      create(viewletId)
    } else if (_ === 'Viewlet.append') {
      append(viewletId, method)
    } else {
      invoke(viewletId, method, ...args)
    }
  }
}

/**
 * @deprecated
 */
export const dispose = (id) => {
  Assert.string(id)
  const instance = state.instances[id]
  if (!instance) {
    console.warn(`viewlet instance ${id} not found and cannot be disposed`)
    return
  }
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
    console.log('parent instance', parentInstance)
    return
  }
  if (
    instance &&
    instance.state.$Viewlet &&
    instance.state.$Viewlet.isConnected
  ) {
    instance.state.$Viewlet.textContent = `${message}`
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
  if (focus && childInstance.factory.focus) {
    childInstance.factory.focus(childInstance.state)
  }
}

const ariaAnnounce = async (message) => {
  const AriaAlert = await import('../AriaAlert/AriaAlert.js')
  AriaAlert.alert(message)
}

const append = (parentId, childId) => {
  const parentInstance = state.instances[parentId]
  const $Parent = parentInstance.state.$Viewlet
  const childInstance = state.instances[childId]
  const $Child = childInstance.state.$Viewlet
  $Parent.append($Child)
}

const appendToBody = (childId) => {
  const $Parent = document.body
  const childInstance = state.instances[childId]
  const $Child = childInstance.state.$Viewlet
  console.log({ childId, $Child })
  $Parent.append($Child)
  console.log(document.body.innerHTML)
}

export const executeCommands = (commands) => {
  for (const [command, ...args] of commands) {
    switch (command) {
      case 'Viewlet.create':
        create(...args)
        break
      case 'Viewlet.send':
        invoke(...args)
        break
      case 'Viewlet.show':
        show(...args)
        break
      case 'Viewlet.dispose':
        dispose(...args)
        break
      case 'Viewlet.setBounds':
        setBounds(...args)
        break
      case 'Viewlet.ariaAnnounce':
        ariaAnnounce(...args)
        break
      case 'Viewlet.append':
        append(...args)
        break
      case 'Viewlet.appendToBody':
        appendToBody(...args)
        break
      default:
        throw new Error(`unknown command ${command}`)
    }
  }
}

export const show = (id) => {
  const instance = state.instances[id]
  const $Viewlet = instance.state.$Viewlet
  const $Workbench = document.getElementById('Workbench')
  $Workbench.append($Viewlet)
  if (instance.factory.focus) {
    instance.factory.focus(instance.state)
  }
}

export const setBounds = (id, left, top, width, height) => {
  const instance = state.instances[id]
  const $Viewlet = instance.state.$Viewlet
  $Viewlet.style.left = `${left}px`
  $Viewlet.style.top = `${top}px`
  $Viewlet.style.width = `${width}px`
  $Viewlet.style.height = `${height}px`
}
