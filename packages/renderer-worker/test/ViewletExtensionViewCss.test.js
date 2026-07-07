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
  globalThis.fetch = /** @type {any} */ (
    jest.fn(async () => {
      return {
        ok: true,
        text: async () => '.Testing { color: red; }',
      }
    })
  )
})

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => {
  return {
    getExtensionView: jest.fn(async () => extensionViews.view),
  }
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(async () => {
      return {
        dom: [],
        type: 'setDom',
      }
    }),
  }
})

const ViewletExtensionView = await import('../src/parts/ViewletExtensionView/ViewletExtensionView.ts')
const ViewletExtensionViewRender = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewRender.ts')
const ViewletExtensionViewMenuEntries = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewMenuEntries.ts')
const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

test('render supports functional events', () => {
  expect(ViewletExtensionViewRender.hasFunctionalEvents).toBe(true)
})

test('exports virtual dom event commands', () => {
  expect(ViewletExtensionView.Commands.handleInput).toBe(ViewletExtensionView.handleInput)
  expect(ViewletExtensionView.Commands.handleClick).toBe(ViewletExtensionView.handleClick)
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
  expect(newState.dom).toBe(dom)
  expect(newState.eventListeners).toBe(extensionViews.view.eventListeners)
  expect(newState.patches).toEqual([])
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
  expect(newState.patches).toBe(patches)
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
  globalThis.fetch = /** @type {any} */ (
    jest.fn(async () => {
      throw new Error('not found')
    })
  )
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

  expect(ViewletExtensionViewRender.render[3].apply(/** @type {any} */ (oldState), /** @type {any} */ (newState))).toEqual([
    ['Viewlet.setCss', 'ExtensionView:sample.views.testing', '.Testing { color: red; }'],
  ])
})
