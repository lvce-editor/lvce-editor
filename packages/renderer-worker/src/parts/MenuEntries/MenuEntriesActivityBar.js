import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  Seperator: 'Separator',
  MoveSideBarLeft: 'Move Side Bar Left',
  HideActivityBar: 'Hide Activity Bar',
}

const toContextMenuItem = (activityBarItem) => {
  return {
    label: activityBarItem.id,
    id: 8000, // TODO
    flags: activityBarItem.enabled ? /* Checked */ 2 : /* Unchecked */ 3,
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
      flags: /* Separator */ 1,
    },
    {
      id: 'moveSideBarLeft',
      label: I18nString.i18nString(UiStrings.MoveSideBarLeft), // TODO should be dynamic
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
    {
      id: 'hideActivityBar',
      label: I18nString.i18nString(UiStrings.HideActivityBar),
      flags: /* None */ 0,
      command: /* Layout.hideActivityBar */ 'Layout.hideActivityBar',
    },
  ]
}
