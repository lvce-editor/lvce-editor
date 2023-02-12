import * as Focus from '../Focus/Focus.js'
import * as ViewletSimpleBrowserFunctions from './ViewletSimpleBrowserFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletSimpleBrowserFunctions.handleInput(value)
}

export const handleFocus = (event) => {
  const { target } = event
  Focus.setFocus('SimpleBrowserInput')
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
  if (target.title === 'Cancel') {
    ViewletSimpleBrowserFunctions.cancelNavigation()
  } else {
    ViewletSimpleBrowserFunctions.reload()
  }
}

export const handleClickOpenExternal = () => {
  ViewletSimpleBrowserFunctions.openExternal()
}
