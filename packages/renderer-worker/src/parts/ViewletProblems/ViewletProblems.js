import * as GetProblems from '../GetProblems/GetProblems.js'
import * as ViewletProblemsStrings from './ViewletProblemsStrings.js'

export const create = (uid) => {
  return {
    uid,
    problems: [],
    disposed: false,
    focusedIndex: -2,
    message: '',
  }
}

export const loadContent = async (state) => {
  const problems = await GetProblems.getProblems()
  const message = ViewletProblemsStrings.getMessage(problems)
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
