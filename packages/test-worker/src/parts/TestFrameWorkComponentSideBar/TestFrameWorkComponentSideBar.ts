import * as Rpc from '../Rpc/Rpc.ts'

export const open = async (id: string) => {
  await Rpc.invoke('SideBar.openViewlet', id)
}

export const hide = async () => {
  await Rpc.invoke('Layout.hideSideBar')
}
