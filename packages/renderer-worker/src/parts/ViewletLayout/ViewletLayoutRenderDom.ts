import { getLayoutVirtualDom } from '../GetLayoutVirtualDom/GetLayoutVirtualDom.ts'
import type { LayoutState } from './LayoutState.ts'

export const renderDom = (oldState, newState: LayoutState) => {
  const dom = getLayoutVirtualDom(newState)
  const commands: any[] = [['Viewlet.setDom2', newState.uid, dom]]
  // TODO ensure focus commands are last in the commands array
  return commands
}
