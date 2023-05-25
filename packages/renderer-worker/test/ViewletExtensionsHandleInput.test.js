import { jest } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/SearchExtensions/SearchExtensions.js', () => {
  return {
    searchExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagement.js', () => {
  return {
    getAllExtensions: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getMarketPlaceUrl: jest.fn(() => {
      return 'https://example.com'
    }),
    getAssetDir: () => {
      return '/'
    },
    assetDir: '/',
  }
})
jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    handleError: jest.fn(() => {
      throw new Error('not implemented')
    }),
    printError: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const SearchExtensions = await import('../src/parts/SearchExtensions/SearchExtensions.js')
const Ajax = await import('../src/parts/Ajax/Ajax.js')

const ViewletExtensions = await import('../src/parts/ViewletExtensions/ViewletExtensions.js')
const ViewletExtensionsHandleInput = await import('../src/parts/ViewletExtensions/ViewletExtensionsHandleInput.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ExtensionManagement = await import('../src/parts/ExtensionManagement/ExtensionManagement.js')

// TODO test when error handling when `getMarketplaceUrl` fails
test.skip('handleInput', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 519:
        return 'https://example.com'
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return [
      {
        id: 'test-author.test-extension',
        name: 'Test Extension',
      },
    ]
  })
  await ViewletExtensionsHandleInput.handleInput(state, 'test')
  expect(Ajax.getJson).toHaveBeenCalledTimes(1)
  expect(Ajax.getJson).toHaveBeenCalledWith('https://example.com/api/extensions/search', {
    searchParams: {
      q: 'test',
    },
  })
})

test('handleInput - error', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  SearchExtensions.searchExtensions.mockImplementation(() => {
    throw new Error(
      'Failed to load extensions from marketplace: Error: Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found'
    )
  })
  expect(await ViewletExtensionsHandleInput.handleInput(state, 'test')).toMatchObject({
    message:
      'Error: Failed to load extensions from marketplace: Error: Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found',
  })
})

test.skip('handleInput - should encode uri in ajax requests', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  await ViewletExtensionsHandleInput.handleInput(state, 'test?')
  expect(Ajax.getJson).toHaveBeenCalledWith(expect.stringContaining('/api/extensions/search?q=test%3F'))
})

test.skip('handleInput - empty', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  expect(await ViewletExtensionsHandleInput.handleInput(state, '')).toMatchObject({
    items: [],
  })
})

test.skip('handleInput - multiple calls', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.state.getJson = jest.fn(async () => {
    return []
  })
  await Promise.all([ViewletExtensionsHandleInput.handleInput(state, 'test-1'), ViewletExtensionsHandleInput.handleInput(state, 'test-2')])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
})
// test('handleInput')

// TODO handle input -> error on ajax request

test('handleInput - error on ajax request', () => {})
