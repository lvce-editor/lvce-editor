// TODO maybe rename this module to Focus

import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const PART_TITLE_BAR = 1
const PART_MAIN = 2
const PART_PANEL = 3
const PART_STATUS_BAR = 4
const PART_SIDE_BAR = 5
const PART_ACTIVITY_BAR = 6

export const state = {
  focusedPart: PART_TITLE_BAR,
}

export const focusActivityBar = () => {
  RendererProcess.send([/* ActivityBar.focus */ 717115])
}

export const focusStatusBar = () => {
  RendererProcess.send([/* StatusBar.focus */ 8882])
}

export const focusPanel = () => {
  RendererProcess.send([/* Panel.focus */ 6664])
}

export const focusSideBar = () => {
  RendererProcess.send([/* SideBar.focus */ 5554])
}

export const focusTitleBar = () => {
  RendererProcess.send([/* TitleBar.focus */ 1331])
}

export const focusMain = () => {
  RendererProcess.send([/* Main.focus */ 2145])
}

export const focusNextTerminal = () => {
  // TODO
}

export const focusPreviousTerminal = () => {
  // TODO
}

export const focusPart = (part) => {
  state.focusedPart = part
  switch (state.focusedPart) {
    case PART_TITLE_BAR:
      focusTitleBar()
      break
    case PART_MAIN:
      focusMain()
      break
    case PART_PANEL:
      focusPanel()
      break
    case PART_STATUS_BAR:
      focusStatusBar()
      break
    case PART_SIDE_BAR:
      focusSideBar()
      break
    case PART_ACTIVITY_BAR:
      focusActivityBar()
      break
    default:
      throw console.warn(`unknown part ${part}`)
  }
}

const getNextPart = (part) => {
  switch (part) {
    case PART_TITLE_BAR:
      return PART_MAIN
    case PART_MAIN:
      return PART_PANEL
    case PART_PANEL:
      return PART_STATUS_BAR
    case PART_STATUS_BAR:
      return PART_SIDE_BAR
    case PART_SIDE_BAR:
      return PART_ACTIVITY_BAR
    case PART_ACTIVITY_BAR:
      return PART_TITLE_BAR
    default:
      throw console.warn(`unknown part ${part}`)
  }
}

const getPreviousPart = (part) => {
  switch (part) {
    case PART_TITLE_BAR:
      return PART_ACTIVITY_BAR
    case PART_MAIN:
      return PART_TITLE_BAR
    case PART_PANEL:
      return PART_MAIN
    case PART_STATUS_BAR:
      return PART_PANEL
    case PART_SIDE_BAR:
      return PART_STATUS_BAR
    case PART_ACTIVITY_BAR:
      return PART_SIDE_BAR
    default:
      throw console.warn(`unknown part ${part}`)
  }
}

const isVisiblePart = (part) => {
  // TODO
  return true
}

const getVisiblePart = (part, fn) => {
  const nextPart = fn(part)
  if (isVisiblePart(nextPart)) {
    return nextPart
  }
  return getVisiblePart(nextPart, fn)
}

const getVisiblePartNext = (part) => {
  return getVisiblePart(part, getNextPart)
}

const getVisiblePartPrevious = (part) => {
  return getVisiblePart(part, getPreviousPart)
}

const getCurrentPart = () => {
  // TODO ask renderer process
  return state.focusedPart
}

export const focusNextPart = () => {
  const currentPart = getCurrentPart()
  const nextPart = getVisiblePartNext(currentPart)
  focusPart(nextPart)
}

export const focusPreviousPart = () => {
  const currentPart = getCurrentPart()
  const previousPart = getVisiblePartPrevious(currentPart)
  focusPart(previousPart)
}
