import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getLayoutDom = (moduleCommands) => {
  // const dom
  console.log({ moduleCommands })
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
      childCount: 0,
    },
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
      childCount: 0,
    },
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
