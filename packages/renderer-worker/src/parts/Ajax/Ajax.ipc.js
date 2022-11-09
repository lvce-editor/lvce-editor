import * as Ajax from './Ajax.js'

// TODO only use Ajax module via ipc -> that way is is always lazyloaded

export const name = 'Ajax'

export const Commands = {
  getBlob: Ajax.getBlob,
  getJson: Ajax.getJson,
  getText: Ajax.getText,
}
