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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const TitleBarMenu = await import(
  '../src/parts/TitleBarMenuBar/TitleBarMenuBar.js'
)

test('openMenu - when no focusedIndex', async () => {
  TitleBarMenu.state.focusedIndex = -1
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.openMenu(/* focus */ false)
  expect(TitleBarMenu.state.isMenuOpen).toBe(false)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test.skip('openMenu - when focusedIndex', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      left: 168,
      bottom: 0,
    }
  })
  await TitleBarMenu.openMenu(/* focus */ true)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    1372,
    0,
    0,
    0,
    [
      {
        command: -1,
        flags: 5,
        id: 'newFile',
        label: 'New File',
      },
      {
        command: -1,
        flags: 5,
        id: 'newWindow',
        label: 'New Window',
      },
      {
        command: 0,
        flags: 1,
        id: 'separator',
        label: 'Separator',
      },
      {
        command: -1,
        flags: 5,
        id: 'openFile',
        label: 'Open File',
      },
      {
        command: 1492,
        flags: 0,
        id: 'openFolder',
        label: 'Open Folder',
      },
      {
        command: 0,
        flags: 4,
        id: 'openRecent',
        label: 'Open Recent',
      },
    ],
    4,
    true,
    168,
    0,
    250,
    166,
  ])
})

test("closeMenu - don't keep focus", () => {
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  TitleBarMenu.state.focusedIndex = 0
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  TitleBarMenu.closeMenu(/* keepFocus */ false)
  expect(TitleBarMenu.state.isMenuOpen).toBe(false)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'TitleBar',
    'menuClose',
    0,
    -1
  )
})

test('closeMenu - keep focus', () => {
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.closeMenu(/* keepFocus */ true)
  expect(TitleBarMenu.state.isMenuOpen).toBe(false)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'TitleBar',
    'menuClose',
    0,
    0
  )
})

test.skip('focusIndex - when open - when same index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = true
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      left: 168,
      bottom: 0,
    }
  })
  await TitleBarMenu.focusIndex(0)
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    1374,
    0,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, [
    1372,
    0,
    0,
    0,
    [
      {
        command: -1,
        flags: 5,
        id: 'newFile',
        label: 'New File',
      },
      {
        command: -1,
        flags: 5,
        id: 'newWindow',
        label: 'New Window',
      },
      {
        command: 0,
        flags: 1,
        id: 'separator',
        label: 'Separator',
      },
      {
        command: -1,
        flags: 5,
        id: 'openFile',
        label: 'Open File',
      },
      {
        command: 1492,
        flags: 0,
        id: 'openFolder',
        label: 'Open Folder',
      },
      {
        command: 0,
        flags: 4,
        id: 'openRecent',
        label: 'Open Recent',
      },
    ],
    -1,
    false,
    168,
    0,
    250,
    166,
  ])
})

test.skip('focusIndex - when open - when different index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = true
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusIndex(1)
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    1374,
    1,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, [
    1372,
    0,
    1,
    0,
    [
      {
        command: -1,
        flags: 5,
        id: 'undo',
        label: 'Undo',
      },
      {
        command: -1,
        flags: 5,
        id: 'redo',
        label: 'Redo',
      },
      {
        command: -1,
        flags: 1,
        id: 'separator',
        label: '',
      },
      {
        command: 364,
        flags: 0,
        id: 'cut',
        label: 'Cut',
      },
      {
        command: 365,
        flags: 0,
        id: 'copy',
        label: 'Copy',
      },
      {
        command: 383,
        flags: 0,
        id: 'paste',
        label: 'Paste',
      },
    ],
    -1,
    false,
    168,
    0,
    250,
    166,
  ])
})

test.skip('focusIndex - when open - race condition', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = true
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      left: 168,
      bottom: 0,
    }
  })
  await TitleBarMenu.focusIndex(1)
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    1374,
    1,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, [
    1372,
    0,
    1,
    0,
    [
      {
        command: -1,
        flags: 5,
        id: 'undo',
        label: 'Undo',
      },
      {
        command: -1,
        flags: 5,
        id: 'redo',
        label: 'Redo',
      },
      {
        command: -1,
        flags: 1,
        id: 'separator',
        label: '',
      },
      {
        command: 364,
        flags: 0,
        id: 'cut',
        label: 'Cut',
      },
      {
        command: 365,
        flags: 0,
        id: 'copy',
        label: 'Copy',
      },
      {
        command: 383,
        flags: 0,
        id: 'paste',
        label: 'Paste',
      },
    ],
    -1,
    false,
    168,
    0,
    250,
    166,
  ])
})

test('focusIndex - when closed - when same index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = false
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusIndex(0)
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 0, 0)
})

test('focusIndex - when closed - when different index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = false
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusIndex(1)
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 0, 1)
})

test('focus', async () => {
  TitleBarMenu.state.focusedIndex = 42
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focus()
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 42, 0)
})

test('focusPrevious', async () => {
  TitleBarMenu.state.focusedIndex = 1
  TitleBarMenu.state.titleBarEntries = [
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
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusPrevious()
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 1, 0)
})

test('focusPrevious - at start', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.titleBarEntries = [
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
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusPrevious()
  expect(TitleBarMenu.state.focusedIndex).toBe(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 0, 2)
})

test('focusNext', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.titleBarEntries = [
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
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusNext()
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 0, 1)
})

test.skip('focusNext - with disabled items', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
      flags: /* None */ 0,
    },
    {
      id: 'edit',
      name: 'Edit',
      flags: /* None */ 0,
    },
    {
      id: 'selection',
      name: 'Selection',
      flags: /* None */ 0,
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusNext()
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 1)
})

test('focusNext - at end', async () => {
  TitleBarMenu.state.focusedIndex = 2
  TitleBarMenu.state.titleBarEntries = [
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
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.focusNext()
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(1371, 2, 0)
})

test('toggleIndex - when open - when same index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = true
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.toggleIndex(0)
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'TitleBar',
    'menuClose',
    0,
    0
  )
})

test.skip('toggleIndex - when open - when different index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = true
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.toggleIndex(1)
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    1372,
    1,
    [
      {
        flags: 0,
        id: 'cut',
        label: 'Cut',
      },
      {
        flags: 0,
        id: 'copy',
        label: 'Copy',
      },
      {
        flags: 0,
        id: 'paste',
        label: 'Paste',
      },
    ],
    false,
  ])
})

test.skip('toggleIndex - when closed - when same index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = false
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.toggleIndex(0)
  expect(TitleBarMenu.state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    1372,
    0,
    [
      {
        flags: 0,
        id: 'newFile',
        label: 'New File',
      },
      {
        flags: 0,
        id: 'newWindow',
        label: 'New Window',
      },
    ],
    false,
  ])
})

test.skip('toggleIndex - when closed - when different index', async () => {
  TitleBarMenu.state.focusedIndex = 0
  TitleBarMenu.state.isMenuOpen = false
  TitleBarMenu.state.titleBarEntries = [
    {
      id: 'file',
      name: 'File',
    },
    {
      id: 'edit',
      name: 'Edit',
    },
  ]
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await TitleBarMenu.toggleIndex(1)
  expect(TitleBarMenu.state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    1372,
    1,
    [
      {
        flags: 0,
        id: 'cut',
        label: 'Cut',
      },
      {
        flags: 0,
        id: 'copy',
        label: 'Copy',
      },
      {
        flags: 0,
        id: 'paste',
        label: 'Paste',
      },
    ],
    false,
  ])
})
