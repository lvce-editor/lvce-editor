import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

/**
 * @deprecated
 */
export const focus = (id) => {
  // if(state.instances[id]){
  // }
  // console.log('focus', { id })
  // // TODO open if it is not already open
  // RendererProcess.send([/* viewletFocus */ 3027, /* id */ id])
}
// export const createOrFocus = async id=>{
//   const instance = state.instances[id] || await create(id)
// }

/**
 * @deprecated
 */
export const refreshInstance = async (instance, id) => {
  if (!instance) {
    return
  }
  if (instance.status === 'refreshing' || instance.status === 'disposed') {
    return
  }
  instance.status = 'refreshing'
  try {
    await instance.factory.refresh(instance.state)
  } catch (error) {
    if (instance.factory.handleError) {
      try {
        await instance.factory.handleError(error)
      } catch (innerError) {
        console.error(innerError)
        console.error(error)
        return
      }
    }
    // TODO use ErrorHandling.handleError
    // TODO show notification maybe
    console.error(error)
    instance.status = 'error'
    return
  }
  instance.status = 'refreshed'
}

// TODO should refresh instance?
/**
 * @deprecated
 */
export const refresh = async (id) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    return
  }
  await refreshInstance(instance, id)
}

/**
 * @deprecated
 */
export const send = (id, method, ...args) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    console.info('instance disposed', { id, method, args })
    return
  }
  const fn = instance.factory[method]
  Assert.fn(fn)
  fn(instance.state, ...args)
}

/**
 * @deprecated
 */
export const dispose = async (id) => {
  if (!id) {
    console.warn('no instance to dispose')
    return
  }
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    console.info('instance may already be disposed')
    return
  }
  // TODO status should have enum
  instance.status = 'disposing'
  try {
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    instance.factory.dispose(instance.state)
    await RendererProcess.invoke(
      /* Viewlet.dispose */ 'Viewlet.dispose',
      /* id */ id
    )
  } catch (error) {
    console.error(error)
    // TODO use Error.cause once proper stack traces are supported by chrome
    throw new Error(`Failed to dispose viewlet ${id}: ${error}`)
  }
  instance.status = 'disposed'
  ViewletStates.remove(id)
  await GlobalEventBus.emitEvent(`Viewlet.dispose.${id}`)
}

/**
 * @deprecated
 */
export const replace = () => {}

// TODO maybe wrapViewletCommand should accept module instead of id string
// then check if instance.factory matches module -> only compare reference (int) instead of string
// should be faster
export const wrapViewletCommand = (id, fn) => {
  const wrappedViewletCommand = async (...args) => {
    // TODO get actual focused instance
    const activeInstance = ViewletStates.getInstance(id)
    if (!activeInstance) {
      console.info(
        `cannot execute viewlet command ${id}.${fn.name}: no active instance for ${id}`
      )
      return
    }
    if (activeInstance.factory && activeInstance.factory.hasFunctionalRender) {
      const oldState = activeInstance.state
      const newState = await fn(oldState, ...args)
      if (!newState) {
        console.log({ fn })
      }
      Assert.object(newState)
      // console.log({ fn, newState })
      if (oldState === newState) {
        return
      }
      const commands = ViewletManager.render(
        activeInstance.factory,
        oldState,
        newState
      )
      ViewletStates.setState(id, newState)
      await RendererProcess.invoke(
        /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
        /* commands */ commands
      )
    } else {
      return fn(activeInstance.state, ...args)
    }
  }
  return wrappedViewletCommand
}

export const resize = (id, dimensions) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance || !instance.factory || !instance.factory.resize) {
    console.warn('cannot resize', id)
    return []
  }
  const oldState = instance.state
  let newState
  let commands
  if (instance.factory.hasFunctionalResize) {
    newState = instance.factory.resize(oldState, dimensions)
    if ('newState' in newState) {
      throw new Error(
        `functional resize not supported in ${instance.factory.name}`
      )
    }
    commands = ViewletManager.render(instance.factory, instance.state, newState)
  } else {
    const result = instance.factory.resize(oldState, dimensions)
    newState = result.newState
    commands = result.commands
  }
  Assert.object(newState)
  Assert.array(commands)
  ViewletStates.setState(id, newState)
  return commands
}

export const getState = (id) => {
  const instance = ViewletStates.getInstance(id)
  return instance.state
}

export const setState = async (id, newState) => {
  const instance = ViewletStates.getInstance(id)
  if (instance && instance.factory && instance.factory.hasFunctionalRender) {
    const oldState = instance.state
    const commands = instance.factory.render(oldState, newState)
    instance.state = newState
    await RendererProcess.invoke(
      /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
      /* commands */ commands
    )
  }
}

export const getAllStates = () => {
  const states = Object.create(null)
  for (const [key, value] of Object.entries(ViewletStates.getAllInstances())) {
    states[key] = value.state
  }
  return states
}

export const openWidget = async (id, ...args) => {
  console.log({ args })
  const type = args[0]
  const commands = await ViewletManager.load({
    getModule: ViewletManager.getModule,
    id,
    type: 0,
    uri: `quickPick://${type}`,
    show: false,
    focus: true,
  })
  console.log({ commands })
  await RendererProcess.invoke('Viewlet.executeCommands', commands)
  // TODO commands should be like this
  // viewlet.create quickpick
  // quickpick.setItems
  // quickpick.setFocusedIndex
  // quickpick.setValue
  // viewlet.show quickpick
  //
}

export const closeWidget = async (id) => {
  ViewletStates.remove(id)
  await RendererProcess.invoke(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ id
  )
}
