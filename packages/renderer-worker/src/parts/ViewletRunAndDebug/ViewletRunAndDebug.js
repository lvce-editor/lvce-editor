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

export const handlePaused = (state) => {
  console.log('handle paused')
  return {
    ...state,
    debugState: 'paused',
  }
}

export const handleResumed = (state) => {
  return {
    ...state,
    debugState: 'default',
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

export const render = [renderProcesses, renderDebugState, renderSections]

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
