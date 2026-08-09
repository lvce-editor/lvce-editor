import * as Viewlet from './Viewlet.js'

export const name = 'Viewlet'

export const Commands = {
  2133: Viewlet.send,
  closeWidget: Viewlet.closeWidget,
  executeViewletCommand: Viewlet.executeViewletCommand,
  focus: Viewlet.focus,
  focusSelector: Viewlet.focusSelector,
  getAllStates: Viewlet.getAllStates,
  getDragData: Viewlet.getDragData,
  getTitle: Viewlet.getTitle,
  openWidget: Viewlet.openWidget,
  reload: Viewlet.reload,
  send: Viewlet.send,
  dispose: Viewlet.dispose,
  resize: Viewlet.resize,
}
