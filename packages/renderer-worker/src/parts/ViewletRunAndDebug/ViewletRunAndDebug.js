import * as Debug from '../Debug/Debug.js'
import * as DebugPausedReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugState from '../DebugState/DebugState.js'
import * as DebugWorker from '../DebugWorker/DebugWorker.js'
import * as ExceptionBreakPoints from '../ExceptionBreakPoints/ExceptionBreakPoints.js'
import * as PauseOnExceptionState from '../PauseOnExceptionState/PauseOnExceptionState.js'
import * as Workspace from '../Workspace/Workspace.js'

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  return {
    id,
    parentUid,
    disposed: false,
    processes: [],
    debugState: DebugState.None,
    watchExpanded: false,
    breakPointsExpanded: false,
    scopeExpanded: false,
    callstackExpanded: false,
    scopeChain: [],
    callStack: [],
    parsedScripts: Object.create(null),
    pausedReason: DebugPausedReason.None,
    pausedMessage: '',
    debugInputValue: '',
    debugOutputValue: '',
    callFrameId: '',
    expandedIds: [],
    scopeFocusedIndex: -1,
    focusedIndex: -1,
    pauseOnExceptionState: PauseOnExceptionState.None,
    cache: Object.create(null), // TODO maybe store cache in extension host worker
    exceptionBreakPoints: ExceptionBreakPoints.None,
  }
}

export const loadContent = async (state, savedState) => {
  const isTest = Workspace.isTest()
  await DebugWorker.invoke('RunAndDebug.create', state.uid, state.uri, state.x, state.y, state.width, state.height)
  await DebugWorker.invoke('RunAndDebug.loadContent', state.uid, isTest, savedState)
  const diffResult = await DebugWorker.invoke('RunAndDebug.diff2', state.uid)
  const commands = await DebugWorker.invoke('RunAndDebug.render2', state.uid, diffResult)
  const actionsDom = await DebugWorker.invoke('RunAndDebug.renderActions', state.uid)
  const debugId = isTest ? 'test-debug' : 'node-debug' // TODO
  return {
    ...state,
    commands,
    actionsDom,
    debugId,
    debugState: DebugState.Default,
    scopeExpanded: true,
    callStackExpanded: true,
    isTest,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await DebugWorker.invoke('RunAndDebug.saveState', state.uid)
  await DebugWorker.restart('RunAndDebug.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await DebugWorker.invoke(
    'RunAndDebug.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    null,
    state.parentUid,
    state.platform,
  )
  await DebugWorker.invoke('RunAndDebug.loadContent', state.uid, state.isTest, savedState)
  await DebugWorker.invoke('RunAndDebug.loadContentLater', state.uid)
  const diffResult = await DebugWorker.invoke('RunAndDebug.diff2', state.uid)
  const commands = await DebugWorker.invoke('RunAndDebug.render2', state.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}

export const contentLoaded = async () => {
  // TODO
  // const debugId = Workspace.isTest() ? 'test-debug' : 'node-debug' // TODO
  // await Debug.start(debugId)
  return []
}

// TODO maybe store scope chain elements as tree
// TODO when collapsing, store collapsed elements by parent id in cache
// TODO when expanding, retrieve items from cache by parent id first
// if they don't exist, query the actual items

export const handleDebugInput = (state, value) => {
  return {
    ...state,
    debugInputValue: value,
  }
}

export const handleEvaluate = async (state) => {
  const { debugInputValue, callFrameId, debugId } = state
  const result = await Debug.evaluate(debugId, debugInputValue, callFrameId)
  const actualResult = result.result.result.value
  return {
    ...state,
    debugInputValue: '',
    debugOutputValue: `${actualResult}`,
  }
}

// TODO make sure dispose is actually called
export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}

export const saveState = async (state) => {
  const savedState = await DebugWorker.invoke('RunAndDebug.saveState', state.uid)
  return savedState
}
