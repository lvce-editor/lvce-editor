import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetListIndex from '../GetListIndex/GetListIndex.js'
import * as GetProblems from '../GetProblems/GetProblems.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ProblemListItemType from '../ProblemListItemType/ProblemListItemType.js'
import * as ProblemsViewMode from '../ProblemsViewMode/ProblemsViewMode.js'
import * as ViewletProblemsStrings from './ViewletProblemsStrings.js'

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  return {
    uid: id,
    parentUid,
    problems: [],
    disposed: false,
    focusedIndex: -2,
    message: '',
    itemHeight: 22,
    x,
    y,
    width,
    height,
    filterValue: '',
    viewMode: ProblemsViewMode.None,
    inputSource: InputSource.User,
    minLineY: 0,
    maxLineY: 0,
    listItems: [],
    collapsedUris: [],
    smallWidthBreakPoint: 650,
  }
}

const getSavedViewMode = (savedState) => {
  if (savedState && typeof savedState.viewMode === 'number') {
    return savedState.viewMode
  }
  return ProblemsViewMode.List
}

const getSavedFilterValue = (savedState) => {
  if (savedState && typeof savedState.filterValue === 'string') {
    return savedState.filterValue
  }
  return ''
}

const isString = (value) => {
  return typeof value === 'string'
}

const getSavedCollapsedUris = (savedState) => {
  if (savedState && savedState.collapsedUris && Array.isArray(savedState.collapsedUris) && savedState.collapsedUris.every(isString)) {
    return savedState.collapsedUris
  }
  return []
}

export const loadContent = async (state, savedState) => {
  await ProblemsWorker.invoke('Problems.create', state.uid, state.uri, state.x, state.y, state.width, state.height)
  await ProblemsWorker.invoke('Problems.loadContent', state.uid, savedState)
  const diffResult = await ProblemsWorker.invoke('Problems.diff2', state.uid)
  const commands = await ProblemsWorker.invoke('Problems.render2', state.uid, diffResult)
  const actionsDom = await ProblemsWorker.invoke('Problems.renderActions', state.uid)

  const problems = await GetProblems.getProblems()
  const message = ViewletProblemsStrings.getMessage(problems.length)
  const viewMode = getSavedViewMode(savedState)
  const filterValue = getSavedFilterValue(savedState)
  const collapsedUris = getSavedCollapsedUris(savedState)
  return {
    ...state,
    problems,
    message,
    viewMode,
    filterValue,
    inputSource: InputSource.Script,
    filteredProblems: problems,
    listItems: [],
    collapsedUris,
    commands,
    actionsDom,
  }
}

export const getBadgeCount = (state) => {
  const { problems } = state
  return problems.length
}

const handleEditorChange = async (editor) => {
  const problems = await GetProblems.getProblems()
  await Command.execute('Problems.setProblems', problems)
}

export const handleContextMenu = async (state, eventX, eventY) => {
  await ContextMenu.show(eventX, eventY, MenuEntryId.Problems)
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

export const focusPrevious = (state) => {
  const { focusedIndex } = state
  return {
    ...state,
    focusedIndex: focusedIndex - 1,
  }
}

export const focusNext = (state) => {
  const { focusedIndex } = state
  return {
    ...state,
    focusedIndex: focusedIndex + 1,
  }
}

export const handleClickAt = (state, eventX, eventY) => {
  const { problems, x, y, itemHeight } = state
  Focus.setFocus(FocusKey.Problems)
  if (problems.length === 0) {
    return focusIndex(state, -1)
  }
  const index = GetListIndex.getListIndex(eventX, eventY, x, y, 0, itemHeight)
  if (index > problems.length) {
    return focusIndex(state, -1)
  }
  return {
    ...state,
    focusedIndex: index,
  }
}
export const handleIconThemeChange = (state) => {
  return {
    ...state,
    problems: [...state.problems],
  }
}

export const handleFilterInput = (state, value) => {
  Assert.string(value)
  return {
    ...state,
    filterValue: value,
  }
}

export const copyMessage = async (state) => {
  const { problems, focusedIndex } = state
  const problem = problems[focusedIndex]
  await Command.execute('ClipBoard.writeText', problem.message)
  return state
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const collapseAll = (state) => {
  return state
}

export const viewAsTable = (state) => {
  return {
    ...state,
    viewMode: ProblemsViewMode.Table,
  }
}

export const viewAsList = (state) => {
  return {
    ...state,
    viewMode: ProblemsViewMode.List,
  }
}

export const clearFilter = (state) => {
  return {
    ...state,
    filterValue: '',
    inputSource: InputSource.Script,
  }
}

const getArrowLeftNewFocusedIndex = (problems, collapsedUris, focusedIndex) => {
  for (let i = focusedIndex; i >= 0; i--) {
    const problem = problems[i]
    if (problem.listItemType !== ProblemListItemType.Item) {
      return {
        index: i,
        newCollapsedUris: [...collapsedUris, problem.uri],
      }
    }
  }
  return {
    index: 0,
    newCollapsedUris: collapsedUris,
  }
}

export const handleArrowLeft = (state) => {
  const { problems, focusedIndex, collapsedUris } = state
  const { index, newCollapsedUris } = getArrowLeftNewFocusedIndex(problems, collapsedUris, focusedIndex)
  return {
    ...state,
    focusedIndex: index,
    collapsedUris: newCollapsedUris,
  }
}

const getArrowRightNewFocusedIndex = (problems, collapsedUris, focusedIndex) => {
  const problem = problems[focusedIndex]
  const newCollapsedUris = Arrays.removeElement(collapsedUris, problem.uri)
  return {
    index: focusedIndex,
    newCollapsedUris,
  }
}

export const handleArrowRight = (state) => {
  const { problems, focusedIndex, collapsedUris } = state
  const { index, newCollapsedUris } = getArrowRightNewFocusedIndex(problems, collapsedUris, focusedIndex)
  return {
    ...state,
    focusedIndex: index,
    collapsedUris: newCollapsedUris,
  }
}

export const handleBlur = (state) => {
  return {
    ...state,
    focusedIndex: -2,
  }
}
