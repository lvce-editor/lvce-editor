/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as Layout from '../src/parts/Layout/Layout.js'

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

const getTitle = ($Element) => {
  return $Element.title
}

test.skip('event - handleClick - top', () => {
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

test.skip('event - handleClick - bottom', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  const { $ViewletActivityBar } = state
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

  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const event = new MouseEvent('mousedown', {
    bubbles: true,
    clientX: 15,
    clientY: 30,
    cancelable: true,
  })
  const { $ActivityBar } = state
  $ActivityBar.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - handleContextMenu', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletActivityBar.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const { $ActivityBar } = state
  $ActivityBar.dispatchEvent(
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
