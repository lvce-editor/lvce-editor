import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ExtensionKeyBindings/ExtensionKeyBindings.js', () => {
  return {
    getKeyBindings: jest.fn(() => {
      return [
        {
          key: 3,
          command: 'ExtensionHost.executeCommand',
          args: ['extension.command'],
        },
      ]
    }),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    warn: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ViewletModule/ViewletModule.js', () => {
  return {
    load: jest.fn((id) => {
      if (id === 'Broken') {
        return {
          name: 'BrokenView',
          getKeyBindings() {
            throw new Error('Command not found BrokenView.getKeyBindings')
          },
        }
      }
      return {
        name: 'WorkingView',
        getKeyBindings() {
          return [
            {
              key: 2,
              command: 'WorkingView.focus',
            },
          ]
        },
      }
    }),
  }
})

jest.unstable_mockModule('../src/parts/ViewletModuleId/ViewletModuleId.js', () => {
  return {
    Broken: 'Broken',
    Working: 'Working',
  }
})

const KeyBindingsInitial = await import('../src/parts/KeyBindingsInitial/KeyBindingsInitial.js')
const Logger = await import('../src/parts/Logger/Logger.js')

test('getKeyBindings', async () => {
  expect(await KeyBindingsInitial.getKeyBindings()).toEqual([
    {
      key: 2,
      command: 'WorkingView.focus',
    },
    {
      key: 3,
      command: 'ExtensionHost.executeCommand',
      args: ['extension.command'],
    },
  ])
  expect(Logger.warn).toHaveBeenCalledTimes(1)
  expect(Logger.warn).toHaveBeenCalledWith('Failed to load keybindings for BrokenView: Error: Command not found BrokenView.getKeyBindings')
})
