import * as GetProblems from '../GetProblems/GetProblems.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Command from '../Command/Command.js'
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
  console.log({ problems })
  const message = ViewletProblemsStrings.getMessage(problems.length)
  return {
    ...state,
    problems,
    message,
  }
}

const handleEditorChange = async (editor) => {
  console.log('editor change', editor)
  const problems = await GetProblems.getProblems()
  await Command.execute('Problems.setProblems', problems)
}

export const handleContextMenu = (state) => {
  console.log('open context menu')
  return state
}

export const contentLoadedEffects = (state) => {
  GlobalEventBus.addListener('editor.change', handleEditorChange)
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
