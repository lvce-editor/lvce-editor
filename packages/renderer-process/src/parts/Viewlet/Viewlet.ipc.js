import * as Viewlet from '../Viewlet/Viewlet.js'

export const name = 'Viewlet'

export const Commands = {
  appendViewlet: Viewlet.appendViewlet,
  dispose: Viewlet.dispose,
  executeCommands: Viewlet.executeCommands,
  focus: Viewlet.focus,
  handleError: Viewlet.handleError,
  invoke: Viewlet.invoke,
  loadModule: Viewlet.loadModule,
  refresh: Viewlet.refresh,
  send: Viewlet.invoke,
  sendMultiple: Viewlet.sendMultiple,
  setBounds: Viewlet.setBounds,
  show: Viewlet.show,
}
