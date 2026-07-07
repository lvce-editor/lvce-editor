import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import { getPlatform } from '../Platform/Platform.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

interface ContextMenuProps {
  readonly menuId?: string
}

const getMenuEntries = async (uid: number, props: ContextMenuProps = {}): Promise<readonly unknown[]> => {
  const instance = ViewletStates.getByUid(uid)
  const state = instance?.state
  if (!state || typeof state.uri !== 'string' || typeof props.menuId !== 'string') {
    return []
  }
  return ExtensionManagementWorker.invoke('Extensions.getViewMenuEntries', state.uri, uid, props.menuId, assetDir, getPlatform()) as Promise<
    readonly unknown[]
  >
}

export const menus = [
  {
    getMenuEntries,
    id: MenuEntryId.ExtensionView,
  },
]
