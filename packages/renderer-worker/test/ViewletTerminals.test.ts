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

test('loadContent always creates the xterm terminal view', async () => {
  const state = ViewletTerminals.create(1, '', 10, 20, 800, 400)
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
    '',
  )
  expect(newState).toMatchObject({
    childUid: 42,
    selectedIndex: 0,
    terminalTabsEnabled: true,
  })
})
