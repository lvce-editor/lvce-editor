import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getColorThemeNames = async () => {
  if (Platform.getPlatform() === 'web') {
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
    /* ColorTheme.setColorTheme */ 5611,
    /* colorThemeId */ id
  )
}

export const getPlaceholder = () => {
  return 'Select Color Theme'
}

export const getLabel = () => {
  return 'Select Color Theme'
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
  await setColorTheme(/* colorThemeId */ item.label)
}

export const getFilterValue = (value) => {
  return value
}

export const getNoResults = () => {
  return {
    label: 'No matching color themes found',
  }
}
