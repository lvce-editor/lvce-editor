import { jest } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

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

const ViewletTitleBarMenuBar = await import(
  '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'
)

test('openMenu - when no focusedIndex', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: -1,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  expect(
    await ViewletTitleBarMenu.openMenu(state, /* focus */ false)
  ).toMatchObject({
    isMenuOpen: false,
  })
})

test('openMenu - when focusedIndex', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      left: 168,
      bottom: 0,
    }
  })
  expect(
    await ViewletTitleBarMenuBar.openMenu(state, /* focus */ true)
  ).toMatchObject({
    menus: [
      {
        level: 0,
        x: 160,
        y: 0,
        items: [
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'newFile',
            label: 'New File',
          },
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'newWindow',
            label: 'New Window',
          },
          {
            command: 0,
            flags: MenuItemFlags.Separator,
            id: 'separator',
            label: 'Separator',
          },
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'openFile',
            label: 'Open File',
          },
          {
            command: 1492,
            flags: MenuItemFlags.None,
            id: 'openFolder',
            label: 'Open Folder',
          },
          {
            command: 0,
            flags: MenuItemFlags.SubMenu,
            id: 'openRecent',
            label: 'Open Recent',
          },
        ],
      },
    ],
  })
})

test("closeMenu - don't keep focus", () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
    focusedIndex: 0,
  }
  expect(
    ViewletTitleBarMenuBar.closeMenu(state, /* keepFocus */ false)
  ).toMatchObject({
    isMenuOpen: false,
  })
})

test('closeMenu - keep focus', () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
    focusedIndex: 0,
  }
  expect(
    ViewletTitleBarMenuBar.closeMenu(state, /* keepFocus */ true)
  ).toMatchObject({
    isMenuOpen: false,
    focusedIndex: 0,
  })
})

test('focusIndex - when open - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      [
        {
          id: 'file',
          name: 'File',
        },
        {
          id: 'edit',
          name: 'Edit',
        },
      ],
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      left: 168,
      bottom: 0,
    }
  })
  expect(await ViewletTitleBarMenuBar.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    menus: [
      {
        level: 0,
        items: [
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'newFile',
            label: 'New File',
          },
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'newWindow',
            label: 'New Window',
          },
        ],
      },
    ],
  })
})

test('focusIndex - when opening different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'undo',
            label: 'Undo',
          },
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'redo',
            label: 'Redo',
          },
        ],
      },
    ],
  })
})

test.skip('focusIndex - when open - race condition', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      left: 168,
      bottom: 0,
    }
  })
  expect(await ViewletTitleBarMenuBar.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'undo',
            label: 'Undo',
          },
          {
            command: -1,
            flags: MenuItemFlags.Disabled,
            id: 'redo',
            label: 'Redo',
          },
        ],
      },
    ],
  })
})

test('focusIndex - when closed - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  expect(await ViewletTitleBarMenuBar.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusIndex - when closed - when different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  expect(await ViewletTitleBarMenuBar.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focus', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 42,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focus(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 1,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
      {
        id: 'selection',
        name: 'Selection',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
      {
        id: 'selection',
        name: 'Selection',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focusPrevious()).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusNext', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
      {
        id: 'selection',
        name: 'Selection',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test.skip('focusNext - with disabled items', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
        flags: MenuItemFlags.None,
      },
      {
        id: 'edit',
        name: 'Edit',
        flags: MenuItemFlags.None,
      },
      {
        id: 'selection',
        name: 'Selection',
        flags: MenuItemFlags.None,
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - at end', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 2,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
      {
        id: 'selection',
        name: 'Selection',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('toggleIndex - when open - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    isMenuOpen: false,
  })
})

test.skip('toggleIndex - when open - when different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: true,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }

  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        level: 0,
        items: [
          {
            flags: MenuItemFlags.None,
            id: 'cut',
            label: 'Cut',
          },
          {
            flags: MenuItemFlags.None,
            id: 'copy',
            label: 'Copy',
          },
          {
            flags: MenuItemFlags.None,
            id: 'paste',
            label: 'Paste',
          },
        ],
      },
    ],
  })
})

test.skip('toggleIndex - when closed - when same index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(0)).toMatchObject({
    focusedIndex: 0,
    menus: [
      [
        {
          flags: MenuItemFlags.None,
          id: 'newFile',
          label: 'New File',
        },
        {
          flags: MenuItemFlags.None,
          id: 'newWindow',
          label: 'New Window',
        },
      ],
    ],
  })
})

test.skip('toggleIndex - when closed - when different index', async () => {
  const state = {
    ...ViewletTitleBarMenuBar.create(),
    focusedIndex: 0,
    isMenuOpen: false,
    titleBarEntries: [
      {
        id: 'file',
        name: 'File',
      },
      {
        id: 'edit',
        name: 'Edit',
      },
    ],
  }
  expect(await ViewletTitleBarMenuBar.toggleIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    menus: [
      {
        flags: MenuItemFlags.None,
        id: 'cut',
        label: 'Cut',
      },
      {
        flags: MenuItemFlags.None,
        id: 'copy',
        label: 'Copy',
      },
      {
        flags: MenuItemFlags.None,
        id: 'paste',
        label: 'Paste',
      },
    ],
  })
})
