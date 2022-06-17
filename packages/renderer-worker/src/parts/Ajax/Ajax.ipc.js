import * as Command from '../Command/Command.js'
import * as Ajax from './Ajax.js'

// TODO only use Ajax module via ipc -> that way is is always lazyloaded
export const __initialize__ = () => {
  Command.register(270, Ajax.getJson)
  Command.register(271, Ajax.getText)
}
