import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'

export const getCursorsVirtualDom = (cursors) => {
  const dom = []
  for (const translate of cursors) {
    dom.push({
      type: VirtualDomElements.Div,
      className: ClassNames.EditorCursor,
      translate,
    })
  }
  return dom
}
