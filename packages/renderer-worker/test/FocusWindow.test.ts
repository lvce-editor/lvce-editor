import { expect, jest, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const show = jest.fn(async () => {})
jest.unstable_mockModule('../src/parts/ElectronWindow/ElectronWindow.js', () => ({ show }))

const Application = await import('../src/parts/Application/Application.ts')
const { Commands } = await import('../src/parts/ViewletLayout/ViewletLayoutCommands.js')

test.each([
  [PlatformType.Electron, 1],
  [PlatformType.Web, 0],
])('dispatches the window focus request on platform %i', async (platform, calls) => {
  show.mockClear()
  const id = 'board-workbench'
  const uid = 1
  ApplicationRegistry.create({ href: '', id, layoutUid: uid, workspacePath: '', workspaceUri: '' })
  try {
    const state = { applicationId: id, platform, uid }
    ViewletStates.set(uid, {
      factory: { Commands, hasFunctionalRender: true },
      moduleId: 'Layout',
      renderedState: state,
      state,
    })
    await Application.executeForView(uid, 'Layout.focusWindow')
    expect(show).toHaveBeenCalledTimes(calls)
  } finally {
    ViewletStates.reset()
    ApplicationRegistry.remove(id)
  }
})
