import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as ViewletDialogEvents from './ViewletDialogEvents.js'

export const create = () => {
  const $DialogTitle = document.createElement('h2')
  $DialogTitle.id = 'DialogTitle'

  const $DialogCloseButton = IconButton.create$Button('Close', Icon.Close)

  const $DialogHeader = document.createElement('div')
  $DialogHeader.className = 'DialogHeader'
  $DialogHeader.append($DialogTitle, $DialogCloseButton)

  const $DialogBodyErrorMessage = document.createElement('p')
  $DialogBodyErrorMessage.id = 'DialogBodyErrorMessage'

  const $DialogBodyErrorCodeFrame = document.createElement('code')
  $DialogBodyErrorCodeFrame.id = 'DialogBodyErrorCodeFrame'
  $DialogBodyErrorCodeFrame.ariaLabel = 'Code Frame'

  const $DialogBodyErrorStack = document.createElement('div')
  $DialogBodyErrorStack.id = 'DialogBodyErrorStack'

  const $DialogBodyOptions = document.createElement('div')
  $DialogBodyOptions.id = 'DialogBodyOptions'

  const $DialogBody = document.createElement('div')
  $DialogBody.id = 'DialogBody'
  $DialogBody.append($DialogBodyErrorMessage, $DialogBodyErrorCodeFrame, $DialogBodyErrorStack, $DialogBodyOptions)
  // TODO screen reader switches to browse mode for dialog and
  // reads dialog title and error message multiple times
  const $Dialog = document.createElement('dialog')
  $Dialog.className = 'Viewlet Dialog'
  $Dialog.id = 'Dialog'
  $Dialog.setAttribute(DomAttributeType.AriaLabelledBy, 'DialogTitle')
  $Dialog.setAttribute(DomAttributeType.AriaDescribedBy, 'DialogBodyErrorMessage')
  $Dialog.append($DialogHeader, $DialogBody)
  $Dialog.onclick = ViewletDialogEvents.handleClick

  return {
    $Viewlet: $Dialog,
    $DialogTitle,
    $DialogBodyErrorCodeFrame,
    $DialogBodyErrorMessage,
    $DialogBodyOptions,
    $DialogBodyErrorStack,
  }
}

export const postAppend = (state) => {
  const { $Viewlet } = state
  $Viewlet.showModal()
}

export const setHeader = (state, header) => {
  const { $DialogTitle } = state
  $DialogTitle.textContent = header
}

export const setButtons = (state, buttons) => {
  const { $DialogBodyOptions } = state
  for (const button of buttons) {
    const $DialogOption = document.createElement('button')
    $DialogOption.className = 'DialogOption'
    $DialogOption.textContent = button
    $DialogBodyOptions.append($DialogOption)
  }
}

export const setErrorMessage = (state, errorMessage) => {
  const { $DialogBodyErrorMessage } = state
  $DialogBodyErrorMessage.textContent = errorMessage
}

export const setCodeFrame = (state, errorMessage) => {
  const { $DialogBodyErrorCodeFrame } = state
  $DialogBodyErrorCodeFrame.textContent = errorMessage
}

export const setErrorStack = (state, errorStack) => {
  const { $DialogBodyErrorStack } = state
  $DialogBodyErrorStack.textContent = errorStack
}
