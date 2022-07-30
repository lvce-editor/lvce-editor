import * as ElementActions from './ElementActions.js'

export const press = (options) => {
  const element = document.activeElement

  ElementActions.keyDown(element, options)
  ElementActions.keyUp(element, options)
}
