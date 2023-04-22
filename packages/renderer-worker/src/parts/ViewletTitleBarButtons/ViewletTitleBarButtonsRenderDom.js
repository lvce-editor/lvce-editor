import { button, i } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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
const Icon = {
  Minimize: 'Minimize',
  ToggleMaximize: 'ToggleMaximize',
  Close: 'Close',
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

const titleBarButton = (className, icon, id, label) => {
  return [
    button(
      {
        className,
        id,
        ariaLabel: label,
      },
      1
    ),
    i(
      {
        className: `MaskIcon ${icon}`,
      },
      0
    ),
  ]
}

const getVirtualDom = (state) => {
  return [
    ...titleBarButton(ClassNames.Minimize, Icon.Minimize, Ids.Minimize, UiStrings.Minimize),
    ...titleBarButton(ClassNames.ToggleMaximize, Icon.ToggleMaximize, Ids.ToggleMaximize, UiStrings.Minimize),
    ...titleBarButton(ClassNames.Close, Icon.Close, Ids.Close, UiStrings.Minimize),
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
