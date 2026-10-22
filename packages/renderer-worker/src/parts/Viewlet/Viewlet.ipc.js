import * as GetMainAreaUid from '../GetMainAreaUid/GetMainAreaUid.ts'
import * as Viewlet from './Viewlet.js'

export const name = 'Viewlet'

export const Commands = {
  2133: Viewlet.send,
  applyCommands: Viewlet.applyCommands,
  closeWidget: Viewlet.closeWidget,
  executeViewletCommand: Viewlet.executeViewletCommand,
  focus: Viewlet.focus,
  focusSelector: Viewlet.focusSelector,
  getMainAreaUid: GetMainAreaUid.getMainAreaUid,
  getAllStates: Viewlet.getAllStates,
  getDragData: Viewlet.getDragData,
  getTitle: Viewlet.getTitle,
  requestRender: Viewlet.requestRender,
  openWidget: Viewlet.openWidget,
  reload: Viewlet.reload,
  runLoadContentLater: Viewlet.runLoadContentLater,
  send: Viewlet.send,
  save: Viewlet.save,
  dispose: Viewlet.dispose,
  hide: Viewlet.hide,
  resize: Viewlet.resize,
}
