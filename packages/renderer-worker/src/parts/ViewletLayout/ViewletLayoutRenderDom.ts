import { getLayoutVirtualDom } from '../GetLayoutVirtualDom/GetLayoutVirtualDom.ts'

export const renderDom = (oldState, newState) => {
  const dom = getLayoutVirtualDom(newState)
  const commands: any[] = [['Viewlet.setDom2', newState.uid, dom]]
  // TODO ensure focus commands are last in the commands array
  return commands
}
