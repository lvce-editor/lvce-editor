import * as Menu from '../Menu/Menu.js'
import * as Assert from '../Assert/Assert.js'

export const show = async (x, y, id) => {
  Assert.number(x)
  Assert.number(y)
  Assert.string(id)

  await Menu.hide()
  // TODO handle error
  // TODO race condition
  await Menu.show(x, y, id, /* mouseBlocking */ true)
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?
}
