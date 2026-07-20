import * as IsTest from '../IsTest/IsTest.js'
import * as NormalizeRendererCommands from '../NormalizeRendererCommands/NormalizeRendererCommands.js'
import * as RequestAnimationFrame from '../RequestAnimationFrame/RequestAnimationFrame.js'
import * as Timestamp from '../Timestamp/Timestamp.js'

const kAddCssStyleSheet = 'Css.addCssStyleSheet'
const kDispose = 'Viewlet.dispose'
const kSendMultiple = 'Viewlet.sendMultiple'
const kSetCss = 'Viewlet.setCss'
const kSetPatches = 'Viewlet.setPatches'
const minimumFrameDuration = 16

export const state = {
  frameCount: 0,
  lastFrameTime: Number.NEGATIVE_INFINITY,
  /** @type {{commands: any[], promise: Promise<any>} | undefined} */
  pendingFrame: undefined,
  /** @type {any} */
  rpc: undefined,
  tail: Promise.resolve(),
}

const enqueue = (operation) => {
  const promise = state.tail.then(operation)
  state.tail = promise.catch(() => {})
  return promise
}

const waitForEligibleFrame = () => {
  if (IsTest.isTest()) {
    return Promise.resolve(Timestamp.now())
  }
  return new Promise((resolve) => {
    const handleFrame = (timestamp) => {
      if (timestamp - state.lastFrameTime < minimumFrameDuration) {
        RequestAnimationFrame.requestAnimationFrame(handleFrame)
        return
      }
      resolve(timestamp)
    }
    RequestAnimationFrame.requestAnimationFrame(handleFrame)
  })
}

const invokeWithCacheRecovery = async (method, ...params) => {
  try {
    return await state.rpc.invoke(method, ...params)
  } catch (error) {
    NormalizeRendererCommands.reset()
    throw error
  }
}

const runFrame = async (frame) => {
  const timestamp = await waitForEligibleFrame()
  if (state.pendingFrame === frame) {
    state.pendingFrame = undefined
  }
  const commands = NormalizeRendererCommands.normalizeCommands(frame.commands)
  if (commands.length === 0) {
    return
  }
  state.frameCount++
  try {
    return await invokeWithCacheRecovery(kSendMultiple, commands)
  } finally {
    state.lastFrameTime = Math.max(timestamp, Timestamp.now())
  }
}

const sealPendingFrame = () => {
  state.pendingFrame = undefined
}

const invokeDirectRendererCommand = async (method, params) => {
  const commands = NormalizeRendererCommands.normalizeCommands([[method, ...params]])
  if (commands.length === 0) {
    return
  }
  const [command] = commands
  return invokeWithCacheRecovery(command[0], ...command.slice(1))
}

const invokeCssStyleSheet = async (id, text) => {
  if (NormalizeRendererCommands.getCssText(id) === text) {
    return
  }
  NormalizeRendererCommands.setCssText(id, text)
  return invokeWithCacheRecovery(kAddCssStyleSheet, id, text)
}

export const reset = (rpc) => {
  NormalizeRendererCommands.reset()
  state.frameCount = 0
  state.lastFrameTime = Number.NEGATIVE_INFINITY
  state.pendingFrame = undefined
  state.rpc = rpc
  state.tail = Promise.resolve()
}

export const sendMultiple = (commands) => {
  if (state.pendingFrame) {
    state.pendingFrame.commands.push(...commands)
    return state.pendingFrame.promise
  }
  /** @type {{commands: any[], promise: Promise<any>}} */
  const frame = {
    commands: [...commands],
    promise: Promise.resolve(),
  }
  state.pendingFrame = frame
  frame.promise = enqueue(() => runFrame(frame))
  return frame.promise
}

export const invoke = (method, ...params) => {
  if (method === kSendMultiple) {
    return sendMultiple(params[0])
  }
  sealPendingFrame()
  return enqueue(async () => {
    if (method === kAddCssStyleSheet) {
      return invokeCssStyleSheet(params[0], params[1])
    }
    if (method === kDispose || method === kSetCss || method === kSetPatches) {
      return invokeDirectRendererCommand(method, params)
    }
    return invokeWithCacheRecovery(method, ...params)
  })
}

export const invokeAndTransfer = (method, ...params) => {
  sealPendingFrame()
  return enqueue(async () => {
    try {
      return await state.rpc.invokeAndTransfer(method, ...params)
    } catch (error) {
      NormalizeRendererCommands.reset()
      throw error
    }
  })
}
