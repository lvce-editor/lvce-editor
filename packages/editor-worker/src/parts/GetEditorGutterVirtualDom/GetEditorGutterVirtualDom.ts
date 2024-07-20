import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getGutterInfoVirtualDom = (gutterInfo: any) => {
  return [
    {
      type: VirtualDomElements.Span,
      className: 'LineNumber',
      childCount: 1,
    },
    text(gutterInfo),
  ]
}

export const getEditorGutterVirtualDom = (gutterInfos: any[]) => {
  const dom = gutterInfos.flatMap(getGutterInfoVirtualDom)
  return dom
}
