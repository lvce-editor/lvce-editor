import * as Viewlet from '../Viewlet/Viewlet.js' // TODO dependency to viewlet is not good

const toContextMenuItem = (activityBarItem) => {
  return {
    label: activityBarItem.id,
    id: 8000, // TODO
    flags: activityBarItem.enabled ? /* Checked */ 2 : /* Unchecked */ 3,
  }
}

export const getMenuEntries = async () => {
  const activityBarItems =
    Viewlet.state.instances['ActivityBar'].state.activityBarItems
  return [
    ...activityBarItems.map(toContextMenuItem),
    {
      id: 'separator',
      label: 'Separator',
      flags: /* Separator */ 1,
    },
    {
      id: 'moveSideBarLeft',
      label: 'Move Side Bar Left', // TODO should be dynamic
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
    {
      id: 'hideActivityBar',
      label: 'Hide Activity Bar',
      flags: /* None */ 0,
      command: /* Layout.hideActivityBar */ 'Layout.hideActivityBar',
    },
  ]
}
