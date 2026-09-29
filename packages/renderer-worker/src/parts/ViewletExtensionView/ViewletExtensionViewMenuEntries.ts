import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import { getPlatform } from '../Platform/Platform.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

interface ContextMenuProps {
  readonly menuId?: string
  readonly viewId?: string
}

const getMenuEntries = async (uid: number, props: ContextMenuProps = {}): Promise<readonly unknown[]> => {
  if (typeof props.menuId !== 'string') {
    return []
  }
  const instance = ViewletStates.getByUid(uid)
  const state = instance?.state
  const { uri, viewId: stateViewId } = state || {}
  let { viewId } = props
  if (typeof viewId !== 'string') {
    viewId = typeof stateViewId === 'string' ? stateViewId : uri
  }
  if (typeof viewId !== 'string') {
    return []
  }
  return ExtensionManagementWorker.invoke('Extensions.getViewMenuEntries', viewId, uid, props.menuId, assetDir, getPlatform()) as Promise<
    readonly unknown[]
  >
}

export const menus = [
  {
    getMenuEntries,
    id: MenuEntryId.ExtensionView,
  },
]
