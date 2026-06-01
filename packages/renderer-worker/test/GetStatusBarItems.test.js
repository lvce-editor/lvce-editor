import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostStatusBarItems.js', () => {
  return {
    getStatusBarItems: jest.fn(async () => [
      {
        id: 'classic.item',
        text: 'classic',
      },
    ]),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionHostManagement/ExtensionHostManagement.js', () => {
  return {
    activateByEvent: jest.fn(),
    getStatusBarItems: jest.fn(async () => [
      {
        name: 'isolated.item',
        text: 'isolated',
      },
    ]),
  }
})

const ExtensionHostStatusBarItems = await import('../src/parts/ExtensionHost/ExtensionHostStatusBarItems.js')
const ExtensionHostManagement = await import('../src/parts/ExtensionHostManagement/ExtensionHostManagement.js')
const GetStatusBarItems = await import('../src/parts/GetStatusBarItems/GetStatusBarItems.js')

test('getStatusBarItems merges classic and isolated extension items', async () => {
  await expect(GetStatusBarItems.getStatusBarItems(true, '/asset', 1)).resolves.toEqual([
    {
      command: '',
      icon: '',
      name: 'classic.item',
      text: 'classic',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: 'isolated.item',
      text: 'isolated',
      tooltip: '',
    },
  ])

  expect(ExtensionHostManagement.activateByEvent).toHaveBeenCalledWith('onSourceControl', '/asset', 1)
  expect(ExtensionHostStatusBarItems.getStatusBarItems).toHaveBeenCalledTimes(1)
  expect(ExtensionHostManagement.getStatusBarItems).toHaveBeenCalledTimes(1)
})

test('getStatusBarItems returns empty when items are hidden', async () => {
  await expect(GetStatusBarItems.getStatusBarItems(false, '/asset', 1)).resolves.toEqual([])

  expect(ExtensionHostManagement.activateByEvent).not.toHaveBeenCalled()
  expect(ExtensionHostStatusBarItems.getStatusBarItems).not.toHaveBeenCalled()
  expect(ExtensionHostManagement.getStatusBarItems).not.toHaveBeenCalled()
})
