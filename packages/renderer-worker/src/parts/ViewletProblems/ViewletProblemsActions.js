import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ProblemsViewMode from '../ProblemsViewMode/ProblemsViewMode.js'

export const getActions = (state) => {
  const actions = [
    {
      type: ActionType.Filter,
      id: '',
      command: 'filter',
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
