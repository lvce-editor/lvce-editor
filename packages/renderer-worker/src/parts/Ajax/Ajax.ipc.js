import * as Ajax from './Ajax.js'

// TODO only use Ajax module via ipc -> that way is is always lazyloaded

export const Commands = {
  'Ajax.getJson': Ajax.getJson,
  'Ajax.getText': Ajax.getText,
  'Ajax.getBlob': Ajax.getBlob,
}
