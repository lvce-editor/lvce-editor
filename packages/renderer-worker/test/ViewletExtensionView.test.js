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
    title: 'Testing',
    uid: 1,
    uri: 'sample.views.testing',
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
  const invoke = /** @type {any} */ (ExtensionManagementWorker.invoke)
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
  const invoke = /** @type {any} */ (ExtensionManagementWorker.invoke)
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
    if (method === 'Extensions.getViewActions') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })

  await expect(ViewletExtensionView.loadContent(createState(), undefined)).resolves.toMatchObject({
    title: 'Testing: Dynamic',
  })
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

test('rerender requests virtual dom patches from extension management worker', async () => {
  const patches = [['setText', 0, 'updated']]
  const invoke = /** @type {any} */ (ExtensionManagementWorker.invoke)
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.renderViewInstance') {
      return {
        patches,
        type: 'setPatches',
      }
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

test('rerender updates the title rendered by the parent sidebar', async () => {
  const invoke = /** @type {any} */ (ExtensionManagementWorker.invoke)
  invoke.mockImplementation((method) => {
    if (method === 'Extensions.renderViewInstance') {
      return {
        patches: [],
        title: 'Testing: Updated',
        type: 'setPatches',
      }
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
