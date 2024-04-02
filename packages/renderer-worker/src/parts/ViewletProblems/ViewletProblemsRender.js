import * as GetProblemsVirtualDom from '../GetProblemsVirtualDom/GetProblemsVirtualDom.js'
import * as GetVisibleProblems from '../GetVisibleProblems/GetVisibleProblems.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderProblems = {
  isEqual(oldState, newState) {
    return (
      oldState.problems === newState.problems &&
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.filterValue === newState.filterValue &&
      oldState.viewMode === newState.viewMode
    )
  },
  apply(oldState, newState) {
    const visible = GetVisibleProblems.getVisibleProblems(newState.problems, newState.focusedIndex, newState.filterValue)
    const dom = GetProblemsVirtualDom.getProblemsVirtualDom(newState.viewMode, visible, newState.filterValue)
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
