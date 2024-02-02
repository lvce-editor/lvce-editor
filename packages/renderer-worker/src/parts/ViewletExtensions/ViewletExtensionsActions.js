import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletExtensionStrings from '../ViewletExtensions/ViewletExtensionsStrings.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: ViewletExtensionStrings.refresh(),
      icon: MaskIcon.Refresh,
    },
  ]
}
