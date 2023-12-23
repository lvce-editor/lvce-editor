import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletSourceControlStrings from '../ViewletSourceControl/ViewletSourceControlStrings.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: ViewletSourceControlStrings.viewAsTree(),
      icon: MaskIcon.ListFlat,
      command: '',
    },
    {
      type: ActionType.Button,
      id: ViewletSourceControlStrings.commitAndPush(),
      icon: MaskIcon.Check,
      command: '',
    },
    {
      type: ActionType.Button,
      id: ViewletSourceControlStrings.refresh(),
      icon: MaskIcon.Refresh,
      command: '',
    },
  ]
}
