import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getGutterInfoVirtualDom = (gutterInfo) => {
  return [
    {
      type: VirtualDomElements.Span,
      className: 'LineNumber',
      childCount: 1,
    },
    text(gutterInfo),
  ]
}

export const getEditorGutterVirtualDom = (gutterInfos) => {
  const dom = gutterInfos.flatMap(getGutterInfoVirtualDom)
  return dom
}
