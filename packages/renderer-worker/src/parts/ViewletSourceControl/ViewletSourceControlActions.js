import * as ActionType from '../ActionType/ActionType.js'

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
      icon: 'ListFlat',
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CreatePullRequest,
      icon: 'Blank',
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CommitAndPush,
      icon: 'Check',
      command: '',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: 'Refresh',
      command: '',
    },
  ]
}
