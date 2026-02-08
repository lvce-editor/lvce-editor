import { getLayoutVirtualDom } from '../GetLayoutVirtualDom/GetLayoutVirtualDom.ts'
import { LayoutState } from './LayoutState.ts'

export const renderDom = (oldState, newState: LayoutState) => {
  const dom = getLayoutVirtualDom(newState)
  console.log('mainUid', newState.mainContentsVisible, newState.contentAreaId)
  console.log({ dom })
  const commands: any[] = [['Viewlet.setDom2', newState.uid, dom]]
  // TODO ensure focus commands are last in the commands array
  return commands
}
