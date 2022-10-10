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
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
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

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletExtensions, oldState, newState)
}

test('name', () => {
  expect(ViewletExtensions.name).toBe('Extensions')
})

test('create', () => {
  const state = ViewletExtensions.create()
  expect(state).toBeDefined()
})

// TODO test refreshing and one extension has invalid shape (e.g. null or array where object is expected)

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
  Ajax.getJson.mockImplementation(() => {
    return [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension',
      },
    ]
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionManagement.getAllExtensions':
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
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExtensions.loadContent(state)).toMatchObject({
    extensions: [
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
    ],
    filteredExtensions: [
      {
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
        icon: '//icons/language-icon.svg',
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        publisher: 'builtin',
        state: 'installed',
        version: 'n/a',
        posInSet: 1,
        setSize: 2,
        top: 0,
      },
      {
        description: 'Test Extension',
        icon: '//icons/extensionDefaultIcon.png',
        id: 'test-author-2.test-extension',
        name: 'test-extension',
        publisher: 'test-author-2',
        state: 'installed',
        version: '0.0.1',
        posInSet: 2,
        setSize: 2,
        top: 62,
      },
    ],

    disposed: false,
    parsedValue: {
      isLocal: true,
      query: '',
    },
    searchValue: '',
    suggestionState: 0,
    focusedIndex: -1,
    width: 200,
    height: 200,
    maxLineY: 3,
    minLineY: 0,
    deltaY: 0,
    negativeMargin: 0,
  })
})

// TODO sanitization is now in loadContent
test.skip('contentLoaded', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletExtensions.create(),
    height: 200,
    maxLineY: 10,
    filteredExtensions: [
      {
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
        // languages: [
        //   {
        //     id: 'html',
        //     extensions: ['.html'],
        //     tokenize: 'src/tokenizeHtml.js',
        //     configuration: './languageConfiguration.json',
        //   },
        // ],
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
    ],
  }
  await ViewletExtensions.contentLoaded(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    'Viewlet.send',
    'Extensions',
    'setExtensions',
    [
      {
        description:
          'Provides syntax highlighting and bracket matching in HTML files.',
        id: 'builtin.language-basics-html',
        name: 'Language Basics HTML',
        publisher: 'builtin',
        state: 'installed',
        version: 'n/a',
        icon: '',
      },
      {
        id: 'test-author-2.test-extension',
        name: 'test-extension',
        description: 'Test Extension',
        publisher: 'test-author-2',
        state: 'installed',
        version: '0.0.1',
        icon: '',
      },
    ],
  ])
})

// TODO sanitization is now in loadContent
test.skip('contentLoaded - error - extension is null', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [null],
    maxLineY: 2,
  }
  await ViewletExtensions.contentLoaded(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    'Viewlet.send',
    'Extensions',
    'setExtensions',
    [
      {
        description: 'n/a',
        id: 'n/a',
        name: 'n/a',
        publisher: 'n/a',
        state: 'installed',
        version: 'n/a',
        icon: '',
      },
    ],
  ])
})

// TODO sanitization is now in loadContent
test.skip('contentLoaded - error - extension is of type array', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [[]],
    height: 200,
    maxLineY: 1,
  }
  await ViewletExtensions.contentLoaded(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    'Viewlet.send',
    'Extensions',
    'setExtensions',
    [
      {
        description: 'n/a',
        id: 'n/a',
        name: 'n/a',
        publisher: 'n/a',
        state: 'installed',
        version: 'n/a',
        icon: '',
      },
    ],
  ])
})

test('install', async () => {
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

test('install - error', async () => {
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

test('uninstall', async () => {
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

test('uninstall - error', async () => {
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

test('enable', async () => {
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

test('enable - error', async () => {
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
  RendererProcess.invoke.mockImplementation(() => {})
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
    throw new Error(
      'Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found'
    )
  })
  expect(await ViewletExtensions.handleInput(state, 'test')).toMatchObject({
    error:
      'Failed to load extensions from marketplace: Error: Failed to request json from "https://example.com/api/extensions/search": HTTPError: Request failed with status code 404 Not Found',
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
    filteredExtensions: [],
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
  const state = ViewletExtensions.create()
  const newState = ViewletExtensions.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  // TODO
  expect(newState).toMatchObject({
    disposed: false,
    extensions: [],
    filteredExtensions: [],
    focusedIndex: -1,
    height: 200,
    left: 200,
    minLineY: 0,
    maxLineY: 3,
    deltaY: 0,
    parsedValue: {
      isLocal: true,
      query: '',
    },
    searchValue: '',
    suggestionState: 0,
    top: 200,
    width: 200,
    negativeMargin: 0,
  })
})

test('handleWheel - scroll down', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
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
    deltaY: 0,
  }
  expect(ViewletExtensions.handleWheel(state, 62)).toMatchObject({
    minLineY: 1,
    deltaY: 62,
  })
})

test('handleWheel - scroll up', () => {
  const state = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
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
  expect(ViewletExtensions.handleWheel(state, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})

test('render - same state', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
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
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
    ],
    height: 124,
    deltaY: 62,
    maxLineY: 10,
  }
  const newState = {
    ...oldState,
    filteredExtensions: [
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
        },
      ],
    ],
  ])
})

test('render - negative margin is different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
      {
        name: 'test extension 1',
        authorId: 'test publisher 1',
        version: '0.0.1',
        id: 'test-publisher.test-extension-1',
      },
    ],
    height: 124,
    deltaY: 62,
  }
  const newState = {
    ...oldState,
    negativeMargin: -10,
  }
  expect(render(oldState, newState)).toEqual([
    ['Viewlet.send', 'Extensions', 'setNegativeMargin', -10],
  ])
})

test('render - focused index is different', () => {
  const oldState = {
    ...ViewletExtensions.create(),
    filteredExtensions: [
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
    ['Viewlet.send', 'Extensions', 'setFocusedIndex', 0, 1],
  ])
})

// test('scrollBarThumbMouseDown', () => {
//   const oldState = {
//     ...ViewletExtensions.create(),
//     filteredExtensions: [
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
