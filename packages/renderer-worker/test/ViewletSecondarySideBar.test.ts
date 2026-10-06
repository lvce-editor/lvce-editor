// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => ({
  saveViewletState: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({
  dispose: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => ({
  load: jest.fn(),
  runLoadContentLater: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletSecondarySideBar = await import('../src/parts/ViewletSecondarySideBar/ViewletSecondarySideBar.js')

beforeEach(() => {
  jest.resetAllMocks()
  Command.execute.mockResolvedValue(undefined)
  RendererProcess.invoke.mockResolvedValue(undefined)
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'ExtensionView', 2, true]])
  ViewletManager.runLoadContentLater.mockReturnValue(undefined)
})

test('loadContent opens Chat 2 when the layout does not provide a secondary view', async () => {
  const state = ViewletSecondarySideBar.create(1, '', 0, 0, 300, 500)

  await ViewletSecondarySideBar.loadContent(state, {})

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'ExtensionView',
      uri: 'chat2.views.chat',
    }),
    false,
    true,
  )
})

test('handleSecondarySideBarViewletChange loads extension views through ExtensionView', async () => {
  const state = ViewletSecondarySideBar.create(1, '', 0, 0, 300, 500)

  const result = await ViewletSecondarySideBar.handleSecondarySideBarViewletChange(state, 'chat2.views.chat')

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'ExtensionView',
      uri: 'chat2.views.chat',
    }),
    false,
    true,
  )
  expect(result).toMatchObject({
    currentViewletId: 'chat2.views.chat',
  })
  expect(result.childUid).not.toBe(-1)
})
