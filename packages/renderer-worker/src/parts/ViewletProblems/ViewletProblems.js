import * as Command from '../Command/Command.js'
import * as GetListIndex from '../GetListIndex/GetListIndex.js'
import * as GetProblems from '../GetProblems/GetProblems.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ViewletProblemsStrings from './ViewletProblemsStrings.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    problems: [],
    disposed: false,
    focusedIndex: -2,
    message: '',
    itemHeight: 20,
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  const problems = await GetProblems.getProblems()
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

export const handleContextMenu = async (state, eventX, eventY) => {
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ eventX, /* y */ eventY, /* id */ MenuEntryId.Problems)
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

export const handleClickAt = (state, eventX, eventY) => {
  const { problems, x, y, itemHeight } = state
  if (problems.length === 0) {
    return focusIndex(state, -1)
  }
  const index = GetListIndex.getListIndex(eventX, eventY, x, y, 0, itemHeight)
  if (index > problems.length) {
    return focusIndex(state, -1)
  }
  const problem = problems[index]
  const { rowIndex, columnIndex } = problem
  console.log('open', rowIndex, columnIndex)
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
