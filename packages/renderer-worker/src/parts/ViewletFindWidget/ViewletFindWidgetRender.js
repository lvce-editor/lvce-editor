import * as ViewletFindWidgetStrings from './ViewletFindWidgetStrings.js'

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ 'setValue', /* value */ newState.value]
  },
}

const getMatchCountText = (matchIndex, matchCount) => {
  if (matchCount === 0) {
    return ViewletFindWidgetStrings.noResults()
  }
  return ViewletFindWidgetStrings.matchOf(matchIndex + 1, matchCount)
}

const renderMatchCount = {
  isEqual(oldState, newState) {
    return oldState.matchIndex === newState.matchIndex && oldState.matchCount === newState.matchCount
  },
  apply(oldState, newState) {
    const matchCountText = getMatchCountText(newState.matchIndex, newState.matchCount)
    return [/* method */ 'setMatchCountText', /* value */ matchCountText]
  },
}

const renderButtonsEnabled = {
  isEqual(oldState, newState) {
    return oldState.matchCount === newState.matchCount
  },
  apply(oldState, newState) {
    const enabled = newState.matchCount > 0
    return [/* method */ 'setButtonsEnabled', /* enabled */ enabled]
  },
}

const getAriaLabel = (state) => {
  const { matchIndex, matchCount, value } = state
  return ViewletFindWidgetStrings.matchesFoundFor(matchIndex, matchCount, value)
}

const renderAriaAnnouncement = {
  isEqual(oldState, newState) {
    return (
      oldState.ariaAnnouncement === newState.ariaAnnouncement &&
      oldState.matchIndex === newState.matchIndex &&
      oldState.matchCount === newState.matchCount &&
      oldState.value === newState.value
    )
  },
  apply(oldState, newState) {
    const ariaLabel = getAriaLabel(newState)
    return [/* Viewlet.invoke */ 'Viewlet.ariaAnnounce', /* text */ ariaLabel]
  },
}

export const render = [renderValue, renderMatchCount, renderAriaAnnouncement, renderButtonsEnabled]
