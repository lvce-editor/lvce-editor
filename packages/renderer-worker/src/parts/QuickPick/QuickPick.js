import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const show = async (pickId) => {
  // TODO show custom quickpick
  await Command.execute(`Viewlet.openWidget`, ViewletModuleId.QuickPick, pickId)
  return undefined
}

export const showFile = () => {
  return show('file')
}

export const showRecent = () => {
  return show('recent')
}

export const showEveryThing = () => {
  return show('everything')
}

export const showColorTheme = () => {
  return show('color-theme')
}

export const showCommands = () => {
  return show('commands')
}
