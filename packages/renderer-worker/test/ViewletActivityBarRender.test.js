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
            ariaKeyShortcuts: 'Control+Shift+E',
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
            ariaKeyShortcuts: 'Control+Shift+F',
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
            ariaKeyShortcuts: 'Control+Shift+G',
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
            ariaKeyShortcuts: undefined,
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
            ariaKeyShortcuts: '',
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
            ariaKeyShortcuts: 'Control+Shift+E',
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
            ariaKeyShortcuts: 'Control+Shift+F',
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
            ariaKeyShortcuts: 'Control+Shift+G',
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
            ariaKeyShortcuts: 'Control+Shift+D',
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
            ariaKeyShortcuts: 'Control+Shift+X',
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
            ariaKeyShortcuts: '',
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

test('accessibility - ActivityBarItem tab should have role tab and aria-keyshortcuts', () => {
  const oldState = { ...ViewletActivityBar.create(), height: 6000 }
  const newState = {
    ...oldState,
    activityBarItems: [
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: './icons/files.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Control+Shift+X',
      },
      {
        id: 'Search',
        title: 'Search',
        icon: './icons/search.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
      },
      {
        id: 'Settings',
        title: 'Settings',
        icon: './icons/settings-gear.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
      },
    ],
  }
  const changes = render(oldState, newState)
  const dom = changes[0][3]
  expect(dom[1].props.role).toBe('tab')
  expect(dom[1].props.ariaKeyShortcuts).toBe('Control+Shift+X')
})

// TODO move test to renderer worker
test('accessibility - ActivityBar should have role toolbar, ariaLabel and ariaOrientation', () => {
  const oldState = { ...ViewletActivityBar.create(), height: 6000 }
  const newState = {
    ...oldState,
    activityBarItems: [
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: './icons/files.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
      },
      {
        id: 'Search',
        title: 'Search',
        icon: './icons/search.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
      },
      {
        id: 'Settings',
        title: 'Settings',
        icon: './icons/settings-gear.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
      },
    ],
  }
  const changes = render(oldState, newState)
  const dom = changes[0][3]
  const $ActivityBar = dom[0]
  expect($ActivityBar.props.role).toBe('toolbar')
  expect($ActivityBar.props.ariaLabel).toBe('Activity Bar')
  expect($ActivityBar.props.ariaOrientation).toBe('vertical')
})

test('accessibility - ActivityBarItem button should have role button and ariaHasPopup', () => {
  const oldState = {
    ...ViewletActivityBar.create(),
    height: 6000,
  }
  const newState = {
    ...oldState,
    activityBarItems: [
      {
        id: 'Explorer',
        title: 'Explorer',
        icon: './icons/files.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Ctrl+Shift+X',
      },
      {
        id: 'Search',
        title: 'Search',
        icon: './icons/search.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Tab,
        keyShortcuts: 'Ctrl+Shift+F',
      },
      {
        id: 'Settings',
        title: 'Settings',
        icon: './icons/settings-gear.svg',
        enabled: true,
        flags: ActivityBarItemFlags.Button,
        keyShortcuts: '',
      },
    ],
  }
  const changes = render(oldState, newState)
  const dom = changes[0][3]
  const $LastChild = dom[dom.length - 2]
  expect($LastChild.props.role).toBe('button')
  expect($LastChild.props.ariaHasPopup).toBe(true)
})
