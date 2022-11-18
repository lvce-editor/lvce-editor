import * as ViewletTitleBarButtonEvents from './ViewletTitleBarButtonsEvents.js'

const create$TitleBarButton = (id, icon, label) => {
  const $Icon = document.createElement('i')
  $Icon.className = `MaskIcon ${icon}`

  const $TitleBarButton = document.createElement('button')
  $TitleBarButton.className = 'TitleBarButton'
  $TitleBarButton.id = `TitleBarButton${id}`
  $TitleBarButton.ariaLabel = label
  $TitleBarButton.append($Icon)
  return $TitleBarButton
}

export const create = () => {
  const $ButtonMinimize = create$TitleBarButton(
    'Minimize',
    'Minimize',
    'Minimize'
  )
  const $ButtonToggleMaximize = create$TitleBarButton(
    'ToggleMaximize',
    'ToggleMaximize',
    'Toggle Maximize'
  )
  const $ButtonClose = create$TitleBarButton('Close', 'Close', 'Close')

  const $TitleBarButtons = document.createElement('div')
  $TitleBarButtons.id = 'TitleBarButtons'
  $TitleBarButtons.onmousedown =
    ViewletTitleBarButtonEvents.handleTitleBarButtonsClick
  $TitleBarButtons.append($ButtonMinimize, $ButtonToggleMaximize, $ButtonClose)
  return {
    $TitleBarButtons,
    $Viewlet: $TitleBarButtons,
  }
}

export const dispose = (state) => {}

export const setButtons = (state, buttons) => {
  const { $TitleBarButtons } = state
  for (const button of buttons) {
    const $Icon = document.createElement('i')
    $Icon.className = `MaskIcon ${button.icon}`
    const $TitleBarButton = document.createElement('button')
    $TitleBarButton.className = 'TitleBarButton'
    $TitleBarButton.id = `TitleBarButton${button.id}`
    $TitleBarButton.ariaLabel = button.label
    $TitleBarButton.append($Icon)
    $TitleBarButtons.append($TitleBarButton)
  }
}
