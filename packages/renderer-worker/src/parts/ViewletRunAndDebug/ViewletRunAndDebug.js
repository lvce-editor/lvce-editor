import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.ts'
import * as Debug from '../Debug/Debug.js'
import * as DebugPausedReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugState from '../DebugState/DebugState.js'
import * as Focus from '../Focus/Focus.js'
import * as GetCallStack from '../GetCallStack/GetCallStack.js'
import * as GetChildScopeChain from '../GetChildScopeChain/GetChildScopeChain.js'
import * as GetDebugPausedMessage from '../GetDebugPausedMessage/GetDebugPausedMessage.js'
import * as InputName from '../InputName/InputName.js'
import * as GetScopeChain from '../GetScopeChain/GetScopeChain.js'
import * as ExceptionBreakPoints from '../ExceptionBreakPoints/ExceptionBreakPoints.js'
import * as DebugWorker from '../DebugWorker/DebugWorker.js'
import * as PauseOnExceptionState from '../PauseOnExceptionState/PauseOnExceptionState.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
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

export const loadContent = async (state) => {
  const isTest = Workspace.isTest()
  const savedState = {}
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
  const diffResult = await DebugWorker.invoke('RunAndDebug.diff2', state.uid)
  const commands = await DebugWorker.invoke('RunAndDebug.render2', state.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}

export const contentLoaded = async (state) => {
  // TODO
  // const debugId = Workspace.isTest() ? 'test-debug' : 'node-debug' // TODO
  // await Debug.start(debugId)
  return []
}

export const handlePaused = async (state, params) => {
  const { debugId } = state
  const callStack = GetCallStack.getCallStack(params.callFrames)
  const objectId = params.callFrames[0].scopeChain[0].object.objectId
  const callFrameId = params.callFrames[0].callFrameId
  const properties = await Debug.getProperties(debugId, objectId)
  const thisObject = params.callFrames[0].this
  Assert.object(thisObject)
  const scopeChain = GetScopeChain.getScopeChain(params, thisObject, params.callFrames[0].scopeChain, {
    [objectId]: properties,
  })
  const pausedReason = params.reason
  const pausedMessage = GetDebugPausedMessage.getDebugPausedMessage(params.reason)
  return {
    ...state,
    debugState: DebugState.Paused,
    scopeChain,
    scopeExpanded: true,
    callStack,
    pausedReason,
    pausedMessage,
    callFrameId,
    expandedIds: [objectId],
  }
}

export const handleResumed = (state) => {
  return {
    ...state,
    debugState: DebugState.Default,
    scopeChain: [],
    callStack: [],
    pausedMessage: '',
    pausedReason: DebugPausedReason.None,
    callFrameId: '',
  }
}

export const handleScriptParsed = (state, parsedScript) => {
  const { parsedScripts } = state
  return {
    ...state,
    parsedScripts: {
      ...parsedScripts,
      [parsedScript.id]: parsedScript,
    },
  }
}

const getElementIndex = (debugId, scopeChain, text) => {
  for (let i = 0; i < scopeChain.length; i++) {
    const element = scopeChain[i]
    if (element.key === text) {
      return i
    }
  }
  return -1
}

const getCollapsedScopeChain = (cache, scopeChain, element, index) => {
  const indent = element.indent
  for (let i = index + 1; i < scopeChain.length; i++) {
    if (scopeChain[i].indent <= indent) {
      const newItems = scopeChain.slice(index + 1, i)
      const newCache = {
        ...cache,
        [scopeChain[index].objectId]: newItems,
      }
      return {
        newScopeChain: [...scopeChain.slice(0, index + 1), ...scopeChain.slice(i)],
        newCache,
      }
    }
  }
  return {
    newScopeChain: scopeChain,
    newCache: cache,
  }
}

// TODO maybe store scope chain elements as tree
// TODO when collapsing, store collapsed elements by parent id in cache
// TODO when expanding, retrieve items from cache by parent id first
// if they don't exist, query the actual items

const collapse = (state, expandedIds, scopeChain, element, index) => {
  const { cache } = state
  const newExpandedIds = Arrays.removeElement(expandedIds, element.objectId)
  const { newScopeChain, newCache } = getCollapsedScopeChain(cache, scopeChain, element, index)
  return {
    ...state,
    expandedIds: newExpandedIds,
    scopeChain: newScopeChain,
    scopeFocusedIndex: index,
    cache: newCache,
  }
}

const expand = async (state, expandedIds, scopeChain, element, index, debugId) => {
  const { cache } = state
  const newScopeChain = await GetChildScopeChain.getChildScopeChain(cache, index, debugId, scopeChain)
  const objectId = scopeChain[index].objectId
  const newExpandedIds = [...expandedIds, objectId]
  return {
    ...state,
    scopeChain: newScopeChain,
    expandedIds: newExpandedIds,
    scopeFocusedIndex: index,
  }
}

export const handleClickScopeValue = async (state, text) => {
  const { scopeChain, debugId, expandedIds } = state
  Focus.setFocus(WhenExpression.FocusDebugScope)
  const index = getElementIndex(debugId, scopeChain, text)
  const element = scopeChain[index]
  if (expandedIds.includes(element.objectId)) {
    return collapse(state, expandedIds, scopeChain, element, index)
  }
  return expand(state, expandedIds, scopeChain, element, index, debugId)
}

export const resume = async (state) => {
  const { debugId } = state
  await Debug.resume(debugId)
  return state
}

export const pause = async (state) => {
  const { debugId } = state
  await Debug.pause(debugId)
  return state
}

export const togglePause = async (state) => {
  const { debugState } = state
  if (debugState === DebugState.Default) {
    return pause(state)
  }
  return resume(state)
}

export const stepOver = async (state) => {
  const { debugId } = state
  await Debug.stepOver(debugId)
  return state
}

export const stepInto = async (state) => {
  const { debugId } = state
  await Debug.stepInto(debugId)
  return state
}

export const stepOut = async (state) => {
  const { debugId } = state
  await Debug.stepOut(debugId)
  return state
}

export const handleClickSectionWatch = (state) => {
  const { watchExpanded } = state
  return {
    ...state,
    watchExpanded: !watchExpanded,
    focusedIndex: 0, // TODO don't hardcode number
  }
}

export const handleClickSectionBreakPoints = (state) => {
  const { breakPointsExpanded } = state
  return {
    ...state,
    breakPointsExpanded: !breakPointsExpanded,
    focusedIndex: 1, // TODO don't hardcode number
  }
}

export const handleClickSectionScope = (state) => {
  const { scopeExpanded } = state
  return {
    ...state,
    scopeExpanded: !scopeExpanded,
    focusedIndex: 2, // TODO don't hardcode number
  }
}

export const handleClickSectionCallstack = (state) => {
  const { callStackExpanded } = state
  return {
    ...state,
    callStackExpanded: !callStackExpanded,
  }
}

export const handleClickSectionHeading = (state, text) => {
  switch (text) {
    case 'Watch':
      return handleClickSectionWatch(state)
    case 'Breakpoints':
    case 'BreakPoints':
      return handleClickSectionBreakPoints(state)
    case 'Scope':
      return handleClickSectionScope(state)
    case 'Call Stack':
      return handleClickSectionCallstack(state)
    default:
      return state
  }
}

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

export const handleArrowLeft = (state) => {
  const { focusedIndex } = state
  if (focusedIndex === 2) {
    return {
      ...state,
      scopeExpanded: false,
    }
  }
  return state
}

export const handleArrowRight = (state) => {
  const { focusedIndex } = state
  if (focusedIndex === 2) {
    return {
      ...state,
      scopeExpanded: true,
    }
  }
  return state
}

export const handleArrowUp = (state) => {
  return state
}

export const handleArrowDown = (state) => {
  return state
}

export const focusPrevious = (state) => {
  return state
}

export const focusNext = (state) => {
  return state
}

export const setPauseOnExceptions = async (state, value) => {
  const { debugId } = state
  await Debug.setPauseOnExceptions(debugId, value)
  return {
    ...state,
    exceptionBreakPoints: value,
  }
}

export const handleClickPauseOnExceptions = (state) => {
  const { exceptionBreakPoints } = state
  switch (exceptionBreakPoints) {
    case ExceptionBreakPoints.None:
      return setPauseOnExceptions(state, ExceptionBreakPoints.All)
    case ExceptionBreakPoints.Uncaught:
      return setPauseOnExceptions(state, ExceptionBreakPoints.All)
    case ExceptionBreakPoints.All:
      return setPauseOnExceptions(state, ExceptionBreakPoints.None)
    default:
      return state
  }
}

export const handleClickPauseOnUncaughtExceptions = (state) => {
  const { exceptionBreakPoints } = state
  switch (exceptionBreakPoints) {
    case ExceptionBreakPoints.None:
      return setPauseOnExceptions(state, ExceptionBreakPoints.Uncaught)
    case ExceptionBreakPoints.Uncaught:
      return setPauseOnExceptions(state, ExceptionBreakPoints.None)
    case ExceptionBreakPoints.All:
      return setPauseOnExceptions(state, ExceptionBreakPoints.None)
    default:
      return state
  }
}

export const handleClickCheckBox = (state, name) => {
  switch (name) {
    case InputName.PauseOnExceptions:
      return handleClickPauseOnExceptions(state)
    case InputName.PauseOnUncaughtExceptions:
      return handleClickPauseOnUncaughtExceptions(state)
    default:
      throw new Error('unknown input name')
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
