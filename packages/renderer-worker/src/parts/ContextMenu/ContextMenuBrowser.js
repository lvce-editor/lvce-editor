import * as Menu from '../Menu/Menu.js'
import * as Assert from '../Assert/Assert.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'

export const show = async (x, y, id) => {
  await Menu.hide()
  // TODO handle error
  // TODO race condition
  await Menu.show(x, y, id, /* mouseBlocking */ true)
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?
}
