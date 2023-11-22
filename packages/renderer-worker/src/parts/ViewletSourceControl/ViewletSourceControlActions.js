import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'

/**
 * @enum {string}
 */
const UiStrings = {
  ViewAsTree: 'View As Tree',
  CreatePullRequest: 'Create Pull Request',
  CommitAndPush: 'Commit and Push',
  Refresh: 'Refresh',
}

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: UiStrings.ViewAsTree,
      icon: MaskIcon.ListFlat,
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CreatePullRequest,
      icon: MaskIcon.Blank,
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CommitAndPush,
      icon: MaskIcon.Check,
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: MaskIcon.Refresh,
      command: '',
    },
  ]
}
