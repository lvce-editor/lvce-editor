import * as ViewletProblems from './ViewletProblems.js'
import * as ViewletProblemsSetProblems from './ViewletProblemsSetProblems.js'

export const Commands = {
  clearFilter: ViewletProblems.clearFilter,
  collapseAll: ViewletProblems.collapseAll,
  copyMessage: ViewletProblems.copyMessage,
  focusIndex: ViewletProblems.focusIndex,
  focusNext: ViewletProblems.focusNext,
  focusPrevious: ViewletProblems.focusPrevious,
  getBadgeCount: ViewletProblems.getBadgeCount,
  handleClickAt: ViewletProblems.handleClickAt,
  handleContextMenu: ViewletProblems.handleContextMenu,
  handleFilterInput: ViewletProblems.handleFilterInput,
  handleArrowLeft: ViewletProblems.handleArrowLeft,
  handleArrowRight: ViewletProblems.handleArrowRight,
  setProblems: ViewletProblemsSetProblems.setProblems,
  viewAsList: ViewletProblems.viewAsList,
  viewAsTable: ViewletProblems.viewAsTable,
}
