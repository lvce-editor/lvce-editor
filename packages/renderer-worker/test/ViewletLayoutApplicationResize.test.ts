import { afterEach, expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const resize = jest.fn(async () => [])
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ resize, disposeFunctional: jest.fn(() => []) }))
const Layout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const SideBar = await import('../src/parts/ViewletSideBar/ViewletSideBar.js')

afterEach(() => {
  ViewletStates.reset()
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
  jest.clearAllMocks()
})

const register = (applicationId: string, uid: number, moduleId: string): void => {
  ApplicationRegistry.create({ id: applicationId, layoutUid: uid + 100, href: '/', workspaceUri: 'memfs:///', workspacePath: '/' })
  const state = { uid, applicationId }
  ViewletStates.set(uid, { state, renderedState: state, moduleId, factory: {} })
}

test('resizing the preview layout does not resize the source sidebar', async () => {
  register('source', 10, 'SideBar')
  register('preview', 20, 'SideBar')
  const state = { ...Layout.create(120), applicationId: 'preview', windowWidth: 600, windowHeight: 800, titleBarHeight: 20, titleBarVisible: true }
  await Layout.hideTitleBar(state)
  expect(resize).toHaveBeenCalledWith(20, expect.objectContaining({ y: 0 }))
  expect(resize).not.toHaveBeenCalledWith(10, expect.anything())
})

test('a sidebar resizes its concrete child when both applications show Explorer', async () => {
  register('source', 10, 'Explorer')
  register('preview', 20, 'Explorer')
  const state = { ...SideBar.create(120, '', 0, 20, 240, 780), applicationId: 'preview', childUid: 20, currentViewletId: 'Explorer' }
  await SideBar.resize(state, { x: 0, y: 0, width: 240, height: 800 })
  expect(resize).toHaveBeenCalledWith(20, { x: 0, y: 35, width: 240, height: 765 })
  expect(resize).toHaveBeenCalledTimes(1)
})
