import { beforeEach, expect, jest, test } from '@jest/globals'

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

const ViewletExtensions = await import('../src/parts/ViewletExtensions/ViewletExtensions.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

const ExtensionManagement = await import('../src/parts/ExtensionManagement/ExtensionManagement.js')

test.skip('create', () => {
  const state = ViewletExtensions.create()
  expect(state).toBeDefined()
})

// TODO test refreshing and one extension has invalid shape (e.g. null or array where object is expected)

test.skip('loadContent - error - ReferenceError', async () => {
  // @ts-ignore
  SearchExtensions.searchExtensions.mockImplementation(() => {
    throw new Error("VError: Failed to search for extensions: ReferenceError: Cannot access 'extensions' before initialization")
  })
  const state = {
    ...ViewletExtensions.create(),
    width: 200,
    height: 200,
  }
  expect(await ViewletExtensions.loadContent(state)).toMatchObject({
    message: "Error: VError: Failed to search for extensions: ReferenceError: Cannot access 'extensions' before initialization",
  })
})

test.skip('loadContent', async () => {
  const state = {
    ...ViewletExtensions.create(),
    width: 200,
    height: 200,
    maxLineY: 10,
    itemHeight: 62,
    top: 0,
  }
  // @ts-ignore
  SearchExtensions.searchExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        description: 'Provides syntax highlighting and bracket matching in HTML files.',
        icon: '//icons/language-icon.svg',
      },
      {
        name: 'test extension 2',
        publisher: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher-2.test-extension',
      },
    ]
  })
  // @ts-ignore
  ExtensionManagement.getAllExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        description: 'Provides syntax highlighting and bracket matching in HTML files.',
        languages: [
          {
            id: 'html',
            extensions: ['.html'],
            tokenize: 'src/tokenizeHtml.js',
            configuration: './languageConfiguration.json',
          },
        ],
      },
      {
        id: 'test-author-2.test-extension',
        publisher: 'test-author-2',
        description: 'Test Extension',
        name: 'test-extension',
        version: '0.0.1',
        main: 'main.js',
        path: '/tmp/extensions/test-author-2.test-extension',
      },
    ]
  })
  const newState = await ViewletExtensions.loadContent(state)
  expect(newState.allExtensions).toEqual([
    {
      description: 'Provides syntax highlighting and bracket matching in HTML files.',
      id: 'builtin.language-basics-html',

      languages: [
        {
          configuration: './languageConfiguration.json',
          extensions: ['.html'],
          id: 'html',
          tokenize: 'src/tokenizeHtml.js',
        },
      ],
      name: 'Language Basics HTML',
    },
    {
      description: 'Test Extension',
      id: 'test-author-2.test-extension',
      main: 'main.js',
      name: 'test-extension',
      path: '/tmp/extensions/test-author-2.test-extension',
      publisher: 'test-author-2',
      version: '0.0.1',
    },
  ])
  expect(newState.items).toEqual([
    {
      description: 'Provides syntax highlighting and bracket matching in HTML files.',
      icon: '//icons/language-icon.svg',
      id: 'builtin.language-basics-html',
      name: 'Language Basics HTML',
    },
    {
      id: 'test-publisher-2.test-extension',
      name: 'test extension 2',
      publisher: 'test publisher 2',
      version: '0.0.1',
    },
  ])
  expect(newState.minLineY).toBe(0)
  expect(newState.maxLineY).toBe(2)
  expect(newState.finalDeltaY).toBe(0)
})

test.skip('loadContent - with scrollbar', async () => {
  const state = {
    ...ViewletExtensions.create(),
    width: 200,
    height: 62 + 35,
    maxLineY: 10,
    itemHeight: 62,
    top: 0,
  }
  // @ts-ignore
  SearchExtensions.searchExtensions.mockImplementation(() => {
    return [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher-2.test-extension',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher-2.test-extension',
      },
    ]
  })
  // @ts-ignore
  ExtensionManagement.getAllExtensions.mockImplementation(() => {
    return [
      {
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        description: 'Provides syntax highlighting and bracket matching in HTML files.',
        languages: [
          {
            id: 'html',
            extensions: ['.html'],
            tokenize: 'src/tokenizeHtml.js',
            configuration: './languageConfiguration.json',
          },
        ],
      },
      {
        id: 'test-author-2.test-extension',
        publisher: 'test-author-2',
        description: 'Test Extension',
        name: 'test-extension',
        version: '0.0.1',
        main: 'main.js',
        path: '/tmp/extensions/test-author-2.test-extension',
      },
    ]
  })
  const newState = await ViewletExtensions.loadContent(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.minLineY).toBe(0)
  expect(newState.maxLineY).toBe(2)
  expect(newState.finalDeltaY).toBe(68)
})

test.skip('install', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.install':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExtensions.handleInstall(state, 'test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionManagement.install', 'test-author.test-extension')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'setExtensionState', 'test-author.test-extension', 'installing')
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'installed',
  )
  expect(ErrorHandling.handleError).not.toHaveBeenCalled()
})

test.skip('install - error', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.install':
        throw new Error('Test Error 2')
      default:
        throw new Error('unexpected message')
    }
  })
  console.error = jest.fn()
  await ViewletExtensions.handleInstall(state, 'test-author.test-extension')
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'uninstalled',
  )
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(new Error('Test Error 2'))
})

test.skip('uninstall', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.uninstall':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExtensions.handleUninstall(state, 'test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionManagement.uninstall', 'test-author.test-extension')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'setExtensionState', 'test-author.test-extension', 'uninstalling')
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'uninstalled',
  )
})

test.skip('uninstall - error', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.uninstall':
        throw new Error('Test Error 1')
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExtensions.handleUninstall(state, 'test-author.test-extension')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'setExtensionState', 'test-author.test-extension', 'installed')
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(new Error('Test Error 1'))
})

test.skip('enable', async () => {
  // TODO there can only be one viewlet -> use object instead of factory function (maybe)
  const state = ViewletExtensions.create()
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.enable':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExtensions.handleEnable(state, 'test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionManagement.enable', 'test-author.test-extension')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'setExtensionState', 'test-author.test-extension', 'enabled')
  // SharedProcess.state.receive({
  //   jsonrpc: '2.0',
  //   id: ,
  // })
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('Viewlet.send', 'Extensions', 'setExtensionState', 'test-author.test-extension', 'enabled')
  expect(ErrorHandling.handleError).not.toHaveBeenCalled()
})

test.skip('enable - error', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.enable':
        throw new Error('Test Error 3')
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExtensions.handleEnable(state, 'test-author.test-extension')
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionManagement.enable', 'test-author.test-extension')
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'setExtensionState', 'test-author.test-extension', 'disabled')
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(new Error('Test Error 3'))
})

// TODO handle input -> builtin Extensions
// handle input -> color themes
// handle input -> icon themes
// handle input -> disabled extensions
// handle input -> enabled extensions
// handle input -> category filter

test.skip('openSuggest', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.openSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'openSuggest', [
    '@builtin',
    '@disabled',
    '@enabled',
    '@installed',
    '@outdated',
    '@sort:installs',
    '@id:',
    '@category',
  ])
})

test.skip('closeSuggest', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.closeSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'closeSuggest')
})

test.skip('toggleSuggest', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.toggleSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'openSuggest', [
    '@builtin',
    '@disabled',
    '@enabled',
    '@installed',
    '@outdated',
    '@sort:installs',
    '@id:',
    '@category',
  ])
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.toggleSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 'Extensions', 'closeSuggest')
})

// TODO test cors error

// localhost/:1 Access to fetch at 'http://localhost:39367/api/extensions/search?q=te' from origin 'http://localhost:35291' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

test.skip('saveState', () => {
  const state = {
    ...ViewletExtensions.create(),
    searchValue: 'test',
    items: [],
    height: 124,
    deltaY: 62,
    focusedIndex: 0,
  }
  expect(ViewletExtensions.saveState(state)).toEqual({
    searchValue: 'test',
  })
})

// test.skip('scrollBarThumbMouseDown', () => {
//   const oldState = {
//     ...ViewletExtensions.create(),
//     items: [
//       {
//         name: 'test extension 1',
//         authorId: 'test publisher 1',
//         version: '0.0.1',
//         id: 'test-publisher.test-extension-1',
//       },
//       {
//         name: 'test extension 2',
//         authorId: 'test publisher 2',
//         version: '0.0.1',
//         id: 'test-publisher.test-extension-2',
//       },
//       {
//         name: 'test extension 3',
//         authorId: 'test publisher 3',
//         version: '0.0.1',
//         id: 'test-publisher.test-extension-3',
//       },
//     ],
//     height: 124,
//     deltaY: 62,
//     focusedIndex: 0,
//   }
//   const newState = {
//     ...oldState,
//     focusedIndex: 1,
//   }
//   expect(render(oldState, newState)).toEqual([
//     ['Viewlet.send', 'Extensions', 'setFocusedIndex', 0, 1],
//   ])
// })
