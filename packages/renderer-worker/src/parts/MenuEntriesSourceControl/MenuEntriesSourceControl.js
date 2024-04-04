import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletSourceControlStrings from '../ViewletSourceControl/ViewletSourceControlStrings.js'

export const id = MenuEntryId.SourceControl

export const getMenuEntries = () => {
  return [
    {
      label: ViewletSourceControlStrings.openChanges(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.openFile(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.openFileHead(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.discardChanges(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.stageChanges(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.addToGitignore(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.revealInExplorerView(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      label: ViewletSourceControlStrings.openContainingFolder(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
