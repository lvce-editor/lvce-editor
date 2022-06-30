import * as Command from '../Command/Command.js'
import * as Ajax from './Ajax.js'

// TODO only use Ajax module via ipc -> that way is is always lazyloaded
export const __initialize__ = () => {
  Command.register('Ajax.getJson', Ajax.getJson)
  Command.register('Ajax.getText', Ajax.getText)
}
