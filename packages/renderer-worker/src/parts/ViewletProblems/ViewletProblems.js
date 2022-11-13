import * as Diagnostics from '../Diagnostics/Diagnostics.js'
import * as I18NString from '../I18NString/I18NString.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoProblemsDetected: 'No problems have been detected in the workspace.',
  ProblemsDetected: 'Some problems have been detected in the workspace.',
}

export const create = () => {
  return {
    problems: [],
    disposed: false,
    focusedIndex: -2,
    message: '',
  }
}

const toProblem = (diagnostic) => {
  const { message } = diagnostic
  return message
}

const getMessage = (problems) => {
  if (problems.length === 0) {
    return I18NString.i18nString(UiStrings.NoProblemsDetected)
  }
  return I18NString.i18nString(UiStrings.ProblemsDetected)
}

export const loadContent = async (state) => {
  const diagnostics = await Diagnostics.getDiagnostics()
  const problems = diagnostics.map(toProblem)
  const message = getMessage(problems)
  return {
    ...state,
    problems,
    message,
  }
}

export const focusIndex = (state, index) => {
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

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'Problems',
      /* method */ 'setMessage',
      /* focusedIndex */ newState.message,
    ]
  },
}

export const render = [renderProblems, renderFocusedIndex, renderMessage]
