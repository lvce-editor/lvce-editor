import * as Assert from '../Assert/Assert.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const show = async (x, y, id) => {
  Assert.number(x)
  Assert.number(y)
  Assert.string(id)
  // TODO delete all open and pending menus
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?
  // TODO handle error
  // TODO race condition
  await Viewlet.openWidget('Menu', /* x */ x, /* y */ y, /* id */ id)
}
