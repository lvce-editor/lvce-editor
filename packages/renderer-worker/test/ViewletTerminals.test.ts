import { expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: commandExecute,
  }
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create() {
      return 42
    },
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get(key) {
      if (key === 'terminal.tabs.enabled') {
        return true
      }
      return undefined
    },
  }
})

const ViewletModuleId = await import('../src/parts/ViewletModuleId/ViewletModuleId.js')
const ViewletTerminals = await import('../src/parts/ViewletTerminals/ViewletTerminals.js')
const ViewletTerminalsRender = await import('../src/parts/ViewletTerminals/ViewletTerminalsRender.js')

test('loadContent creates the xterm terminal view with the requested cwd', async () => {
  const state = ViewletTerminals.create(1, 'file:///workspace/folder', 10, 20, 800, 400)
  const newState = await ViewletTerminals.loadContent(state)

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    {
      height: 400,
      width: 710,
      x: 10,
      y: 20,
    },
    'file:///workspace/folder',
  )
  expect(newState).toMatchObject({
    childUid: 42,
    selectedIndex: 0,
    terminalTabsEnabled: true,
  })
})

test('addTerminal creates and focuses a terminal with the requested cwd', async () => {
  const state = {
    ...ViewletTerminals.create(1, '', 10, 20, 800, 400),
    childUid: -1,
    focusVersion: 2,
    tabs: [{ icon: 'Terminal', label: 'tab 1', uid: 41 }],
  }

  const newState = await ViewletTerminals.addTerminal(state, 'file:///workspace/folder')

  expect(commandExecute).toHaveBeenCalledWith(
    'Layout.createViewlet',
    ViewletModuleId.Terminal2,
    42,
    0,
    {
      height: 400,
      width: 710,
      x: 10,
      y: 20,
    },
    'file:///workspace/folder',
  )
  expect(newState).toMatchObject({
    childUid: 42,
    focusVersion: 3,
    selectedIndex: 1,
  })
})

test('focus eventually focuses the mounted xterm child', () => {
  const state = {
    ...ViewletTerminals.create(1, '', 10, 20, 800, 400),
    childUid: 42,
  }

  const newState = ViewletTerminals.focus(state)

  expect(newState.focusVersion).toBe(1)
  expect(ViewletTerminalsRender.renderFocus.isEqual(state, newState)).toBe(false)
  expect(ViewletTerminalsRender.renderFocus.apply(state, newState)).toEqual([['Viewlet.focus', 42]])
})
