/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletActivityBar = await import(
  '../src/parts/ViewletActivityBar/ViewletActivityBar.js'
)

const getTitle = ($Element) => {
  return $Element.title
}

test('event - handleClick - top', () => {
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
  ViewletActivityBar.setFocusedIndex(state, -1, 0)
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
  const { $ActivityBar } = state
  const $ActivityBarItemsTop = $ActivityBar.children[1]
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
