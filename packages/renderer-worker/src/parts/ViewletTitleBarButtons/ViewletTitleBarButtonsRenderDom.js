import { button } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const ClassNames = {
  Minimize: 'TitleBarButton TitleBarButtonMinimize',
  ToggleMaximize: 'TitleBarButton TitleBarButtonToggleMaximize',
  Close: 'TitleBarButton TitleBarButtonClose',
}

/**
 * @enum {string}
 */
const Ids = {
  Minimize: 'TitleBarButtonMinimize',
  ToggleMaximize: 'TitleBarButtonToggleMaximize',
  Close: 'TitleBarButtonClose',
}

/**
 * @enum {string}
 */
const UiStrings = {
  Minimize: 'Minimize',
}
const titleBarButton = (className, id, label) => {
  return [
    button(
      {
        className,
        id,
        ariaLabel: label,
      },
      1
    ),
  ]
}

const getVirtualDom = (state) => {
  return [
    ...titleBarButton(ClassNames.Minimize, Ids.Minimize, UiStrings.Minimize),
    ...titleBarButton(ClassNames.ToggleMaximize, Ids.ToggleMaximize, UiStrings.Minimize),
    ...titleBarButton(ClassNames.Close, Ids.Close, UiStrings.Minimize),
  ]
}

export const hasFunctionalRender = true

const renderTitleBarButtons = {
  isEqual(oldState, newState) {
    return oldState.buttons === newState.buttons
  },
  apply(oldState, newState) {
    const dom = getVirtualDom(newState)
    return [/* method */ 'setDom', /* dom */ dom]
  },
}

export const render = [renderTitleBarButtons]
