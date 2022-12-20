import * as Debug from '../Debug/Debug.js'

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

export const handlePaused = (state, params) => {
  console.log({ params })
  const scopeChain = params.callFrames[0].scopeChain
  const callStack = [params.callFrames[0].functionName]
  return {
    ...state,
    debugState: 'paused',
    scopeChain,
    scopeExpanded: true,
    callStack,
  }
}

export const handleResumed = (state) => {
  return {
    ...state,
    debugState: 'default',
    scopeChain: [],
  }
}

export const resume = async (state) => {
  const { debugId } = state
  await Debug.resume(debugId)
  console.log('continue')
  return state
}

export const pause = async (state) => {
  const { debugId } = state
  await Debug.pause(debugId)
  console.log('pause')
  return state
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

export const render = [
  renderProcesses,
  renderDebugState,
  renderSections,
  renderScopeChain,
  renderCallStack,
]

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
