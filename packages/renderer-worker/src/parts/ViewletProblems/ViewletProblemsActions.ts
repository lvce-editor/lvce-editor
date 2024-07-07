import * as ActionType from '../ActionType/ActionType.js'
import * as GetVisibleProblems from '../GetVisibleProblems/GetVisibleProblems.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ProblemStrings from '../ProblemStrings/ProblemStrings.js'
import * as ProblemsViewMode from '../ProblemsViewMode/ProblemsViewMode.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'

export const getActions = (state: any): readonly ViewletAction[] => {
  const visibleCount = GetVisibleProblems.getVisibleProblems(state.problems, state.collapsedUris, state.focusedIndex, state.filterValue).length
  const problemsCount = state.problems.length
  const isSmall = state.width <= state.smallWidthBreakPoint
  const actions: ViewletAction[] = []
  if (!isSmall) {
    actions.push({
      type: ActionType.ProblemsFilter,
      id: 'Filter',
      command: DomEventListenerFunctions.HandleFilterInput,
      badgeText: visibleCount === problemsCount ? '' : ProblemStrings.showingOf(visibleCount, problemsCount),
      placeholder: ProblemStrings.filter(),
      value: state.inputSource === InputSource.Script ? state.filterValue : '',
    })
  }
  if (state.viewMode === ProblemsViewMode.Table) {
    actions.push({
      type: ActionType.Button,
      id: ProblemStrings.viewAsList(),
      command: 'viewAsList',
      icon: MaskIcon.ListTree,
    })
  } else {
    actions.push(
      {
        type: ActionType.Button,
        id: ProblemStrings.collapseAll(),
        command: 'collapseAll',
        icon: MaskIcon.CollapseAll,
      },
      {
        type: ActionType.Button,
        id: ProblemStrings.viewAsTable(),
        command: 'viewAsTable',
        icon: MaskIcon.ListFlat,
      },
    )
  }
  return actions
}
