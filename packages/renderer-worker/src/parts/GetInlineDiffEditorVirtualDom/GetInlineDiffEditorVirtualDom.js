import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetInlineDiffEditorLineVirtualDom from '../GetInlineDiffEditorLineVirtualDom/GetInlineDiffEditorLineVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getLinesVirtualDom = (lines, className) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Editor} ${ClassNames.DiffEditorContent} ${className}`,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.EditorContent,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.EditorRows,
      childCount: lines.length,
    },
    ...lines.flatMap(GetInlineDiffEditorLineVirtualDom.renderLine),
  ]
}

export const getInlineDiffEditorVirtualDom = (lines) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Viewlet} ${ClassNames.InlineDiffEditor}`,
      childCount: 3,
      onWheel: DomEventListenerFunctions.HandleWheel,
    },
    ...getLinesVirtualDom(lines, ClassNames.InlineDiffEditorContent),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBar,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBarThumb,
      childCount: 0,
    },
  ]
}
