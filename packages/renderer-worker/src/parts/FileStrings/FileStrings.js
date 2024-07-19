import * as I18nString from '../I18NString/I18NString.js'
// @ts-ignore
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
// @ts-ignore
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
// @ts-ignore
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NewFile: 'New File',
  NewWindow: 'New Window',
  Separator: 'Separator',
  OpenFile: 'Open File',
  OpenFolder: 'Open Folder',
  OpenRecent: 'Open Recent',
  Exit: 'Exit',
  Save: 'Save',
  SaveAll: 'Save All',
}

export const newFile = () => {
  return I18nString.i18nString(UiStrings.NewFile)
}

export const newWindow = () => {
  return I18nString.i18nString(UiStrings.NewWindow)
}

export const openFile = () => {
  return I18nString.i18nString(UiStrings.OpenFile)
}

export const openFolder = () => {
  return I18nString.i18nString(UiStrings.OpenFolder)
}

export const openRecent = () => {
  return I18nString.i18nString(UiStrings.OpenRecent)
}

export const save = () => {
  return I18nString.i18nString(UiStrings.Save)
}

export const saveAll = () => {
  return I18nString.i18nString(UiStrings.SaveAll)
}

export const exit = () => {
  return I18nString.i18nString(UiStrings.Exit)
}
