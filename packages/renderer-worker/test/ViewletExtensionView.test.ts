import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(),
  }
})

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const GetSideBarDom = await import('../src/parts/GetSideBarDom/GetSideBarDom.js')
const ViewletExtensionView = await import('../src/parts/ViewletExtensionView/ViewletExtensionView.ts')
const ViewletExtensionViewRender = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewRender.ts')

const createState = () => {
  return {
    actionsDom: [],
    commands: [],
    css: '',
    cssId: '',
    csp: '',
    credentialless: true,
    dom: [],
    eventListeners: [],
    focusSelector: '',
    height: 100,
    iframeSandbox: [],
    iframeSrc: '',
    kind: 'virtualDom',
    patches: [],
    stateful: false,
    title: 'Testing',
    uid: 1,
    uri: 'sample.views.testing',
    viewId: 'sample.views.testing',
    width: 100,
    x: 0,
    y: 0,
  }
}

test('create stores parent uid for sidebar title updates', () => {
  const state = ViewletExtensionView.create(1, 'sample.views.testing', 0, 0, 100, 100, undefined, 2)

  expect(state.parentUid).toBe(2)
})

test('loadContent uses displayName as title for virtual dom views', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.getViews') {
      return [
        {
          displayName: 'Testing Display',
          id: 'sample.views.testing',
          kind: 'virtualDom',
          title: 'Testing Title',
        },
      ]
    }
    if (method === 'Extensions.getAllExtensions') {
      return []
    }
    if (method === 'Extensions.createViewInstance') {
      return {
        dom: [],
        type: 'setDom',
      }
    }
    if (method === 'Extensions.getViewActionsDom') {
      return undefined
    }
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })

  await expect(ViewletExtensionView.loadContent(createState(), undefined)).resolves.toMatchObject({
    title: 'Testing Display',
  })
})

test('loadContent uses rendered title for virtual dom views', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.getViews') {
      return [
        {
          displayName: 'Testing Display',
          id: 'sample.views.testing',
          kind: 'virtualDom',
        },
      ]
    }
    if (method === 'Extensions.getAllExtensions') {
      return []
    }
    if (method === 'Extensions.createViewInstance') {
      return {
        dom: [],
        title: 'Testing: Dynamic',
        type: 'setDom',
      }
    }
    if (method === 'Extensions.getViewActionsDom') {
      return undefined
    }
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })

  await expect(ViewletExtensionView.loadContent(createState(), undefined)).resolves.toMatchObject({
    title: 'Testing: Dynamic',
  })
})

test('loadContent exposes managed extension view state', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.getViews') {
      return [{ id: 'sample.views.testing', kind: 'virtualDom', title: 'Testing' }]
    }
    if (method === 'Extensions.getAllExtensions') {
      return []
    }
    if (method === 'Extensions.createViewInstance') {
      return {
        ok: true,
        result: { dom: [], type: 'setDom' },
        stateful: true,
      }
    }
    if (method === 'Extensions.getViewActionsDom') {
      return undefined
    }
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })

  const state = await ViewletExtensionView.loadContent(createState(), undefined)

  expect(ViewletExtensionView.isComponentStateAvailable(state)).toBe(true)
})

test('sidebar dom uses custom view title instead of id', () => {
  const dom = GetSideBarDom.getSideBarDom({
    actionsUid: -1,
    childUid: 2,
    currentViewletId: 'sample.views.testing',
    title: 'Testing Display',
  })

  expect(dom).toContainEqual({
    childCount: 0,
    text: 'Testing Display',
    type: 12,
  })
})

test('sidebar dom omits the header when the view opts out', () => {
  const dom = GetSideBarDom.getSideBarDom({
    childUid: 2,
    currentViewletId: 'chat2.views.chat',
    title: 'Chat 2',
    titleAreaHeight: 0,
  })

  expect(dom).toEqual([
    {
      childCount: 1,
      className: 'SideBar',
      type: 4,
    },
    {
      type: 100,
      uid: 2,
    },
  ])
})

test('rerender requests virtual dom patches from extension management worker', async () => {
  const patches = [['setText', 0, 'updated']]
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.renderViewInstance') {
      return {
        patches,
        type: 'setPatches',
      }
    }
    if (method === 'Extensions.getViewActionsDom') {
      return undefined
    }
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })
  const state = createState()

  await expect(ViewletExtensionView.rerender(state)).resolves.toMatchObject({
    patches,
  })

  expect(invoke).toHaveBeenCalledWith('Extensions.renderViewInstance', 'sample.views.testing', 1, expect.any(String), expect.any(Number))
})

test('gets managed extension view state', async () => {
  const componentState = { count: 1 }
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockResolvedValue(componentState)

  await expect(ViewletExtensionView.getComponentState(createState())).resolves.toBe(componentState)

  expect(invoke).toHaveBeenCalledWith('Extensions.getViewInstanceState', 'sample.views.testing', 1, expect.any(String), expect.any(Number))
})

test('sets managed extension view state and returns the renderer state', async () => {
  const componentState = { count: 2 }
  const patches = [['setText', 0, '2']]
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.setViewInstanceState') {
      return { patches, type: 'setPatches' }
    }
    if (method === 'Extensions.getViewActionsDom') {
      return undefined
    }
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })

  await expect(ViewletExtensionView.setComponentState(createState(), componentState)).resolves.toMatchObject({ patches })

  expect(invoke).toHaveBeenCalledWith(
    'Extensions.setViewInstanceState',
    'sample.views.testing',
    1,
    componentState,
    expect.any(String),
    expect.any(Number),
  )
})

test('rerender updates the title rendered by the parent sidebar', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.renderViewInstance') {
      return {
        patches: [],
        title: 'Testing: Updated',
        type: 'setPatches',
      }
    }
    if (method === 'Extensions.getViewActionsDom') {
      return undefined
    }
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })
  const state = createState()

  const newState = await ViewletExtensionView.rerender(state)

  expect(newState.title).toBe('Testing: Updated')
  expect(ViewletExtensionViewRender.renderTitle.isEqual(state, newState)).toBe(false)
  expect(ViewletExtensionViewRender.renderTitle.apply(state, newState)).toBe('Testing: Updated')
})

test('commands exports rerender', () => {
  expect(ViewletExtensionView.Commands.rerender).toBe(ViewletExtensionView.rerender)
})

test('commands exports handleActiveEditorChange', () => {
  expect(ViewletExtensionView.Commands.handleActiveEditorChange).toBe(ViewletExtensionView.handleActiveEditorChange)
})

test('handleActiveEditorChange marks the matching virtual dom view active', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  const state = {
    ...createState(),
    uri: 'file:///workspace/image.png',
    viewId: 'media-preview',
  }

  const newState = await ViewletExtensionView.handleActiveEditorChange(state, 'file:///workspace/image.png')

  expect(newState).toBe(state)
  expect(invoke).toHaveBeenCalledWith('Extensions.setViewInstanceActive', 'media-preview', 1, true, expect.any(String), expect.any(Number))
})

test('handleActiveEditorChange marks a non-matching virtual dom view inactive', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  const state = {
    ...createState(),
    uri: 'file:///workspace/image.png',
    viewId: 'media-preview',
  }

  await ViewletExtensionView.handleActiveEditorChange(state, 'file:///workspace/other.png')

  expect(invoke).toHaveBeenCalledWith('Extensions.setViewInstanceActive', 'media-preview', 1, false, expect.any(String), expect.any(Number))
})

test('handleActiveEditorChange ignores iframe views', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  const state = {
    ...createState(),
    kind: 'iframe',
  }

  const newState = await ViewletExtensionView.handleActiveEditorChange(state, 'sample.views.testing')

  expect(newState).toBe(state)
  expect(invoke).not.toHaveBeenCalled()
})
