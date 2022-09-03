import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const UiStrings = {
  Seperator: 'Separator',
  MoveSideBarLeft: 'Move Side Bar Left',
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

export const getMenuEntries = async () => {
  const activityBarItems =
    ViewletStates.getState('ActivityBar').activityBarItems
  return [
    ...activityBarItems.map(toContextMenuItem),
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Seperator),
      flags: MenuItemFlags.Separator,
    },
    {
      id: 'moveSideBarLeft',
      label: I18nString.i18nString(UiStrings.MoveSideBarLeft), // TODO should be dynamic
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'hideActivityBar',
      label: I18nString.i18nString(UiStrings.HideActivityBar),
      flags: MenuItemFlags.None,
      command: /* Layout.hideActivityBar */ 'Layout.hideActivityBar',
    },
  ]
}
