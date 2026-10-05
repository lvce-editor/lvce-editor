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
