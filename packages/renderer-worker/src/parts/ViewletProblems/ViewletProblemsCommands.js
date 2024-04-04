import * as ViewletProblems from './ViewletProblems.js'
import * as ViewletProblemsSetProblems from './ViewletProblemsSetProblems.js'

export const Commands = {
  focusIndex: ViewletProblems.focusIndex,
  handleClickAt: ViewletProblems.handleClickAt,
  handleContextMenu: ViewletProblems.handleContextMenu,
  setProblems: ViewletProblemsSetProblems.setProblems,
  focusNext: ViewletProblems.focusNext,
  focusPrevious: ViewletProblems.focusPrevious,
  handleFilterInput: ViewletProblems.handleFilterInput,
  copyMessage: ViewletProblems.copyMessage,
  collapseAll: ViewletProblems.collapseAll,
  viewAsTable: ViewletProblems.viewAsTable,
  viewAsList: ViewletProblems.viewAsList,
  clearFilter: ViewletProblems.clearFilter,
  getBadgeCount: ViewletProblems.getBadgeCount,
}
