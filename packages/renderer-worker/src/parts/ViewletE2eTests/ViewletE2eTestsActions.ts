import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'

export const getActions = (): readonly ViewletAction[] => {
  return [
    {
      type: ActionType.Button,
      id: 'runAll',
      icon: MaskIcon.DebugAlt2,
      command: 'runAll',
    },
  ]
}
