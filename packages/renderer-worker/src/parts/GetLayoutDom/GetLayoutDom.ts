import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getLayoutDom = (moduleCommands) => {
  // const dom
  console.log({ moduleCommands })
  const titleBarDom = moduleCommands.TitleBar
  const titleBarDomChildCount = titleBarDom.length ? 1 : 0
  const mainDom = moduleCommands.Main
  const mainDomCount = mainDom.length ? 1 : 0
  const sideBarDom = moduleCommands.SideBar
  const sideBarDomCount = sideBarDom.length ? 1 : 0
  const panelDom = moduleCommands.Panel
  const panelDomCount = panelDom.length ? 1 : 0
  const statusBarDom = moduleCommands.StatusBar
  const statusBarDomCount = statusBarDom.length ? 1 : 0
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Layout Workbench',
      id: 'Workbench',
      role: 'application',
      childCount: 4,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBar',
      id: 'TitleBar',
      childCount: titleBarDomChildCount,
    },
    ...titleBarDom,
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Content',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Main',
      id: 'Main',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SideBar',
      id: 'SideBar',
      childCount: sideBarDomCount,
    },
    ...sideBarDom,
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ActivityBar',
      id: 'ActivityBar',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Panel',
      id: 'Panel',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet StatusBar',
      id: 'StatusBar',
      childCount: 0,
    },
  ]
}
