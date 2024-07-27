import * as ActionType from '../ActionType/ActionType.js'
import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'

export const getActions = (): readonly ViewletAction[] => {
  return [
    {
      type: ActionType.Button,
      id: 'runAll',
      icon: 'Play',
      command: 'runAll',
    },
  ]
}
