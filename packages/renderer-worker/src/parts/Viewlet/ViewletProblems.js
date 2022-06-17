import * as ExtensionHostDiagnostic from '../ExtensionHost/ExtensionHostDiagnostic.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const name = 'Problems'

export const create = () => {
  return {
    problems: [],
    disposed: false,
  }
}

const toProblem = (diagnostic) => {
  return diagnostic.message
}

export const loadContent = async (state) => {
  const instance = Viewlet.state.instances['EditorText']
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

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.problems !== newState.problems) {
    changes.push([
      /* Viewlet.invoke */ 3024,
      /* id */ 'Problems',
      /* method */ 'setProblems',
      /* problems */ newState.problems,
    ])
  }
  return changes
}
