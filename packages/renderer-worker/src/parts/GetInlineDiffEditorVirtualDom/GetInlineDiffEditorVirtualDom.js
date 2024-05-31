import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetInlineDiffEditorLineVirtualDom from '../GetInlineDiffEditorLineVirtualDom/GetInlineDiffEditorLineVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getLinesVirtualDom = (lines, lineNumbers) => {
  const renderLine = lineNumbers ? GetInlineDiffEditorLineVirtualDom.renderLineWithLineNumber : GetInlineDiffEditorLineVirtualDom.renderLine
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
    ...lines.flatMap(renderLine),
  ]
}

export const getInlineDiffEditorVirtualDom = (lines, scrollBarY, scrollBarHeight, lineNumbers) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.Viewlet} ${ClassNames.InlineDiffEditor}`,
      childCount: 3,
      onWheel: DomEventListenerFunctions.HandleWheel,
    },
    ...getLinesVirtualDom(lines, lineNumbers),
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.ScrollBar} ${ClassNames.ScrollBarLarge}`,
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
