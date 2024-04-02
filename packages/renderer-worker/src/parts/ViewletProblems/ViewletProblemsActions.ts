import * as ActionType from '../ActionType/ActionType.js'
import * as GetVisibleProblems from '../GetVisibleProblems/GetVisibleProblems.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ProblemsViewMode from '../ProblemsViewMode/ProblemsViewMode.js'
import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'

export const getActions = (state): readonly ViewletAction[] => {
  const visibleCount = GetVisibleProblems.getVisibleProblems(state.problems, state.focusedIndex, state.filterValue).length
  const problemsCount = state.problems.length
  const actions = [
    {
      type: ActionType.Filter,
      id: 'Filter',
      command: 'handleFilterInput',
      badgeText: visibleCount === problemsCount ? '' : `Showing ${visibleCount} of ${problemsCount}`,
      placeholder: 'Filter',
    },
    {
      type: ActionType.Button,
      id: 'Collapse All',
      command: 'collapseAll',
      icon: MaskIcon.CollapseAll,
    },
  ]
  if (state.viewMode === ProblemsViewMode.Table) {
    actions.push({
      type: ActionType.Button,
      id: 'View as list',
      command: 'viewAsList',
      icon: MaskIcon.ListTree,
    })
  } else {
    actions.push({
      type: ActionType.Button,
      id: 'View as table',
      command: 'viewAsTable',
      icon: MaskIcon.ListFlat,
    })
  }
  return actions
}
