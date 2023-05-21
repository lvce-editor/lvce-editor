import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

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
      icon: Icon.ListFlat,
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CreatePullRequest,
      icon: Icon.Blank,
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CommitAndPush,
      icon: Icon.Check,
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: Icon.Refresh,
      command: '',
    },
  ]
}
