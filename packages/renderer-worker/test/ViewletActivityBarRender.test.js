import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActvityBarItemFlags.js'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletActivityBar, oldState, newState)
}

test('render - two items do not fit', () => {
  const oldState = ViewletActivityBar.create()
  const newState = {
    ...oldState,
    height: oldState.itemHeight * 5,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        title: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        title: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        title: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        title: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }

  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setDom',
      [
        {
          childCount: 5,
          props: {
            ariaLabel: 'Activity Bar',
            ariaOrientation: 'vertical',
            id: 'ActivityBar',
            role: 'toolbar',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Explorer',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/files.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Search',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/search.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Source Control',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/source-control.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaHasPopup: true,
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'button',
            tabindex: -1,
            title: 'Additional Views',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/ellipsis.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaHasPopup: true,
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'button',
            tabindex: -1,
            title: 'Settings',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/settings-gear.svg")',
          },
          type: VirtualDomElements.Div,
        },
      ],
    ],
  ])
})

test('render - all items fit but little space is remaining', () => {
  const oldState = ViewletActivityBar.create()
  const newState = {
    ...oldState,
    height: 369,
    activityBarItems: [
      // Top
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: 'icons/files.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+E',
      },
      {
        id: 'Search',
        title: 'Search',
        icon: 'icons/search.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+F',
      },
      {
        id: 'Source Control',
        title: 'Source Control',
        icon: 'icons/source-control.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+G',
      },
      {
        id: 'Run and Debug',
        title: 'Run and Debug',
        icon: 'icons/debug-alt-2.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+D',
      },
      {
        id: 'Extensions',
        title: 'Extensions',
        icon: 'icons/extensions.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      // Bottom
      {
        id: 'Settings',
        title: 'Settings',
        icon: 'icons/settings-gear.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }
  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'ActivityBar',
      'setDom',
      [
        {
          childCount: 6,
          props: {
            ariaLabel: 'Activity Bar',
            ariaOrientation: 'vertical',
            id: 'ActivityBar',
            role: 'toolbar',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Explorer',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/files.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Search',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/search.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Source Control',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/source-control.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Run and Debug',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/debug-alt-2.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'tab',
            tabindex: -1,
            title: 'Extensions',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/extensions.svg")',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          props: {
            ariaHasPopup: true,
            ariaLabel: '',
            ariaSelected: false,
            className: 'ActivityBarItem',
            role: 'button',
            tabindex: -1,
            title: 'Settings',
          },
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          props: {
            className: 'ActivityBarItemIcon',
            style: '-webkit-mask-image: url("icons/settings-gear.svg")',
          },
          type: VirtualDomElements.Div,
        },
      ],
    ],
  ])
})
