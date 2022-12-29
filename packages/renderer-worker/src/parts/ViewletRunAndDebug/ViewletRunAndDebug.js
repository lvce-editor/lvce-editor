import * as Assert from '../Assert/Assert.js'
import * as Debug from '../Debug/Debug.js'
import * as DebugDisplay from '../DebugDisplay/DebugDisplay.js'
import * as DebugPausedReason from '../DebugPausedReason/DebugPausedReason.js'
import * as DebugScopeType from '../DebugScopeType/DebugScopeType.js'
import * as DebugState from '../DebugState/DebugState.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugValueType from '../DebugValueType/DebugValueType.js'
/**
 * @enum {string}
 */
const UiStrings = {
  NotPaused: 'Not paused',
}

export const create = (id) => {
  return {
    id,
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
  }
}

export const loadContent = async (state) => {
  const debugId = Workspace.isTest() ? 'test-debug' : 'node-debug' // TODO
  await Debug.start(debugId)
  const processes = await Debug.listProcesses(debugId)
  return {
    ...state,
    processes,
    debugId,
    debugState: DebugState.Default,
  }
}

const getPropertyValueLabel = (property) => {
  switch (property.type) {
    case DebugValueType.Number:
    case DebugValueType.Object:
      return property.description
    case DebugValueType.Undefined:
      return `undefined`
    default:
      return `${JSON.stringify(property)}`
  }
}

const toDisplayScopeChain = (params, thisObject, scopeChain, knownProperties) => {
  const elements = []
  for (const scope of scopeChain) {
    const label = DebugDisplay.getScopeLabel(scope)
    elements.push({
      type: DebugScopeChainType.Scope,
      key: label,
      value: '',
      valueType: '',
      label,
      indent: 10,
    })
    // if(params.reason)
    if (scope.type === DebugScopeType.Local) {
      if (params.reason === DebugPausedReason.Exception) {
        const value = params.data.description.replaceAll('\n', ' ')
        elements.push({
          type: DebugScopeChainType.Exception,
          key: 'Exception',
          value,
          valueType: '',
          indent: 20,
        })
      }
      const valueLabel = getPropertyValueLabel(thisObject)
      elements.push({
        type: DebugScopeChainType.This,
        key: 'this',
        value: valueLabel,
        valueType: '',
        indent: 20,
      })
    }
    const children = knownProperties[scope.object.objectId]
    if (children) {
      for (const child of children.result.result) {
        const valueLabel = getPropertyValueLabel(child.value)
        elements.push({
          type: DebugScopeChainType.Property,
          key: child.name,
          value: valueLabel,
          valueType: child.value.type,
          indent: 20,
        })
      }
    }
  }
  return elements
}

const toDisplayCallStack = (callFrames) => {
  Assert.array(callFrames)
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
  const callFrameId = params.callFrames[0].callFrameId
  const { debugId } = state
  const properties = await Debug.getProperties(debugId, objectId)
  const thisObject = params.callFrames[0].this
  Assert.object(thisObject)
  const scopeChain = toDisplayScopeChain(params, thisObject, params.callFrames[0].scopeChain, {
    [objectId]: properties,
  })
  const pausedReason = params.reason
  const pausedMessage = DebugDisplay.getPausedMessage(params.reason)
  return {
    ...state,
    debugState: DebugState.Paused,
    scopeChain,
    scopeExpanded: true,
    callStack,
    pausedReason,
    pausedMessage,
    callFrameId,
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
    return [/* method */ 'setSections', newState.watchExpanded, newState.breakpointsExanded, newState.scopeExpanded, newState.callstackExpanded]
  },
}

const renderScopeChain = {
  isEqual(oldState, newState) {
    return oldState.scopeChain === newState.scopeChain && oldState.debugState === newState.debugState
  },
  apply(oldState, newState) {
    if (newState.debugState === DebugState.None || newState.debugState === DebugState.Default) {
      return [/* method */ 'setScopeChainMessage', UiStrings.NotPaused]
    }
    return [/* method */ 'setScopeChain', newState.scopeChain]
  },
}

const renderCallStack = {
  isEqual(oldState, newState) {
    return oldState.scopeChain === newState.scopeChain && oldState.debugState === newState.debugState
  },
  apply(oldState, newState) {
    if (newState.debugstate === DebugState.None || newState.debugState === DebugState.Default) {
      return [/* method */ 'setCallStackMessage', UiStrings.NotPaused]
    }
    return [/* method */ 'setCallStack', newState.callStack]
  },
}

const renderPausedReason = {
  isEqual(oldState, newState) {
    return oldState.pausedReason === newState.pausedReason && oldState.pausedMessage === newState.pausedMessage
  },
  apply(oldState, newState) {
    return [/* method */ 'setPausedReason', newState.pausedReason, newState.pausedMessage]
  },
}

const renderOutput = {
  isEqual(oldState, newState) {
    return oldState.debugOutputValue === newState.debugOutputValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setOutputValue', newState.debugOutputValue]
  },
}

import * as ViewletRunAndDebugRender from './ViewletRunAndDebugRender.js'

export const render = ViewletRunAndDebugRender.render

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
