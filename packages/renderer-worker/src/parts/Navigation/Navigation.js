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

export const focusActivityBar = async () => {
  await RendererProcess.invoke(/* ActivityBar.focus */ 717115)
}

export const focusStatusBar = async () => {
  await RendererProcess.invoke(/* StatusBar.focus */ 8882)
}

export const focusPanel = async () => {
  await RendererProcess.invoke(/* Panel.focus */ 6664)
}

export const focusSideBar = async () => {
  await RendererProcess.invoke(/* SideBar.focus */ 5554)
}

export const focusTitleBar = async () => {
  await RendererProcess.invoke(/* TitleBar.focus */ 1331)
}

export const focusMain = async () => {
  await RendererProcess.invoke(/* Main.focus */ 2145)
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
      return focusTitleBar()
    case PART_MAIN:
      return focusMain()
    case PART_PANEL:
      return focusPanel()
    case PART_STATUS_BAR:
      return focusStatusBar()
    case PART_SIDE_BAR:
      return focusSideBar()
    case PART_ACTIVITY_BAR:
      return focusActivityBar()
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

export const focusNextPart = async () => {
  const currentPart = getCurrentPart()
  const nextPart = getVisiblePartNext(currentPart)
  await focusPart(nextPart)
}

export const focusPreviousPart = async () => {
  const currentPart = getCurrentPart()
  const previousPart = getVisiblePartPrevious(currentPart)
  await focusPart(previousPart)
}
