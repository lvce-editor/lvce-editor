import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
  ExtensionHostManagement.state.extensionHosts = []
  ExtensionHostManagement.state.cachedActivationEvents = Object.create(null)
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'remote',
  }
})
jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => {
  return {
    hasLoaded: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/ExtensionHostManagement/ExtensionHostManagementShared.js',
  () => {
    return {
      startExtensionHost: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule(
  '../src/parts/ExtensionHostManagement/ExtensionHostManagementNode.js',
  () => {
    return {
      canActivate: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
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

const ExtensionHostManagement = await import(
  '../src/parts/ExtensionHostManagement/ExtensionHostManagement.js'
)
const ExtensionHostManagementNode = await import(
  '../src/parts/ExtensionHostManagement/ExtensionHostManagementNode.js'
)
const ExtensionHostManagementShared = await import(
  '../src/parts/ExtensionHostManagement/ExtensionHostManagementShared.js'
)
const Languages = await import('../src/parts/Languages/Languages.js')
const ExtensionMeta = await import(
  '../src/parts/ExtensionMeta/ExtensionMeta.js'
)

test('activateByEvent', async () => {
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
  // @ts-ignore
  ExtensionHostManagementNode.canActivate.mockImplementation(() => {
    return true
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
  expect(ipc.invoke).toHaveBeenCalledTimes(2)
  expect(ipc.invoke).toHaveBeenNthCalledWith(
    1,
    'Workspace.setWorkspacePath',
    ''
  )
  expect(ipc.invoke).toHaveBeenNthCalledWith(
    2,
    'ExtensionHostExtension.enableExtension',
    { main: './main.js' }
  )
})

test('activateByEvent - twice - should activate extension only once', async () => {
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
  // @ts-ignore
  ExtensionHostManagementNode.canActivate.mockImplementation(() => {
    return true
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
  expect(
    ExtensionHostManagementShared.startExtensionHost
  ).toHaveBeenCalledTimes(2)
  expect(ipc.invoke).toHaveBeenCalledTimes(2)
  expect(ipc.invoke).toHaveBeenNthCalledWith(
    1,
    'Workspace.setWorkspacePath',
    ''
  )
  expect(ipc.invoke).toHaveBeenNthCalledWith(
    2,
    'ExtensionHostExtension.enableExtension',
    { main: './main.js' }
  )
})
