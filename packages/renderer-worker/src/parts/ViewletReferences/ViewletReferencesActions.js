import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'
import * as ViewletReferencesStrings from '../ViewletReferences/ViewletReferencesStrings.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: ViewletReferencesStrings.refresh(),
      icon: Icon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: ViewletReferencesStrings.clear(),
      icon: Icon.ClearAll,
      command: 'clear',
    },
    {
      type: ActionType.Button,
      id: ViewletReferencesStrings.collapseAll(),
      icon: Icon.CollapseAll,
      command: 'collapseAll',
    },
  ]
}
