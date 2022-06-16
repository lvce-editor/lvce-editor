import { basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import VError from 'verror'
import * as Debug from '../Debug/Debug.js'
import { ExecutionError } from '../Error/Error.js'
import pTimeout from 'p-timeout'
import * as Constants from '../Constants/Contants.js'

export const state = {
  modules: Object.create(null),
  states: Object.create(null),
}

// TODO what if there are two extensions with the same id?
export const disable = async (extension) => {
  if (state.states[extension.id] === 'running') {
    const module = state.modules[extension.id]
    try {
      await module.deactivate()
    } catch (error) {
      // @ts-ignore
      console.error(new VError(error, 'deactivating extension failed'))
      state.states[extension.id] = 'error'
    }
  }
  delete state.states[extension.id]
}

const getId = (extension) => {
  if (extension && extension.id) {
    return extension.id
  }
  if (extension && extension.path) {
    return basename(extension.path)
  }
  return '<unknown>'
}

const getType = (unknownThing) => {
  if (Array.isArray(unknownThing)) {
    return 'array'
  }
  return typeof unknownThing
}

// TODO maybe rename to activate
export const enable = async (extension) => {
  const id = getId(extension)
  if (!extension) {
    throw new VError(`extension must be defined but is ${extension}`)
  }
  if (!extension.main) {
    return
  }
  const mainType = getType(extension.main)
  if (mainType !== 'string') {
    const PrettyError = await import('../PrettyError/PrettyError.js')
    const jsonError = PrettyError.prepareJsonError(extension, 'main')
    const error = new VError(
      `Failed to load extension "${id}": Property \`main\` must be of type \`string\` but is of type \`${mainType}\``
    )
    error.stack = jsonError.stack
    // @ts-ignore
    error.codeFrame = jsonError.codeFrame
    throw error
  }
  state.states[id] = 'loading'
  let module
  try {
    // @ts-ignore
    module = await import(pathToFileURL(`${extension.path}/${extension.main}`))
  } catch (error) {
    throw new ExecutionError({
      message: `Failed to load extension "${id}"`,
      cause: error,
    })
  }
  state.modules[extension.id] = module
  try {
    await pTimeout(module.activate(), Constants.ExtensionActivationTimeout)
  } catch (error) {
    // console.error(error)
    state.states[extension.id] = 'error'
    throw new ExecutionError({
      cause: error,
      message: `Failed to activate extension "${id}"`,
    })
  }
  state.states[extension.id] = 'running'
}

// TODO add tests
// TODO add tests when type of exit hook is not a function
// TODO add test when module has no exit hook
// TODO add test when exit hook is async (should always be sync)

export const runExitHooks = () => {
  Debug.debug('running exit hooks')
  for (const module of Object.values(state.modules)) {
    if (module.exitHook) {
      module.exitHook()
    }
  }
}
