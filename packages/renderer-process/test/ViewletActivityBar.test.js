/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

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
  '../src/parts/Viewlet/ViewletActivityBar.js'
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
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
    },
  ])
  ViewletActivityBar.setItems(state, [
    {
      id: 'Run and Debug',
      icon: './icons/debug-alt-2.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Extensions',
      icon: './icons/extensions.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'ActivityBar.handleClick',
    1,
    15,
    30,
  ])
})

test('event - handleClick - bottom', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'ActivityBar.handleClick',
    2,
    15,
    30,
  ])
})

test('event - handleClick - no item is clicked', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'ActivityBar.handleContextMenu',
    15,
    30,
  ])
})

// TODO test interaction with sidebar

// TODO test select and focus

// TODO test aria attributes

test('accessibility - ActivityBarItem tab should have role tab and aria-keyshortcuts', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
      keyShortcuts: 'Control+Shift+X',
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
    },
  ])
  expect(state.$ActivityBar.firstChild.getAttribute('role')).toBe('tab')
  expect(state.$ActivityBar.firstChild.ariaKeyShortcuts).toBe('Control+Shift+X')
})

test('accessibility - ActivityBar should have role toolbar, ariaLabel and ariaOrientation', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
    },
  ])
  expect(state.$ActivityBar.getAttribute('role')).toBe('toolbar')
  expect(state.$ActivityBar.ariaLabel).toBe('Activity Bar')
  expect(state.$ActivityBar.ariaOrientation).toBe('vertical')
})

test('accessibility - ActivityBarItem button should have role button and ariaHasPopup', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
      keyShortcuts: 'Ctrl+Shift+X',
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
      keyShortcuts: 'Ctrl+Shift+F',
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
      keyShortcuts: '',
    },
  ])
  expect(state.$ActivityBar.lastChild.getAttribute('role')).toBe('button')
  expect(state.$ActivityBar.lastChild.ariaHasPopup).toBe('true')
})

test('accessibility - ActivityBarItems should have ariaKeyShortcuts if applicable', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
    {
      id: 'Explorer',
      icon: './icons/files.svg',
      enabled: true,
      flags: /* Tab */ 1,
      keyShortcuts: 'Ctrl+Shift+X',
    },
    {
      id: 'Search',
      icon: './icons/search.svg',
      enabled: true,
      flags: /* Tab */ 1,
      keyShortcuts: 'Ctrl+Shift+F',
    },
    {
      id: 'Settings',
      icon: './icons/settings-gear.svg',
      enabled: true,
      flags: /* Button */ 2,
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
