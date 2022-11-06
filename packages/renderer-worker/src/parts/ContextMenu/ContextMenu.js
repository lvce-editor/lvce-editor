import * as Menu from '../Menu/Menu.js'
import * as Assert from '../Assert/Assert.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'

const showBrowserContextMenu = async (x, y, id) => {
  await Menu.hide()
  // TODO handle error
  // TODO race condition
  await Menu.show(x, y, id, /* mouseBlocking */ true)
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?
}

const showElectronContextMenu = async (x, y, id) => {
  const entries = await MenuEntries.getMenuEntries(id)
  console.log({ x, y, id, entries })
  const template = [
    {
      label: 'Menu Item 1',
    },
    { type: 'separator' },
    { label: 'Menu Item 2', type: 'checkbox', checked: true },
  ]
  await ElectronMenu.openContextMenu(template)
}

export const show = async (x, y, id) => {
  Assert.number(x)
  Assert.number(y)
  Assert.number(id)
  if (Platform.platform === PlatformType.Electron) {
    return showElectronContextMenu(x, y, id)
  }
  return showBrowserContextMenu(x, y, id)
}
