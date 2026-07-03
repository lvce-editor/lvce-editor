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
const ViewletExtensionViewCommands = await import('../src/parts/ViewletExtensionView/ViewletExtensionViewCommands.ts')

const createState = () => {
  return {
    commands: [],
    csp: '',
    credentialless: true,
    dom: [],
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
    if (method === 'Extensions.createViewInstance') {
      return {
        dom: [],
        type: 'setDom',
      }
    }
    throw new Error(`unexpected method ${method}`)
  })

  await expect(ViewletExtensionView.loadContent(createState(), undefined)).resolves.toMatchObject({
    title: 'Testing Display',
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
  invoke.mockResolvedValue({
    patches,
    type: 'setPatches',
  })
  const state = createState()

  await expect(ViewletExtensionView.rerender(state)).resolves.toMatchObject({
    patches,
  })

  expect(invoke).toHaveBeenCalledWith('Extensions.renderViewInstance', 'sample.views.testing', 1, expect.any(String), expect.any(Number))
})

test('commands exports rerender', () => {
  expect(ViewletExtensionViewCommands.Commands.rerender).toBe(ViewletExtensionView.rerender)
})
