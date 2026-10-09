import { beforeEach, expect, jest, test } from '@jest/globals'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

beforeEach(() => {
  jest.resetAllMocks()
  ViewletExtensionView.handleExtensionsChanged(createState(), 'sample.extension', false)
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => {
  return {
    invoke: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => ({ setFocus: jest.fn() }))

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: jest.fn() }))
const Command = await import('../src/parts/Command/Command.js')

const Focus = await import('../src/parts/Focus/Focus.js')
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
    extensionId: 'sample.extension',
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

test('disabling the contributing extension replaces virtual dom contents and clears extension actions', () => {
  const state = {
    ...createState(),
    actionsDom: [{ type: 1 }],
    css: '.view { color: red }',
    dom: [{ type: VirtualDomElements.Button }],
    eventListeners: [{ name: 'custom' }],
  }

  const newState = ViewletExtensionView.handleExtensionsChanged(state, 'sample.extension', true)

  expect(newState).toMatchObject({
    actionsDom: [],
    css: '',
    disabled: true,
    dom: [{ childCount: 0, text: 'Extension contributing this view has been disabled', type: 12 }],
    eventListeners: [],
    kind: 'virtualDom',
  })
})

test('disabling an unrelated extension leaves the view unchanged', () => {
  const state = createState()

  expect(ViewletExtensionView.handleExtensionsChanged(state, 'sample.other-extension', true)).toBe(state)
})

test('disabling an iframe view clears its iframe and prevents later extension calls', async () => {
  const state = {
    ...createState(),
    iframeSrc: 'https://extension.test/view.html',
    kind: 'iframe',
  }
  const disabled = ViewletExtensionView.handleExtensionsChanged(state, 'sample.extension', true)

  expect(disabled).toMatchObject({
    disabled: true,
    iframeSrc: '',
    kind: 'virtualDom',
  })
  await expect(ViewletExtensionView.handleViewEvent(disabled, 'click', 'button')).resolves.toBe(disabled)
  await expect(ViewletExtensionView.dispose(disabled)).resolves.toBeUndefined()
  expect(ExtensionManagementWorker.invoke).not.toHaveBeenCalled()
})

test('a delayed extension event cannot restore content after the extension is disabled', async () => {
  let resolveEvent: (value: unknown) => void = () => undefined
  const eventResult = new Promise((resolve) => {
    resolveEvent = resolve
  })
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockReturnValue(eventResult)
  const state = createState()
  const event = ViewletExtensionView.handleViewEvent(state, 'click', 'button')

  const disabled = ViewletExtensionView.handleExtensionsChanged(state, 'sample.extension', true)
  resolveEvent({ dom: [{ type: 1 }], type: 'setDom' })

  await expect(event).resolves.toMatchObject({
    disabled: true,
    dom: [{ text: 'Extension contributing this view has been disabled', type: 12 }],
  })
  expect(disabled.disabled).toBe(true)
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

test('loadContent shows a graceful fallback when the extension view is unavailable', async () => {
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.getViews') {
      return []
    }
    if (method === 'Extensions.getAllExtensions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })
  const state = {
    ...createState(),
    actionsDom: [{ type: 1 }],
    css: '.view { color: red }',
    dom: [{ type: VirtualDomElements.Button }],
    eventListeners: [{ name: 'custom' }],
    iframeSrc: 'https://extension.test/view.html',
    kind: 'iframe',
  }

  await expect(ViewletExtensionView.loadContent(state, undefined)).resolves.toMatchObject({
    actionsDom: [],
    css: '',
    disabled: true,
    dom: [
      {
        childCount: 0,
        text: 'This view is unavailable. Its extension may have been disabled or uninstalled.',
        type: 12,
      },
    ],
    eventListeners: [],
    iframeSrc: '',
    kind: 'virtualDom',
  })
  expect(invoke).toHaveBeenCalledTimes(2)
})

test('exposes DOM for virtual DOM views but not iframe views', () => {
  const state = { ...createState(), dom: [{ childCount: 0, type: 4 }] }
  const iframeState = { ...state, kind: 'iframe' }

  expect(ViewletExtensionView.isComponentDomAvailable(state)).toBe(true)
  expect(ViewletExtensionView.getComponentDom(state)).toEqual(state.dom)
  expect(ViewletExtensionView.isComponentDomAvailable(iframeState)).toBe(false)
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

test.each(['click', 'focus'])('native extension %s takes keyboard focus before dispatch', async (type) => {
  const state = createState()
  const invoke = ExtensionManagementWorker.invoke as any
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.dispatchViewEvent') {
      expect(Focus.setFocus).toHaveBeenCalledWith(0, undefined, state.uid, 'ExtensionView')
    }
    return []
  })
  await ViewletExtensionView.handleViewEvent(state, type, 'cell:0:1')
  expect(Focus.setFocus).toHaveBeenCalledTimes(1)
})

test('native extension blur does not take focus back from another view', async () => {
  ;(ExtensionManagementWorker.invoke as any).mockResolvedValue([])
  await ViewletExtensionView.handleBlur(createState(), 'cell:0:1')
  expect(Focus.setFocus).not.toHaveBeenCalled()
})

test('iframe events do not change native keyboard focus', async () => {
  await ViewletExtensionView.handleClick({ ...createState(), kind: 'iframe' }, '')
  expect(Focus.setFocus).not.toHaveBeenCalled()
})

test('committed document edits notify the owning main area of dirty state', async () => {
  const state = { ...createState(), parentUid: 7, uri: 'file:///save.csv', modified: false }
  const dirty = { ...state, modified: true }
  await ViewletExtensionView.afterRender(state, dirty)
  expect(Command.execute).toHaveBeenCalledWith('Main.handleModifiedStatusChange', 'file:///save.csv', true)
})

test('document save dispatches the save callback and retains its dirty result', async () => {
  const state = { ...createState(), modified: true }
  jest.mocked(ExtensionManagementWorker.invoke).mockImplementation(async (method) => {
    if (method === 'Extensions.dispatchViewEvent') return { type: 'setPatches', patches: [], modified: false }
    return []
  })
  const saved = await ViewletExtensionView.save(state)
  expect(saved.modified).toBe(false)
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.dispatchViewEvent',
    state.viewId,
    state.uid,
    { type: 'command', handler: 'save', args: [] },
    expect.anything(),
    expect.anything(),
  )
})

test('failed document saves reject without clearing dirty state', async () => {
  const state = { ...createState(), modified: true }
  jest.mocked(ExtensionManagementWorker.invoke).mockRejectedValue(new Error('disk full'))
  await expect(ViewletExtensionView.save(state)).rejects.toThrow('disk full')
  expect(state.modified).toBe(true)
})

test('clean and non-document views do not dispatch save callbacks', async () => {
  const state = createState()
  expect(await ViewletExtensionView.save(state)).toBe(state)
  const clean = { ...state, modified: false }
  expect(await ViewletExtensionView.save(clean)).toBe(clean)
  expect(ExtensionManagementWorker.invoke).not.toHaveBeenCalled()
})

test('dirty changes are scoped to the owning application', async () => {
  const state = { ...createState(), applicationId: 'app-2', modified: false }
  await ViewletExtensionView.afterRender(state, { ...state, modified: true })
  expect(Command.execute).toHaveBeenCalledWith('Application.execute', 'app-2', 'Main.handleModifiedStatusChange', state.uri, true)
})
