/**
 * @jest-environment jsdom
 */
import * as Layout from '../src/parts/Layout/Layout.js'
import * as ViewletActivityBar from '../src/parts/ViewletActivityBar/ViewletActivityBar.js'

beforeEach(() => {
  Layout.state.$ActivityBar = document.createElement('div')
})

const getTitle = ($Element) => {
  return $Element.title
}

const getSimpleList = ($ActivityBar) => {
  return Array.from($ActivityBar.children).map(getTitle)
}

test('name', () => {
  expect(ViewletActivityBar.name).toBe('ActivityBar')
})

test.skip('create', () => {
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

test.skip('setItems', () => {
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

test.skip('setFocusedIndex', () => {
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

// TODO test interaction with sidebar
// TODO test interaction with stitleebar

// TODO test select and focus

// TODO test aria attributes

// TODO move this test to renderer worker or add e2e test for this
test.skip('accessibility - ActivityBarItems should have ariaKeyShortcuts if applicable', () => {
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
