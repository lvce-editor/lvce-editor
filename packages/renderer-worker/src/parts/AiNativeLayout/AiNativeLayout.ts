import * as Id from '../Id/Id.js'
import * as OpenUri from '../OpenUri/OpenUri.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import { getPoints } from '../ViewletLayout/LayoutPoints.ts'
import * as Command from '../Command/Command.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as ViewletLayout from '../ViewletLayout/ViewletLayout.ts'
import type { LayoutState } from '../ViewletLayout/LayoutState.ts'

let lastGestureTime = 0
let lastGestureDirection = 0

export const enter = (state: LayoutState) => ViewletLayout.enterSideBarFocusMode(state, 'primary', true)

export const handleActivityBarWheel = async (state: LayoutState, deltaY: number): Promise<LayoutState> => {
  if (!Number.isFinite(deltaY) || deltaY === 0 || deltaY < 0 === Boolean(state.aiNativeLayout)) return state
  const now = Date.now()
  if (Math.sign(deltaY) === lastGestureDirection && now - lastGestureTime < 700) return state
  lastGestureTime = now
  lastGestureDirection = Math.sign(deltaY)
  const commands = await ExtensionHostCommands.getCommands(state.assetDir, state.platform, state.applicationId)
  if (!commands.some((command) => command.id === 'chat2.toggleAiNativeLayout')) return state
  await Command.execute('ExtensionHost.executeCommand', 'chat2.toggleAiNativeLayout')
  return state
}
handleActivityBarWheel.returnValue = true

export const openSettings = async (state: LayoutState, ui = false) => {
  if (!state.aiNativeLayout) {
    await OpenUri.openUri(ui ? 'settings:///' : 'app:///settings.json')
    return { newState: state, commands: [] }
  }
  if (state.aiNativeSettingsId !== undefined) return { newState: state, commands: [] }
  const uid = Id.create()
  const newState = getPoints({ ...state, aiNativeSettingsId: uid })
  const commands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id: 'Settings',
      type: 0,
      setBounds: false,
      uid,
      parentUid: state.uid,
      uri: 'settings:///',
      x: newState.mainLeft,
      y: newState.mainTop + 40,
      width: newState.mainWidth,
      height: Math.max(0, newState.mainHeight - 40),
      show: false,
      focus: true,
    },
    true,
    false,
  )
  commands.push(...(await ViewletLayout.getResizeCommands(state, newState)))
  return { newState, commands }
}

export const closeSettings = async (state: LayoutState) => {
  if (state.aiNativeSettingsId === undefined) return { newState: state, commands: [] }
  const commands = Viewlet.disposeFunctional(state.aiNativeSettingsId)
  const newState = getPoints({ ...state, aiNativeSettingsId: undefined })
  commands.push(...(await ViewletLayout.getResizeCommands(state, newState)))
  return { newState, commands }
}

export const resizeSettings = async (state: LayoutState) => {
  if (state.aiNativeSettingsId === undefined) return []
  return Viewlet.resize(state.aiNativeSettingsId, {
    x: state.mainLeft,
    y: state.mainTop + 40,
    width: state.mainWidth,
    height: Math.max(0, state.mainHeight - 40),
  })
}
