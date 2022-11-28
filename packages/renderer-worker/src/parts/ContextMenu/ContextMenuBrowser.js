import * as Menu from '../Menu/Menu.js'

export const show = async (x, y, id, ...args) => {
  await Menu.hide()
  // TODO handle error
  // TODO race condition
  await Menu.show(x, y, id, /* mouseBlocking */ true, ...args)
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?
}
