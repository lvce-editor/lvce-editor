/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as ActivityBarItemFlags from '../src/parts/ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js', () => {
  return {
    executeViewletCommand: jest.fn(() => {}),
  }
})

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.js')
const ViewletActivityBar = await import('../src/parts/ViewletActivityBar/ViewletActivityBar.js')

test('event - handleClick - top', () => {
  const state = ViewletActivityBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletActivityBar.attachEvents(state)
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0, 1, 15, 30)
})

test('event - handleClick - bottom', () => {
  const state = ViewletActivityBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletActivityBar.attachEvents(state)
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
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleClick', 0, 2, 15, 30)
})

test('event - handleClick - no item is clicked', () => {
  const state = ViewletActivityBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletActivityBar.attachEvents(state)
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
  expect(ExecuteViewletCommand.executeViewletCommand).not.toHaveBeenCalled()
})

test('event - handleContextMenu', () => {
  const state = ViewletActivityBar.create()
  const { $Viewlet } = state
  ComponentUid.set($Viewlet, 1)
  ViewletActivityBar.attachEvents(state)
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
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: 15,
    clientY: 30,
  })
  $ActivityBar.children[0].dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ExecuteViewletCommand.executeViewletCommand).toBeCalledTimes(1)
  expect(ExecuteViewletCommand.executeViewletCommand).toHaveBeenCalledWith(1, 'handleContextMenu', 0, 15, 30)
})
