import * as GetProblemsVirtualDom from '../GetProblemsVirtualDom/GetProblemsVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderProblems = {
  isEqual(oldState, newState) {
    return oldState.problems === newState.problems
  },
  apply(oldState, newState) {
    const dom = GetProblemsVirtualDom.getProblemsVirtualDom(newState.problems)
    return ['setProblemsDom', dom]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetFocusedIndex, /* focusedIndex */ newState.focusedIndex]
  },
}

export const render = [renderProblems, renderFocusedIndex]
