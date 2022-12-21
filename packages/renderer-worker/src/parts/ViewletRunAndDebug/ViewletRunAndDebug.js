import * as Debug from '../Debug/Debug.js'
import * as DebugDisplay from '../DebugDisplay/DebugDisplay.js'
import * as DebugPausedReason from '../DebugPausedReason/DebugPausedReason.js'

export const create = (id) => {
  return {
    id,
    disposed: false,
    processes: [],
    debugState: 'none',
    watchExpanded: false,
    breakPointsExpanded: false,
    scopeExpanded: false,
    callstackExpanded: false,
    scopeChain: [],
    callStack: [],
    parsedScripts: Object.create(null),
    pausedReason: DebugPausedReason.None,
  }
}

export const loadContent = async (state) => {
  const debugState = Debug.create('node-debug')
  const { debugId } = debugState
  await Debug.start(debugId)
  const processes = await Debug.listProcesses(debugId)
  return {
    ...state,
    processes,
    debugId,
    debugState: 'default',
  }
}

const getPropertyValueLabel = (property) => {
  switch (property.type) {
    case 'number':
      return property.description
    case 'undefined':
      return `undefined`
    default:
      return `${JSON.stringify(property)}`
  }
}

const toDisplayScopeChain = (scopeChain, knownProperties) => {
  const elements = []
  for (const scope of scopeChain) {
    const label = DebugDisplay.getScopeLabel(scope)
    elements.push({ label, indent: 10 })
    const children = knownProperties[scope.object.objectId]
    if (children) {
      for (const child of children.result.result) {
        const valueLabel = getPropertyValueLabel(child.value)
        const label = `${child.name}: ${valueLabel}`
        elements.push({
          label,
          indent: 20,
        })
      }
    }
  }
  return elements
}

const toDisplayCallStack = (callFrames) => {
  const callStack = []
  for (const callFrame of callFrames) {
    callStack.push({
      functionName: callFrame.functionName || '(anonymous)',
      functionLocation: callFrame.functionLocation,
    })
  }
  return callStack
}

export const handlePaused = async (state, params) => {
  const callStack = toDisplayCallStack(params.callFrames)
  const objectId = params.callFrames[0].scopeChain[0].object.objectId
  const { debugId } = state
  const properties = await Debug.getProperties(debugId, objectId)
  const scopeChain = toDisplayScopeChain(params.callFrames[0].scopeChain, {
    [objectId]: properties,
  })
  const pausedReason = params.reason
  return {
    ...state,
    debugState: 'paused',
    scopeChain,
    scopeExpanded: true,
    callStack,
    pausedReason,
  }
}

export const handleResumed = (state) => {
  return {
    ...state,
    debugState: 'default',
    scopeChain: [],
    callStack: [],
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
  if (debugState === 'default') {
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
  }
}

export const handleClickSectionBreakPoints = (state) => {
  const { breakPointsExpanded } = state
  return {
    ...state,
    breakPointsExpanded: !breakPointsExpanded,
  }
}

export const handleClickSectionScope = (state) => {
  const { scopeExpanded } = state
  return {
    ...state,
    scopeExpanded: !scopeExpanded,
  }
}

export const handleClickSectionCallstack = (state) => {
  const { callStackExpanded } = state
  return {
    ...state,
    callStackExpanded: !callStackExpanded,
  }
}

// TODO make sure dispose is actually called
export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

export const hasFunctionalResize = true

const renderProcesses = {
  isEqual(oldState, newState) {
    return oldState.processes === newState.processes
  },
  apply(oldState, newState) {
    return [/* method */ 'setProcesses', /* processes */ newState.processes]
  },
}

const renderDebugState = {
  isEqual(oldState, newState) {
    return oldState.debugState === newState.debugState
  },
  apply(oldState, newState) {
    return [/* method */ 'setDebugState', /* buttons */ newState.debugState]
  },
}

const renderSections = {
  isEqual(oldState, newState) {
    return (
      oldState.watchExpanded === newState.watchExpanded &&
      oldState.breakpointsExpanded === newState.breakpointsExpanded &&
      oldState.scopeExpanded === newState.scopeExpanded &&
      oldState.callstackExpanded === newState.callstackExpanded
    )
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setSections',
      newState.watchExpanded,
      newState.breakpointsExanded,
      newState.scopeExpanded,
      newState.callstackExpanded,
    ]
  },
}

const renderScopeChain = {
  isEqual(oldState, newState) {
    return oldState.scopeChain === newState.scopeChain
  },
  apply(oldState, newState) {
    return [/* method */ 'setScopeChain', newState.scopeChain]
  },
}

const renderCallStack = {
  isEqual(oldState, newState) {
    return oldState.scopeChain === newState.scopeChain
  },
  apply(oldState, newState) {
    return [/* method */ 'setCallStack', newState.callStack]
  },
}

const renderPausedReason = {
  isEqual(oldState, newState) {
    return oldState.pausedReason === newState.pausedReason
  },
  apply(oldState, newState) {
    return [/* method */ 'setPausedReason', newState.pausedReason]
  },
}

export const render = [
  renderProcesses,
  renderDebugState,
  renderSections,
  renderScopeChain,
  renderCallStack,
  renderPausedReason,
]

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
