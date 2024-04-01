import * as Viewlet from './Viewlet.ts'

export const name = 'Viewlet'

export const Commands = {
  addKeyBindings: Viewlet.addKeyBindings,
  appendViewlet: Viewlet.appendViewlet,
  dispose: Viewlet.dispose,
  executeCommands: Viewlet.executeCommands,
  focus: Viewlet.focus,
  handleError: Viewlet.handleError,
  invoke: Viewlet.invoke,
  loadModule: Viewlet.loadModule,
  refresh: Viewlet.refresh,
  removeKeyBindings: Viewlet.removeKeyBindings,
  send: Viewlet.invoke,
  sendMultiple: Viewlet.sendMultiple,
  setBounds: Viewlet.setBounds,
  show: Viewlet.show,
}
