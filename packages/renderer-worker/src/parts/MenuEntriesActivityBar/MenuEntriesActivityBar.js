import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as SideBarLocationType from '../SideBarLocationType/SideBarLocationType.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Seperator: 'Separator',
  MoveSideBarLeft: 'Move Side Bar Left',
  MoveSideBarRight: 'Move Side Bar Right',
  HideActivityBar: 'Hide Activity Bar',
}

const toContextMenuItem = (activityBarItem) => {
  return {
    label: activityBarItem.id,
    id: 8000, // TODO
    flags: activityBarItem.enabled
      ? MenuItemFlags.Checked
      : MenuItemFlags.Unchecked,
  }
}

const menuEntryMoveSideBar = (sideBarLocation) => {
  switch (sideBarLocation) {
    case SideBarLocationType.Left:
      return {
        id: 'moveSideBarRight',
        label: I18nString.i18nString(UiStrings.MoveSideBarRight),
        flags: MenuItemFlags.None,
        command: 'Layout.moveSideBarRight',
      }
    case SideBarLocationType.Right:
      return {
        id: 'moveSideBarLeft',
        label: I18nString.i18nString(UiStrings.MoveSideBarLeft),
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
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Seperator),
      flags: MenuItemFlags.Separator,
    },
    menuEntryMoveSideBar(sideBarLocation),
    {
      id: 'hideActivityBar',
      label: I18nString.i18nString(UiStrings.HideActivityBar),
      flags: MenuItemFlags.None,
      command: /* Layout.hideActivityBar */ 'Layout.hideActivityBar',
    },
  ]
}

export const inject = [ViewletModuleId.Layout, ViewletModuleId.ActivityBar]
