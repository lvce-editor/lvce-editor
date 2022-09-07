import * as Viewlet from '../Viewlet/Viewlet.js'

export const Commands = {
  'Viewlet.refresh': Viewlet.refresh,
  'Viewlet.invoke': Viewlet.invoke,
  'Viewlet.send': Viewlet.invoke,
  'Viewlet.focus': Viewlet.focus,
  'Viewlet.dispose': Viewlet.dispose,
  'Viewlet.appendViewlet': Viewlet.appendViewlet,
  'Viewlet.load': Viewlet.load,
  'Viewlet.handleError': Viewlet.handleError,
  'Viewlet.sendMultiple': Viewlet.sendMultiple,
  'Viewlet.loadModule': Viewlet.loadModule,
  'Viewlet.show': Viewlet.show,
  'Viewlet.executeCommands': Viewlet.executeCommands,
}
