import * as Command from '../Command/Command.js'

export const open = async (id) => {
  await Command.execute('SideBar.showOrHideViewlet', id)
}
