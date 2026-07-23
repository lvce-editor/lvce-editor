import { beforeEach, expect, jest, test } from '@jest/globals'

const extensionViews = {
  view: {
    css: '/extensions/sample/view.css',
    eventListeners: [
      {
        name: 'handleDragStart',
        params: ['handleViewEvent', 'dragstart', 'event.target.name'],
      },
    ],
    extensionId: 'sample.extension',
    icon: '',
    id: 'sample.views.testing',
    kind: 'virtualDom',
    title: 'Testing',
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockImplementation(async (method) => {
    if (method === 'Extensions.getViewActions') {
      return []
    }
    return {
      dom: [],
      type: 'setDom',
    }
  })
  globalThis.fetch = jest.fn(async () => {
    return {
      ok: true,
      text: async () => '.Testing { color: red; }',
    }
  }) as any
})

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => {
  return {
    getExtensionView: jest.fn(async () => extensionViews.view),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(async (method) => {
      if (method === 'Extensions.getViewActions') {
        return []
      }
      return {
        dom: [],
        type: 'setDom',
      }
    }),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(async () => {}),
  }
})

const ViewletExtensionView = await import('../src/parts/ViewletExtensionView/ViewletExtensionView.ts')
const ViewletExtensionViewRender = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewRender.ts')
const ViewletExtensionViewMenuEntries = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewMenuEntries.ts')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const Command = await import('../src/parts/Command/Command.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

test('render supports functional events', () => {
  expect(ViewletExtensionViewRender.hasFunctionalEvents).toBe(true)
})

test('exports virtual dom event commands', () => {
  expect(ViewletExtensionView.Commands.handleInput).toBe(ViewletExtensionView.handleInput)
  expect(ViewletExtensionView.Commands.handleClick).toBe(ViewletExtensionView.handleClick)
  expect(ViewletExtensionView.Commands.handleClickAction).toBe(ViewletExtensionView.handleClickAction)
  expect(ViewletExtensionView.Commands.handleContextMenu).toBe(ViewletExtensionView.handleContextMenu)
  expect(ViewletExtensionView.Commands.handleViewEvent).toBe(ViewletExtensionView.handleViewEvent)
  expect(ViewletExtensionView.Commands.rerender).toBe(ViewletExtensionView.rerender)
})

test('renderEventListeners includes context menu coordinates', () => {
  expect(ViewletExtensionViewRender.renderEventListeners()).toContainEqual({
    name: 'handleContextMenu',
    params: ['handleContextMenu', 'event.target.name', 'event.clientX', 'event.clientY'],
    preventDefault: true,
  })
})

test('loadContent loads css from extension view metadata', async () => {
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(fetch).toHaveBeenCalledWith('/extensions/sample/view.css')
  expect(newState.css).toBe('.Testing { color: red; }')
  expect(newState.cssId).toBe('ExtensionView:sample.views.testing')
})

test('loadContent stores virtual dom without duplicate commands', async () => {
  const dom = [{ type: 4 }]
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    dom,
    type: 'setDom',
  })
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(newState.commands).toEqual([])
  expect(newState.actionsDom).toEqual([])
  expect(newState.dom).toBe(dom)
  expect(newState.eventListeners).toBe(extensionViews.view.eventListeners)
  expect(newState.focusSelector).toBe('')
  expect(newState.patches).toEqual([])
})

test('loadContent opens a document view with its contributed id and resource uri', async () => {
  const state = ViewletExtensionView.create(1, 'file:///workspace/image.png', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.createViewInstance',
    'sample.views.testing',
    1,
    {
      state: undefined,
      uid: 1,
      uri: 'file:///workspace/image.png',
      viewId: 'sample.views.testing',
    },
    '',
    4,
  )
  expect(newState.uri).toBe('file:///workspace/image.png')
  expect(newState.viewId).toBe('sample.views.testing')
})

test('renderEventListeners includes extension view listeners', () => {
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    eventListeners: extensionViews.view.eventListeners,
  }

  expect(ViewletExtensionViewRender.renderEventListeners(state)).toEqual([
    ...ViewletExtensionViewRender.renderEventListeners(),
    ...extensionViews.view.eventListeners,
  ])
})

test('handleClick stores patches without duplicate commands', async () => {
  const patches = [{ type: 1 }]
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    patches,
    type: 'setPatches',
  })
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    kind: 'virtualDom',
  }

  const newState = await ViewletExtensionView.handleClick(state, 'connect')

  expect(newState.commands).toEqual([])
  expect(newState.patches).toBe(patches)
})

test('handleClick forwards rendered scroll position as a renderer process command', async () => {
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    patches: [],
    scrollPosition: ['.Messages', 9_999_999],
    type: 'setPatches',
  })
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    kind: 'virtualDom',
  }

  const newState = await ViewletExtensionView.handleClick(state, 'connect')

  expect(newState.commands).toEqual([['Viewlet.setProperty', 1, '.Messages', 'scrollTop', 9_999_999]])
})

test('loadContent forwards dynamic css without replacing contributed css', async () => {
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    css: '.Testing { --DetailWidth: 360px; }',
    dom: [],
    type: 'setDom',
  })
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(newState.css).toBe('.Testing { color: red; }')
  expect(newState.cssId).toBe('ExtensionView:sample.views.testing')
  expect(newState.commands).toEqual([['Viewlet.setCss', 1, '.Testing { --DetailWidth: 360px; }']])
})

test('handleClick forwards updated dynamic css', async () => {
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    css: '.Testing { --DetailWidth: 400px; }',
    patches: [],
    type: 'setPatches',
  })
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    kind: 'virtualDom',
  }

  const newState = await ViewletExtensionView.handleClick(state, 'resize')

  expect(newState.commands).toEqual([['Viewlet.setCss', 1, '.Testing { --DetailWidth: 400px; }']])
})

test('loadContent stores rendered sidebar actions', async () => {
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockImplementation(async (method) => {
    if (method === 'Extensions.getViewActions') {
      return [
        {
          command: 'sample.refresh',
          icon: 'Refresh',
          title: 'Refresh',
        },
      ]
    }
    return {
      dom: [],
      type: 'setDom',
    }
  })
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(newState.actionsDom).toEqual([
    {
      childCount: 1,
      className: 'Actions',
      role: 'toolbar',
      type: 4,
    },
    {
      'data-command': 'sample.refresh',
      childCount: 1,
      className: 'IconButton',
      title: 'Refresh',
      type: 1,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconRefresh',
      role: 'none',
      type: 4,
    },
  ])
  expect(ViewletExtensionViewRender.renderActions.apply(state, newState)).toBe(newState.actionsDom)
})

test('handleClick stores focus selector from render result', async () => {
  const patches = [{ type: 1 }]
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    focusSelector: '[name="newCardTitle:list-1"]',
    patches,
    type: 'setPatches',
  })
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    kind: 'virtualDom',
  }

  const newState = await ViewletExtensionView.handleClick(state, 'connect')

  expect(newState.focusSelector).toBe('[name="newCardTitle:list-1"]')
  expect(ViewletExtensionViewRender.render[3].apply(state as any, newState as any)).toEqual([
    ['Viewlet.focusSelector', 1, '[name="newCardTitle:list-1"]'],
  ])
})

test('renderFocus ignores missing, empty, and repeated selectors', () => {
  const oldState = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    focusSelector: '[name="newCardTitle:list-1"]',
    kind: 'virtualDom',
  }
  const resetState = {
    ...oldState,
    focusSelector: '',
  }
  const repeatedState = {
    ...oldState,
  }

  expect(ViewletExtensionViewRender.render[3].isEqual(oldState as any, resetState as any)).toBe(true)
  expect(ViewletExtensionViewRender.render[3].isEqual(oldState as any, repeatedState as any)).toBe(true)
})

test('rerender stores patches without duplicate commands', async () => {
  const patches = [{ type: 1 }]
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    patches,
    type: 'setPatches',
  })
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    commands: [['stale']],
    kind: 'virtualDom',
  }

  const newState = await ViewletExtensionView.rerender(state)

  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.renderViewInstance', 'sample.views.testing', 1, '', 4)
  expect(newState.commands).toEqual([])
  expect(newState.focusSelector).toBe('')
  expect(newState.patches).toBe(patches)
})

test('handleClickAction executes extension command', async () => {
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.handleClickAction(state, 0, 'sample.refresh')

  expect(newState).toBe(state)
  expect(Command.execute).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'sample.refresh')
})

test('rerender ignores iframe views', async () => {
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    kind: 'iframe',
  }

  const newState = await ViewletExtensionView.rerender(state)

  expect(newState).toBe(state)
  expect(ExtensionManagementWorker.invoke).not.toHaveBeenCalled()
})

test('handleContextMenu dispatches coordinates to extension view', async () => {
  const patches = [{ type: 1 }]
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce({
    patches,
    type: 'setPatches',
  })
  const state = {
    ...ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100),
    kind: 'virtualDom',
  }

  await ViewletExtensionView.handleContextMenu(state, 'card:card-1', 10, 20)

  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.dispatchViewEvent',
    'sample.views.testing',
    1,
    {
      name: 'card:card-1',
      type: 'contextmenu',
      x: 10,
      y: 20,
    },
    '',
    4,
  )
})

test('extension view menu entries delegate to extension management worker', async () => {
  // @ts-ignore
  ExtensionManagementWorker.invoke.mockResolvedValueOnce([
    {
      command: 'sample.open',
      flags: 0,
      id: 'open',
      label: 'Open',
    },
  ])
  ViewletStates.set(1, {
    factory: {},
    renderedState: {
      uid: 1,
    },
    state: {
      uid: 1,
      uri: 'sample.views.testing',
    },
  })

  await expect(ViewletExtensionViewMenuEntries.menus[0].getMenuEntries(1, { menuId: 'sample.card' })).resolves.toEqual([
    {
      command: 'sample.open',
      flags: 0,
      id: 'open',
      label: 'Open',
    },
  ])

  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.getViewMenuEntries', 'sample.views.testing', 1, 'sample.card', '', 4)
  ViewletStates.remove(1)
})

test('loadContent ignores css load errors', async () => {
  globalThis.fetch = jest.fn(async () => {
    throw new Error('not found')
  }) as any
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100)

  const newState = await ViewletExtensionView.loadContent(state, undefined)

  expect(newState.css).toBe('')
  expect(newState.cssId).toBe('')
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('Failed to load css for extension view sample.views.testing'))
  warn.mockRestore()
})

test('render emits set css command', () => {
  const oldState = {
    css: '',
    cssId: '',
  }
  const newState = {
    css: '.Testing { color: red; }',
    cssId: 'ExtensionView:sample.views.testing',
  }

  expect(ViewletExtensionViewRender.render[4].apply(oldState as any, newState as any)).toEqual([
    ['Viewlet.setCss', 'ExtensionView:sample.views.testing', '.Testing { color: red; }'],
  ])
})
