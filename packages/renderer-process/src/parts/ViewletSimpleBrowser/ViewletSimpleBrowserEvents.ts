import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletSimpleBrowserFunctions from './ViewletSimpleBrowserFunctions.ts'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletSimpleBrowserFunctions.handleInput(value)
}

export const handleFocus = (event) => {
  const { target } = event
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusSimpleBrowserInput)
  setTimeout(() => {
    target.select()
  })
}

export const handleBlur = (event) => {
  const { target } = event
  target.setSelectionRange(0, 0)
}

export const handleClickForward = () => {
  ViewletSimpleBrowserFunctions.forward()
}

export const handleClickBackward = () => {
  ViewletSimpleBrowserFunctions.backward()
}

export const handleClickReload = (event) => {
  const { target } = event
  // TODO maybe set data attribute to check if it is a cancel button
  // TODO do checks in renderer worker
  if (target.title === 'Cancel') {
    ViewletSimpleBrowserFunctions.cancelNavigation()
  } else {
    ViewletSimpleBrowserFunctions.reload()
  }
}

export const handleClickOpenExternal = () => {
  ViewletSimpleBrowserFunctions.openExternal()
}
