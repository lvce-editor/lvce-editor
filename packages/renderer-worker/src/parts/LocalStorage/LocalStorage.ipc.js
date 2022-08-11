import * as Command from '../Command/Command.js'
import * as LocalStorage from './LocalStorage.js'

// TODO only use LocalStorage module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register('LocalStorage.clear', LocalStorage.clear)
  Command.register('LocalStorage.setJson', LocalStorage.setJson)
  Command.register('LocalStorage.getJson', LocalStorage.getJson)
  Command.register('LocalStorage.getText', LocalStorage.getText)
  Command.register('LocalStorage.setText', LocalStorage.setText)
}
