import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
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
  return SharedProcess.invoke(
    /* ExtensionHost.getColorThemeNames */ 'ExtensionHost.getColorThemeNames'
  )
}

const setColorTheme = (id) => {
  return Command.execute(
    /* ColorTheme.setColorTheme */ 'ColorTheme.setColorTheme',
    /* colorThemeId */ id
  )
}

export const getPlaceholder = () => {
  return UiStrings.SelectColorTheme
}

export const getLabel = () => {
  return UiStrings.SelectColorTheme
}

const toPick = (colorThemeName) => {
  return {
    label: colorThemeName,
  }
}

export const getPickLabel = (colorThemeName) => {
  return colorThemeName
}

export const getPicks = async (searchValue) => {
  const colorThemeNames = await getColorThemeNames()
  const picks = colorThemeNames.map(toPick)
  return picks
}

export const selectPick = async (item) => {
  await setColorTheme(/* colorThemeId */ item.label)
  return {
    command: 'hide',
  }
}

export const focusPick = async (item) => {
  console.log('focus pick', item)
  await setColorTheme(/* colorThemeId */ item.label)
}

export const getFilterValue = (value) => {
  return value
}

export const getNoResults = () => {
  return {
    label: UiStrings.NoMatchingColorThemesFound,
  }
}
