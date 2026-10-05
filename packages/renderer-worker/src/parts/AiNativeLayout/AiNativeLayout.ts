import * as Command from '../Command/Command.js'
import * as ViewletLayout from '../ViewletLayout/ViewletLayout.ts'
import type { LayoutState } from '../ViewletLayout/LayoutState.ts'

let lastGestureTime = 0

export const enter = (state: LayoutState) => ViewletLayout.enterSideBarFocusMode(state, 'primary', true)

export const handleActivityBarWheel = async (state: LayoutState, deltaY: number): Promise<void> => {
  if (!Number.isFinite(deltaY) || deltaY === 0 || deltaY < 0 === Boolean(state.aiNativeLayout)) return
  const now = Date.now()
  if (now - lastGestureTime < 700) return
  lastGestureTime = now
  await Command.execute('ExtensionHost.executeCommand', 'chat2.toggleAiNativeLayout')
}
handleActivityBarWheel.returnValue = true
