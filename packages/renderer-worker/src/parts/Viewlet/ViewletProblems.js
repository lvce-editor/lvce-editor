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

export const renderVirtualDom = (oldState, newState) => {
  const changes = [
    [
      /* createElementNode */ 1,
      /* id */ 1,
      /* parentId */ 0,
      /* tagName */ 'div',
      /* props */ {
        className: 'Viewlet',
        'data-viewlet-id': 'Problems',
      },
    ],
  ]
  if (newState.problems.length === 0) {
    changes.push([
      /* createTextNode */ 8,
      /* id */ 2,
      /* parentId */ 1,
      /* text */ 'No Problems have been detected in the workspace',
    ])
  } else {
    changes.push([
      /* createTextNode */ 8,
      /* id */ 2,
      /* parentId */ 1,
      /* text */ newState.problems.join('\n'),
    ])
  }
  return changes
}
