import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntriesManageExtension from '../MenuEntriesManageExtension/MenuEntriesManageExtension.js'

export const menus = [
  {
    id: MenuEntryId.ManageExtension,
    ...MenuEntriesManageExtension,
  },
]
