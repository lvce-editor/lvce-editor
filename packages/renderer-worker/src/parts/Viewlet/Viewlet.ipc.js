import * as Viewlet from './Viewlet.js'

export const name = 'Viewlet'

export const Commands = {
  2133: Viewlet.send,
  closeWidget: Viewlet.closeWidget,
  executeViewletCommand: Viewlet.executeViewletCommand,
  focus: Viewlet.focus,
  getAllStates: Viewlet.getAllStates,
  openWidget: Viewlet.openWidget,
  send: Viewlet.send,
  dispose: Viewlet.dispose,
  resize: Viewlet.resize,
}
