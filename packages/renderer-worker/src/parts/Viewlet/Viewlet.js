import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Command from '../Command/Command.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  instances: Object.create(null),
  modules: Object.create(null),
}

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
  const instance = state.instances[id]
  if (!instance) {
    return
  }
  await refreshInstance(instance, id)
}

/**
 * @deprecated
 */
export const send = (id, method, ...args) => {
  const instance = state.instances[id]
  if (!instance) {
    console.info('instance disposed', { id, method, args })
    console.info(state.instances)
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
  const instance = state.instances[id]
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
  delete state.instances[id]
  delete state.modules[id]
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
    const activeInstance = state.instances[id]
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
      if (newState.disposed) {
        await dispose(id)
        console.log('DISPOSED')
        return
      }
      const commands = activeInstance.factory.render(oldState, newState)
      RendererProcess.invoke(
        /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
        /* commands */ commands
      )
      state.instances[id].state = newState
    } else {
      return fn(activeInstance.state, ...args)
    }
  }
  return wrappedViewletCommand
}

export const resize = (id, dimensions) => {
  const instance = state.instances[id]
  if (!instance || !instance.factory || !instance.factory.resize) {
    console.warn('cannot resize', id)
    return []
  }
  const oldState = instance.state
  const { newState, commands } = instance.factory.resize(oldState, dimensions)
  Assert.object(newState)
  Assert.array(commands)
  state.instances[id].state = newState
  if (instance.factory.hasFunctionalRender) {
    return instance.factory.render(oldState, newState)
  }
  return commands
}

export const getState = (id) => {
  const instance = state.instances[id]
  return instance.state
}

export const setState = async (id, newState) => {
  const instance = state.instances[id]
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
  for (const [key, value] of Object.entries(state.instances)) {
    states[key] = value.state
  }
  return states
}
