import * as Command from '../Command/Command.js'

const PART_TITLE_BAR = 1
const PART_MAIN = 2
const PART_PANEL = 3
const PART_STATUS_BAR = 4
const PART_SIDE_BAR = 5
const PART_ACTIVITY_BAR = 6

export const focusPart = (part) => {
  switch (part) {
    case PART_TITLE_BAR:
      Command.execute(/* TitleBar.focus */ -1)
      break
    case PART_MAIN:
      Command.execute(/* Main.focus */ -1)
      break
    case PART_PANEL:
      Command.execute(/* Panel.focus */ -1)
      break
    case PART_STATUS_BAR:
      Command.execute(/* StatusBar.focus */ -1)
      break
    case PART_SIDE_BAR:
      Command.execute(/* SideBar.focus */ -1)
      break
    case PART_ACTIVITY_BAR:
      Command.execute(/* ActivityBar.focus */ -1)
      break
    default:
      throw console.warn(`unknown part ${part}`)
  }
}
