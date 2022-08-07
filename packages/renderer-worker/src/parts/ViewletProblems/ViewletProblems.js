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

export const render = (oldState, newState) => {
  console.log('render', oldState, newState)
  const changes = []
  if (oldState.problems !== newState.problems) {
    changes.push([
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'Problems',
      /* method */ 'setProblems',
      /* problems */ newState.problems,
    ])
  }
  if (oldState.focusedIndex !== newState.focusedIndex) {
    console.log('focused idnex changed')
    changes.push([
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'Problems',
      /* method */ 'setFocusedIndex',
      /* focusedIndex */ newState.focusedIndex,
    ])
  }
  return changes
}
