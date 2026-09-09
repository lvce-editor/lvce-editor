import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SimpleBrowser from './ViewletSimpleBrowser.js'
import * as Resize from './ViewletSimpleBrowserResize.js'

const findHeight = 36

export const closeFind = async (state, restoreFocus = true) => {
  if (!state.findVisible) return state
  await SharedProcess.invoke('BrowserFind.stop', state.browserViewId)
  const next = { ...state, findVisible: false, findMatches: 0, findActiveMatch: 0, headerHeight: state.headerHeight - findHeight }
  await Resize.resizeEffect(next)
  await SimpleBrowser.updateFindKeyBindings(next)
  if (restoreFocus) await ElectronWebContentsViewFunctions.focus(state.browserViewId)
  return next
}

export const toggleFind = async (state) => {
  if (state.findVisible) return closeFind(state)
  const current = await SimpleBrowser.closeSuggestions(state)
  const next = { ...current, findVisible: true, headerHeight: current.headerHeight + findHeight, findFocusVersion: current.findFocusVersion + 1 }
  await Resize.resizeEffect(next)
  await SimpleBrowser.updateFindKeyBindings(next)
  await ElectronWindow.focus()
  return search(next)
}

let nextRequestId = 0

const search = (state, forward = true, newSession = true) => {
  if (!state.findVisible) return state
  const findRequestId = ++nextRequestId
  void SharedProcess.invoke('BrowserFind.find', state.browserViewId, state.findValue, forward, state.findMatchCase, newSession)
    .then((result) => Viewlet.executeViewletCommand(state.uid, 'applyFindResult', state.browserViewId, findRequestId, result))
    .catch((error) => console.error('[Simple Browser] Find in page failed', error))
  return { ...state, findRequestId, findMatches: newSession ? 0 : state.findMatches, findActiveMatch: newSession ? 0 : state.findActiveMatch }
}

export const applyFindResult = (state, browserViewId, requestId, result) => {
  if (!state.findVisible || state.browserViewId !== browserViewId || state.findRequestId !== requestId || !result) return state
  return { ...state, findMatches: result.matches, findActiveMatch: result.activeMatchOrdinal }
}

export const handleFindInput = (state, value) => search({ ...state, findValue: value })
export const findNext = (state) => search(state, true, false)
export const findPrevious = (state) => search(state, false, false)
export const toggleFindMatchCase = (state) => search({ ...state, findMatchCase: !state.findMatchCase })
export const refreshFind = search

export const escapeAddress = (state) => (state.findVisible ? closeFind(state) : SimpleBrowser.closeSuggestions(state))
