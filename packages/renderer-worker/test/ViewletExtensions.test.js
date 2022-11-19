import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
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
jest.unstable_mockModule(
  '../src/parts/SearchExtensions/SearchExtensions.js',
  () => {
    return {
      searchExtensions: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/ExtensionManagement/ExtensionManagement.js',
  () => {
    return {
      getAllExtensions: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getMarketPlaceUrl: jest.fn(() => {
      return 'https://example.com'
    }),
    getAssetDir: () => {
      return '/'
    },
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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const SearchExtensions = await import(
  '../src/parts/SearchExtensions/SearchExtensions.js'
)
const Ajax = await import('../src/parts/Ajax/Ajax.js')

const ViewletExtensions = await import(
  '../src/parts/ViewletExtensions/ViewletExtensions.js'
)
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)
const ExtensionManagement = await import(
  '../src/parts/ExtensionManagement/ExtensionManagement.js'
)

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletExtensions, oldState, newState)
}

test('create', () => {
  const state = ViewletExtensions.create()
  expect(state).toBeDefined()
})

// TODO test refreshing and one extension has invalid shape (e.g. null or array where object is expected)

test('loadContent - error - ReferenceError', async () => {
  // @ts-ignore
  SearchExtensions.searchExtensions.mockImplementation(() => {
    throw new Error(
      "VError: Failed to search for extensions: ReferenceError: Cannot access 'extensions' before initialization"
    )
  })
  const state = {
    ...ViewletExtensions.create(),
    width: 200,
    height: 200,
  }
  await expect(ViewletExtensions.loadContent(state)).rejects.toThrowError(
    new Error(
      "VError: Failed to search for extensions: ReferenceError: Cannot access 'extensions' before initialization"
    )
  )
})

test('loadContent', async () => {
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
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
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
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
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
      description:
        'Provides syntax highlighting and bracket matching in HTML files.',
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
      description:
        'Provides syntax highlighting and bracket matching in HTML files.',
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

test('loadContent - with scrollbar', async () => {
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
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
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
  expect(newState.maxLineY).toBe(1)
  expect(newState.finalDeltaY).toBe(62)
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
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.install',
    'test-author.test-extension'
  )
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'installing'
  )
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'installed'
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
    'uninstalled'
  )
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error('Test Error 2')
  )
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
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.uninstall',
    'test-author.test-extension'
  )
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'uninstalling'
  )
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'uninstalled'
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'installed'
  )
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error('Test Error 1')
  )
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
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.enable',
    'test-author.test-extension'
  )
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'enabled'
  )
  // SharedProcess.state.receive({
  //   jsonrpc: '2.0',
  //   id: ,
  // })
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'enabled'
  )
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
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ExtensionManagement.enable',
    'test-author.test-extension'
  )
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'setExtensionState',
    'test-author.test-extension',
    'disabled'
  )
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error('Test Error 3')
  )
})

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
  await ViewletExtensions.handleInput(state, 'test')
  expect(Ajax.getJson).toHaveBeenCalledTimes(1)
  expect(Ajax.getJson).toHaveBeenCalledWith(
    'https://example.com/api/extensions/search',
    {
      searchParams: {
        q: 'test',
      },
    }
  )
})

test('handleInput - error', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  SearchExtensions.searchExtensions.mockImplementation(() => {
    throw new Error(
      'Failed to load extensions from marketplace: Error: Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found'
    )
  })
  expect(await ViewletExtensions.handleInput(state, 'test')).toMatchObject({
    error:
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
  await ViewletExtensions.handleInput(state, 'test?')
  expect(Ajax.getJson).toHaveBeenCalledWith(
    expect.stringContaining('/api/extensions/search?q=test%3F')
  )
})

test.skip('handleInput - empty', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  expect(await ViewletExtensions.handleInput(state, '')).toMatchObject({
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
  await Promise.all([
    ViewletExtensions.handleInput(state, 'test-1'),
    ViewletExtensions.handleInput(state, 'test-2'),
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
})
// test('handleInput')

// TODO handle input -> error on ajax request

test('handleInput - error on ajax request', () => {})

// TODO handle input -> builtin Extensions
// handle input -> color themes
// handle input -> icon themes
// handle input -> disabled extensions
// handle input -> enabled extensions
// handle input -> category filter

test('openSuggest', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.openSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'openSuggest',
    [
      '@builtin',
      '@disabled',
      '@enabled',
      '@installed',
      '@outdated',
      '@sort:installs',
      '@id:',
      '@category',
    ]
  )
})

test('closeSuggest', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.closeSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'closeSuggest'
  )
})

test.skip('toggleSuggest', async () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.toggleSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'openSuggest',
    [
      '@builtin',
      '@disabled',
      '@enabled',
      '@installed',
      '@outdated',
      '@sort:installs',
      '@id:',
      '@category',
    ]
  )
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExtensions.toggleSuggest(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Extensions',
    'closeSuggest'
  )
})

// TODO test cors error

// localhost/:1 Access to fetch at 'http://localhost:39367/api/extensions/search?q=te' from origin 'http://localhost:35291' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

test('resize', () => {
  const state = {
    ...ViewletExtensions.create(),
    itemHeight: 62,
  }
  const newState = ViewletExtensions.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    items: [],
    focusedIndex: -1,
    height: 200,
    left: 200,
    minLineY: 0,
    maxLineY: 3,
    deltaY: 0,
    searchValue: '',
    suggestionState: 0,
    top: 200,
    width: 200,
  })
})

test('render - same state', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    height: 124,
    deltaY: 62,
  }
  const newState = oldState
  expect(render(oldState, newState)).toEqual([])
})

test('render - filtered extensions are different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
    ],
    height: 124,
    deltaY: 62,
    maxLineY: 1,
  }
  const newState = {
    ...oldState,
    items: [
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
    ],
  }
  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'Extensions',
      'setExtensions',
      [
        {
          authorId: 'test publisher 2',
          id: 'test-publisher.test-extension-2',
          name: 'test extension 2',
          version: '0.0.1',
          posInSet: 1,
          setSize: 1,
          top: 0,
        },
      ],
    ],
  ])
})

test.skip('render - negative margin is different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
    ],
    height: 124,
    deltaY: 62,
    finalDeltaY: 0,
  }
  const newState = {
    ...oldState,
    deltaY: 10,
  }
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Extensions', 'setNegativeMargin', -10],
  ])
})

test('render - focused index is different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    items: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
      {
        name: 'test extension 2',
        authorId: 'test publisher 2',
        version: '0.0.1',
        id: 'test-publisher.test-extension-2',
      },
      {
        name: 'test extension 3',
        authorId: 'test publisher 3',
        version: '0.0.1',
        id: 'test-publisher.test-extension-3',
      },
    ],
    height: 124,
    deltaY: 62,
    focusedIndex: 0,
  }
  const newState = {
    ...oldState,
    focusedIndex: 1,
  }
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Extensions', 'setFocusedIndex', 0, 1, false],
  ])
})

// test('scrollBarThumbMouseDown', () => {
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
