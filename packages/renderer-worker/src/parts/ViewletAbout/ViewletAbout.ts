import * as AboutFocusId from '../AboutFocusId/AboutFocusId.js'
import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import type { AboutState } from './ViewletAboutTypes.ts'

export const create = (): AboutState => {
  return {
    productName: '',
    lines: [],
    focusId: AboutFocusId.None,
    commands: [],
  }
}

export const loadContent = async (state: AboutState): Promise<AboutState> => {
  const newState = await AboutViewWorker.invoke('About.loadContent', state)
  const commands = await AboutViewWorker.invoke('About.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleClickOk = async (state: AboutState): Promise<AboutState> => {
  await AboutViewWorker.invoke('About.handleClickOk')
  return state
}

export const handleClickCopy = async (state: AboutState): Promise<AboutState> => {
  await AboutViewWorker.invoke('About.handleClickCopy')
  return state
}

export const handleClickClose = async (state: AboutState): Promise<AboutState> => {
  await AboutViewWorker.invoke('About.handleClickClose')
  return state
}

export const handleFocusIn = (state: AboutState): AboutState => {
  Focus.setFocus(FocusKey.About)
  return state
}

export const focusNext = async (state: AboutState): Promise<AboutState> => {
  const newState = await AboutViewWorker.invoke('About.focusNext', state)
  const commands = await AboutViewWorker.invoke('About.render', state, newState)
  newState.commands = commands
  return newState
}

export const focusPrevious = async (state: AboutState): Promise<AboutState> => {
  const newState = await AboutViewWorker.invoke('About.focusPrevious', state)
  const commands = await AboutViewWorker.invoke('About.render', state, newState)
  newState.commands = commands
  return newState
}
