import * as ExtensionHostDiagnostic from '../ExtensionHost/ExtensionHostDiagnostic.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const name = 'Problems'

export const create = () => {
  return {
    problems: [],
    disposed: false,
    focusedIndex: -2,
  }
}

const toProblem = (diagnostic) => {
  return diagnostic.message
}

export const loadContent = async (state) => {
  const instance = ViewletStates.getInstance('EditorText')
  if (!instance) {
    return state
  }
  const editor = instance.state
  const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(
    editor
  )
  const problems = diagnostics.map(toProblem)
  return {
    ...state,
    problems,
  }
}

export const contentLoaded = async (state) => {}

export const focusIndex = (state, index) => {
  console.log({ index })
  return {
    ...state,
    focusedIndex: index,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

const renderProblems = {
  isEqual(oldState, newState) {
    return oldState.problems === newState.problems
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'Problems',
      /* method */ 'setProblems',
      /* problems */ newState.problems,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'Problems',
      /* method */ 'setFocusedIndex',
      /* focusedIndex */ newState.focusedIndex,
    ]
  },
}

export const render = [renderProblems, renderFocusedIndex]
