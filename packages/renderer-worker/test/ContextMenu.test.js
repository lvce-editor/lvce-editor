import { jest } from '@jest/globals'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.js'
import * as Layout from '../src/parts/Layout/Layout.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

beforeEach(() => {
  ContextMenu.state.menus = []
})

test.skip('showItems - top left', async () => {
  RendererProcess.state.send = jest.fn()
  Layout.state.windowWidth = 1024
  Layout.state.windowHeight = 768
  ContextMenu.showItems(0, 0, [
    {
      id: 'copy',
    },
  ])
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.load',
    'ContextMenu',
    0,
    0,
    250,
    48,
    [
      {
        id: 'copy',
      },
    ],
  ])
})

test.skip('showItems - top right', async () => {
  RendererProcess.state.send = jest.fn()
  Layout.state.windowWidth = 1024
  Layout.state.windowHeight = 768
  ContextMenu.showItems(1024, 0, [
    {
      id: 'copy',
    },
  ])
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.load',
    'ContextMenu',
    0,
    774,
    250,
    48,
    [
      {
        id: 'copy',
      },
    ],
  ])
})

test.skip('showItems - bottom right', async () => {
  RendererProcess.state.send = jest.fn()
  Layout.state.windowWidth = 1024
  Layout.state.windowHeight = 768
  ContextMenu.showItems(1024, 768, [
    {
      id: 'copy',
    },
  ])
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.load',
    'ContextMenu',
    720,
    774,
    250,
    48,
    [
      {
        id: 'copy',
      },
    ],
  ])
})

test.skip('showItems - bottom left', async () => {
  RendererProcess.state.send = jest.fn()
  Layout.state.windowWidth = 1024
  Layout.state.windowHeight = 768
  ContextMenu.showItems(0, 768, [
    {
      id: 'copy',
    },
  ])
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    'Viewlet.load',
    'ContextMenu',
    720,
    0,
    250,
    48,
    [
      {
        id: 'copy',
      },
    ],
  ])
})

test.skip('select', async () => {
  RendererProcess.state.send = jest.fn()
  ContextMenu.state.items = [
    {
      id: 'copy',
    },
  ]
  await ContextMenu.select(0)
})

test.skip('select - no index', async () => {
  RendererProcess.state.send = jest.fn()
  ContextMenu.state.items = [
    {
      id: 'copy',
    },
  ]
  await ContextMenu.select(-1)
})

test.skip('selectCurrent', async () => {
  RendererProcess.state.send = jest.fn()
  ContextMenu.state.items = [
    {
      id: 'copy',
    },
  ]
  ContextMenu.state.focusedIndex = 0
  await ContextMenu.selectCurrent()
})

test.skip('hide', () => {
  RendererProcess.state.send = jest.fn()
  ContextMenu.hide()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([3026, 'ContextMenu'])
})

test.skip('focusFirst', () => {
  ContextMenu.state.menus = [
    {
      focusedIndex: -1,
      items: [
        {
          id: 'item 1',
          label: 'Item 1',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 2',
          label: 'Item 2',
          flags: /* None */ 0,
          command: 0,
        },
      ],
    },
  ]
  RendererProcess.state.send = jest.fn()
  ContextMenu.focusFirst()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'ContextMenu',
    /* method */ 'focusIndex',
    -1,
    0,
  ])
})

test.skip('focusLast', () => {
  ContextMenu.state.menus = [
    {
      focusedIndex: -1,
      items: [
        {
          id: 'item 1',
          label: 'Item 1',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 2',
          label: 'Item 2',
          flags: /* None */ 0,
          command: 0,
        },
      ],
    },
  ]
  ContextMenu.focusLast()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'ContextMenu',
    /* method */ 'focusIndex',
    -1,
    1,
  ])
})

test.skip('focusPrevious', () => {
  ContextMenu.state.menus = [
    {
      focusedIndex: 2,
      items: [
        {
          id: 'item 1',
          label: 'Item 1',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 2',
          label: 'Item 2',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 3',
          label: 'Item 3',
          flags: /* None */ 0,
          command: 0,
        },
      ],
    },
  ]
  RendererProcess.state.send = jest.fn()
  ContextMenu.focusPrevious()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'ContextMenu',
    /* method */ 'focusIndex',
    2,
    1,
  ])
})

test.skip('focusPrevious - no focus', () => {
  ContextMenu.state.menus = [
    {
      focusedIndex: -1,
      items: [
        {
          id: 'item 1',
          label: 'Item 1',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 2',
          label: 'Item 2',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 3',
          label: 'Item 3',
          flags: /* None */ 0,
          command: 0,
        },
      ],
    },
  ]
  RendererProcess.state.send = jest.fn()
  ContextMenu.focusPrevious()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'ContextMenu',
    /* method */ 'focusIndex',
    -1,
    2,
  ])
})

test.skip('focusPrevious - at start', () => {
  ContextMenu.state.menus = [
    {
      focusedIndex: 0,
      items: [
        {
          id: 'item 1',
          label: 'Item 1',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 2',
          label: 'Item 2',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 3',
          label: 'Item 3',
          flags: /* None */ 0,
          command: 0,
        },
      ],
    },
  ]
  RendererProcess.state.send = jest.fn()
  ContextMenu.focusPrevious()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'ContextMenu',
    /* method */ 'focusIndex',
    0,
    2,
  ])
})

test.skip('focusPrevious - with separator', () => {
  ContextMenu.state.menus = [
    {
      focusedIndex: 3,
      items: [
        {
          id: 'item 1',
          label: 'Item 1',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: 'item 2',
          label: 'Item 2',
          flags: /* None */ 0,
          command: 0,
        },
        {
          id: '',
          label: '',
          flags: /* Separator */ 1,
          command: 0,
        },
        {
          id: 'item 3',
          label: 'Item 3',
          flags: /* None */ 0,
          command: 0,
        },
      ],
    },
  ]
  RendererProcess.state.send = jest.fn()
  ContextMenu.focusPrevious()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([
    /* Viewlet.send */ 'Viewlet.send',
    /* id */ 'ContextMenu',
    /* method */ 'focusIndex',
    3,
    1,
  ])
})

test.skip('focusNext', () => {
  RendererProcess.state.send = jest.fn()
  ContextMenu.showItems(0, 0, [
    {
      label: 'item 1',
      flags: 0,
    },
    {
      label: 'item 2',
      flags: 0,
    },
    {
      label: '__Separator',
      flags: 1,
    },
    {
      label: 'item 3',
      flags: 0,
    },
  ])
  ContextMenu.focusNext()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([663, 0])
  ContextMenu.focusNext()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([663, 1])
  ContextMenu.focusNext()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([663, 3])
  ContextMenu.focusNext()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith([663, 0])
})
