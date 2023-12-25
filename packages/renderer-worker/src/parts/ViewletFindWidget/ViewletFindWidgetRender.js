import * as GetFindWidgetVirtualDom from '../GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as Icon from '../Icon/Icon.js'
import * as ViewletFindWidgetStrings from './ViewletFindWidgetStrings.js'

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [RenderMethod.SetValue, /* value */ newState.value]
  },
}

const getMatchCountText = (matchIndex, matchCount) => {
  if (matchCount === 0) {
    return ViewletFindWidgetStrings.noResults()
  }
  return ViewletFindWidgetStrings.matchOf(matchIndex + 1, matchCount)
}

const renderDetails = {
  isEqual(oldState, newState) {
    return oldState.matchIndex === newState.matchIndex && oldState.matchCount === newState.matchCount
  },
  apply(oldState, newState) {
    const matchCountText = getMatchCountText(newState.matchIndex, newState.matchCount)
    const buttonsEnabled = newState.matchCount > 0
    const buttons = [
      {
        label: ViewletFindWidgetStrings.previousMatch(),
        icon: Icon.ArrowUp,
        disabled: !buttonsEnabled,
      },
      {
        label: ViewletFindWidgetStrings.nextMatch(),
        icon: Icon.ArrowDown,
        disabled: !buttonsEnabled,
      },
      {
        label: ViewletFindWidgetStrings.close(),
        icon: Icon.Close,
        disabled: false,
      },
    ]
    const dom = GetFindWidgetVirtualDom.getFindWidgetVirtualDom(matchCountText, buttons)
    return [/* method */ 'setDom', /* enabled */ dom]
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

export const render = [renderValue, renderAriaAnnouncement, renderDetails]
