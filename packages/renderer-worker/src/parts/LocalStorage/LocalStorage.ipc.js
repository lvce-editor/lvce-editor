import * as Command from '../Command/Command.js'
import * as LocalStorage from './LocalStorage.js'

// TODO only use LocalStorage module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register(6900, LocalStorage.clear)
  Command.register(6901, LocalStorage.setJson)
  Command.register(6902, LocalStorage.getJson)
  Command.register(6903, LocalStorage.getText)
  Command.register(6904, LocalStorage.setText)
}
