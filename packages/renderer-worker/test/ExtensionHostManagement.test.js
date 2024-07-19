import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  ExtensionHostManagement.state.extensionHosts = []
  ExtensionHostManagement.state.cachedActivationEvents = Object.create(null)
  ExtensionHostManagement.state.activatedExtensions = []
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: PlatformType.Remote,
    assetDir: '',
  }
})
jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => {
  return {
    hasLoaded: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ExtensionHostManagement/ExtensionHostManagementShared.js', () => {
  return {
    startExtensionHost: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ExtensionMeta/ExtensionMeta.js', () => {
  return {
    getExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
    organizeExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
    handleRejectedExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
    filterByMatchingEvent: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostManagement = await import('../src/parts/ExtensionHostManagement/ExtensionHostManagement.js')
const ExtensionHostManagementShared = await import('../src/parts/ExtensionHostManagement/ExtensionHostManagementShared.js')
const Languages = await import('../src/parts/Languages/Languages.js')
const ExtensionMeta = await import('../src/parts/ExtensionMeta/ExtensionMeta.js')

test.skip('activateByEvent', async () => {
  // @ts-ignore
  Languages.hasLoaded.mockImplementation(() => {
    return true
  })
  // @ts-ignore
  ExtensionMeta.getExtensions.mockImplementation(() => {})
  // @ts-ignore
  ExtensionMeta.organizeExtensions.mockImplementation(() => {
    return {
      resolved: [],
      rejected: [],
    }
  })
  // @ts-ignore
  ExtensionMeta.handleRejectedExtensions.mockImplementation(() => {})
  // @ts-ignore
  ExtensionMeta.filterByMatchingEvent.mockImplementation(() => {
    return [
      {
        main: './main.js',
      },
    ]
  })
  const ipc = {
    invoke: jest.fn(),
  }
  // @ts-ignore
  ExtensionHostManagementShared.startExtensionHost.mockImplementation(() => {
    return {
      ipc,
    }
  })
  await ExtensionHostManagement.activateByEvent('onLanguage:test')
  expect(ipc.invoke).toHaveBeenCalledTimes(0)
})

test.skip('activateByEvent - twice - should activate extension only once', async () => {
  // @ts-ignore
  Languages.hasLoaded.mockImplementation(() => {
    return true
  })
  // @ts-ignore
  ExtensionMeta.getExtensions.mockImplementation(() => {})
  // @ts-ignore
  ExtensionMeta.organizeExtensions.mockImplementation(() => {
    return {
      resolved: [],
      rejected: [],
    }
  })
  // @ts-ignore
  ExtensionMeta.handleRejectedExtensions.mockImplementation(() => {})
  // @ts-ignore
  ExtensionMeta.filterByMatchingEvent.mockImplementation(() => {
    return [
      {
        main: './main.js',
      },
    ]
  })
  const ipc = {
    invoke: jest.fn(),
  }
  // @ts-ignore
  ExtensionHostManagementShared.startExtensionHost.mockImplementation(() => {
    return {
      ipc,
    }
  })
  await ExtensionHostManagement.activateByEvent('onLanguage:test')
  await ExtensionHostManagement.activateByEvent('onLanguage:test')
  expect(ExtensionHostManagementShared.startExtensionHost).toHaveBeenCalledTimes(0)
  expect(ipc.invoke).toHaveBeenCalledTimes(0)
})

test.skip('activateByEvent - should activate extension only once - race condition', async () => {
  // @ts-ignore
  Languages.hasLoaded.mockImplementation(() => {
    return true
  })
  // @ts-ignore
  ExtensionMeta.getExtensions.mockImplementation(() => {})
  // @ts-ignore
  ExtensionMeta.organizeExtensions.mockImplementation(() => {
    return {
      resolved: [],
      rejected: [],
    }
  })
  // @ts-ignore
  ExtensionMeta.handleRejectedExtensions.mockImplementation(() => {})
  // @ts-ignore
  ExtensionMeta.filterByMatchingEvent.mockImplementation(() => {
    return [
      {
        main: './main.js',
      },
    ]
  })
  const ipc = {
    invoke: jest.fn(),
  }
  // @ts-ignore
  ExtensionHostManagementShared.startExtensionHost.mockImplementation(() => {
    return {
      ipc,
    }
  })
  await Promise.all([ExtensionHostManagement.activateByEvent('onLanguage:test'), ExtensionHostManagement.activateByEvent('onLanguage:test')])
  expect(ExtensionHostManagementShared.startExtensionHost).toHaveBeenCalledTimes(0)
  expect(ipc.invoke).toHaveBeenCalledTimes(0)
})
