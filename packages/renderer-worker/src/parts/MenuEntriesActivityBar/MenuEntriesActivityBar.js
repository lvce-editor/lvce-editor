import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const toContextMenuItem = (activityBarItem) => {
  return {
    label: activityBarItem.id,
    id: 8000, // TODO
    flags: activityBarItem.enabled ? MenuItemFlags.Checked : MenuItemFlags.Unchecked,
  }
}

const menuEntryMoveSideBar = (sideBarLocation) => {
  switch (sideBarLocation) {
    case SideBarLocationType.Left:
      return {
        id: 'moveSideBarRight',
        label: ViewletActivityBarStrings.moveSideBarRight(),
        flags: MenuItemFlags.None,
        command: 'Layout.moveSideBarRight',
      }
    case SideBarLocationType.Right:
      return {
        id: 'moveSideBarLeft',
        label: ViewletActivityBarStrings.moveSideBarLeft(),
        flags: MenuItemFlags.None,
        command: 'Layout.moveSideBarLeft',
      }
    default:
      throw new Error('unexpected side bar location')
  }
}

export const getMenuEntries = async (layoutState, activityBarState) => {
  const { activityBarItems } = activityBarState
  const { sideBarLocation } = layoutState
  return [
    ...activityBarItems.map(toContextMenuItem),
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryMoveSideBar(sideBarLocation),
    {
      id: 'hideActivityBar',
      label: ViewletActivityBarStrings.hideActivityBar(),
      flags: MenuItemFlags.None,
      command: /* Layout.hideActivityBar */ 'Layout.hideActivityBar',
    },
  ]
}

export const inject = [ViewletModuleId.Layout, ViewletModuleId.ActivityBar]
