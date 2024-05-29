import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetInlineDiffEditorLineVirtualDom from '../GetInlineDiffEditorLineVirtualDom/GetInlineDiffEditorLineVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getLinesVirtualDom = (lines) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Editor} ${ClassNames.DiffEditorContent} ${ClassNames.InlineDiffEditorContent}`,
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

export const getInlineDiffEditorVirtualDom = (lines, scrollBarY, scrollBarHeight) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Viewlet} ${ClassNames.InlineDiffEditor}`,
      childCount: 3,
      onWheel: DomEventListenerFunctions.HandleWheel,
    },
    ...getLinesVirtualDom(lines),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBar,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ScrollBarThumb,
      childCount: 0,
      top: `${scrollBarY}px`,
      height: `${scrollBarHeight}px`,
    },
  ]
}
