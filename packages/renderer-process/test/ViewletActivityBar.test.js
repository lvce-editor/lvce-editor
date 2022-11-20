/**
 * @jest-environment jsdom
 */
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'

const getTitle = ($Element) => {
  return $Element.title
}

const getSimpleList = ($ActivityBar) => {
  return Array.from($ActivityBar.children).map(getTitle)
}

test('create', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
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
  ])
  expect(getSimpleList(state.$ActivityBar)).toEqual([
    'Explorer',
    'Search',
    'Settings',
  ])
})

test('setItems', () => {
  const state = ViewletActivityBar.create()
  ViewletActivityBar.setItems(state, [
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
  ])
  ViewletActivityBar.setItems(state, [
    {
      id: 'Run and Debug',
      title: 'Run and Debug',
      icon: './icons/debug-alt-2.svg',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
    },
    {
      id: 'Extensions',
      title: 'Extensions',
      icon: './icons/extensions.svg',
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
  ])
  ViewletActivityBar.setFocusedIndex(state, -1, 0, true)
  expect(
    state.$ActivityBar.children[0].classList.contains('FocusOutline')
  ).toBe(true)
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
  ])
  expect(state.$ActivityBar.role).toBe('toolbar')
  expect(state.$ActivityBar.ariaRoleDescription).toBe('Activity Bar')
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
  ])
  const $ActivityBarItemOne = state.$ActivityBar.children[0]
  expect($ActivityBarItemOne.ariaKeyShortcuts).toBe('Ctrl+Shift+X')
  const $ActivityBarItemTwo = state.$ActivityBar.children[1]
  expect($ActivityBarItemTwo.ariaKeyShortcuts).toBe('Ctrl+Shift+F')
  const $ActivityBarItemThree = state.$ActivityBar.children[2]
  expect($ActivityBarItemThree.ariaKeyShortcuts).not.toBeDefined()
})
