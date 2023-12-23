import * as ActionType from '../ActionType/ActionType.js'
import * as ViewletReferencesStrings from '../ViewletReferences/ViewletReferencesStrings.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: ViewletReferencesStrings.refresh(),
      icon: 'Refresh',
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: ViewletReferencesStrings.clear(),
      icon: 'ClearAll',
      command: 'clear',
    },
    {
      type: ActionType.Button,
      id: ViewletReferencesStrings.collapseAll(),
      icon: 'CollapseAll',
      command: 'collapseAll',
    },
  ]
}
