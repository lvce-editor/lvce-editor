/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ActvityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActvityBarItemFlags.js'

beforeEach(() => {
  jest.resetAllMocks()
  Layout.state.$ActivityBar = document.createElement('div')
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletActivityBar = await import(
  '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
)
const Layout = await import('../src/parts/Layout/Layout.js')

const getTitle = ($Element) => {
  return $Element.title
}

const getSimpleList = ($ActivityBar) => {
  return Array.from($ActivityBar.children).map(getTitle)
}

test('name', () => {
  expect(ViewletActivityBar.name).toBe('ActivityBar')
})

test('create', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  expect(getSimpleList(state.$ActivityBar)).toEqual([
    'Explorer',
    'Search',
    'Settings',
  ])
})

test('setItems', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  ViewletActivityBar.setItems(state, [
    {
      id: 'Run and Debug',
      title: 'Run and Debug',
      icon: './icons/debug-alt-2.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Extensions',
      title: 'Extensions',
      icon: './icons/extensions.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  expect(getSimpleList(state.$ActivityBar)).toEqual([
    'Run and Debug',
    'Extensions',
    'Settings',
  ])
})

test('setFocusedIndex', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  ViewletActivityBar.setFocusedIndex(state, -1, 0)
  expect(
    state.$ActivityBar.children[0].classList.contains('FocusOutline')
  ).toBe(true)
})

test('event - handleClick - top', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  ViewletActivityBar.setFocusedIndex(state, -1, 0)
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    clientX: 15,
    clientY: 30,
    cancelable: true,
  })
  state.$ActivityBar.children[1].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ActivityBar.handleClick',
    1,
    15,
    30
  )
})

test('event - handleClick - bottom', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$ActivityBar.lastChild.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 15,
      clientY: 30,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ActivityBar.handleClick',
    2,
    15,
    30
  )
})

test('event - handleClick - no item is clicked', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    clientX: 15,
    clientY: 30,
    cancelable: true,
  })
  state.$ActivityBar.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - handleContextMenu', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const $ActivityBarItemsTop = state.$ActivityBar.children[1]
  $ActivityBarItemsTop.children[0].dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 15,
      clientY: 30,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'ActivityBar.handleContextMenu',
    15,
    30
  )
})

// TODO test interaction with sidebar
// TODO test interaction with stitleebar

// TODO test select and focus

// TODO test aria attributes

test('accessibility - ActivityBarItem tab should have role tab and aria-keyshortcuts', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+X',
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  expect(state.$ActivityBar.firstChild.role).toBe('tab')
  expect(state.$ActivityBar.firstChild.ariaKeyShortcuts).toBe('Control+Shift+X')
})

test('accessibility - ActivityBar should have role toolbar, ariaLabel and ariaOrientation', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
    },
  ])
  expect(state.$ActivityBar.role).toBe('toolbar')
  expect(state.$ActivityBar.ariaLabel).toBe('Activity Bar')
  expect(state.$ActivityBar.ariaOrientation).toBe('vertical')
})

test('accessibility - ActivityBarItem button should have role button and ariaHasPopup', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
      keyShortcuts: 'Ctrl+Shift+X',
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
      keyShortcuts: 'Ctrl+Shift+F',
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
      keyShortcuts: '',
    },
  ])
  expect(state.$ActivityBar.lastChild.role).toBe('button')
  expect(state.$ActivityBar.lastChild.ariaHasPopup).toBe('true')
})

test('accessibility - ActivityBarItems should have ariaKeyShortcuts if applicable', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      title: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
      keyShortcuts: 'Ctrl+Shift+X',
    },
    {
      id: 'Search',
      title: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Tab,
      keyShortcuts: 'Ctrl+Shift+F',
    },
    {
      id: 'Settings',
      title: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: ActvityBarItemFlags.Button,
      keyShortcuts: '',
    },
  ])
  const $ActivityBarItemOne = state.$ActivityBar.children[0]
  expect($ActivityBarItemOne.ariaKeyShortcuts).toBe('Ctrl+Shift+X')
  const $ActivityBarItemTwo = state.$ActivityBar.children[1]
  expect($ActivityBarItemTwo.ariaKeyShortcuts).toBe('Ctrl+Shift+F')
  const $ActivityBarItemThree = state.$ActivityBar.children[2]
  expect($ActivityBarItemThree.ariaKeyShortcuts).not.toBeDefined()
})
