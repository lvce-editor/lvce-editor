import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as QuickPickReturnValue from '../QuickPickReturnValue/QuickPickReturnValue.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NoMatchingColorThemesFound: 'No matching color themes found',
  SelectColorTheme: 'Select Color Theme',
}

const getColorThemeNames = async () => {
  if (Platform.platform === PlatformType.Web) {
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/config/themes.json`
    return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
  }
  return SharedProcess.invoke(/* ExtensionHost.getColorThemeNames */ 'ExtensionHost.getColorThemeNames')
}

const setColorTheme = (id) => {
  return Command.execute(/* ColorTheme.setColorTheme */ 'ColorTheme.setColorTheme', /* colorThemeId */ id)
}

export const getPlaceholder = () => {
  return UiStrings.SelectColorTheme
}

export const getLabel = () => {
  return UiStrings.SelectColorTheme
}

export const getPicks = async (searchValue) => {
  const colorThemeNames = await getColorThemeNames()
  return colorThemeNames
}

export const selectPick = async (pick) => {
  await setColorTheme(/* colorThemeId */ pick)
  return {
    command: QuickPickReturnValue.Hide,
  }
}

export const focusPick = async (pick) => {
  console.log('focus pick', pick)
  await setColorTheme(/* colorThemeId */ pick)
}

export const getFilterValue = (value) => {
  return value
}

export const getNoResults = () => {
  return {
    label: UiStrings.NoMatchingColorThemesFound,
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
