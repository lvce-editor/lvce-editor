import * as Command from '../Command/Command.js'
import * as GetColorThemeNames from '../GetColorThemeNames/GetColorThemeNames.js'
import * as QuickPickColorThemeUiStrings from '../QuickPickColorThemeUiStrings/QuickPickColorThemeUiStrings.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'

const setColorTheme = (id) => {
  return Command.execute(/* ColorTheme.setColorTheme */ 'ColorTheme.setColorTheme', /* colorThemeId */ id)
}

export const getPlaceholder = () => {
  return QuickPickColorThemeUiStrings.selectColorTheme()
}

export const getLabel = () => {
  return QuickPickColorThemeUiStrings.selectColorTheme()
}

export const getPicks = async (searchValue) => {
  const colorThemeNames = await GetColorThemeNames.getColorThemeNames()
  return colorThemeNames
}

export const selectPick = async (pick) => {
  await setColorTheme(/* colorThemeId */ pick)
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const focusPick = async (pick) => {
  await setColorTheme(/* colorThemeId */ pick)
}

export const getFilterValue = (value) => {
  return value
}

export const getNoResults = () => {
  return {
    label: QuickPickColorThemeUiStrings.noMatchingColorThemesFound(),
  }
}

export const getPickFilterValue = (pick) => {
  return pick
}

export const getPickLabel = (pick) => {
  return pick
}

export const getPickIcon = (pick) => {
  return ''
}
