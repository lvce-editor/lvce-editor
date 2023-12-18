import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'copy',
      label: ViewletProblemsStrings.copy(),
      flags: MenuItemFlags.None,
      command: 'Problems.copy',
    },
    {
      id: 'copyMessage',
      label: ViewletProblemsStrings.copyMessage(),
      flags: MenuItemFlags.None,
      command: 'Problems.copyMessage',
    },
  ]
}
