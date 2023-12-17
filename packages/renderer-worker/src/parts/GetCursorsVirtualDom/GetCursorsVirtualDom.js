import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getCursorsVirtualDom = (cursors) => {
  const dom = []
  for (const translate of cursors) {
    dom.push({
      type: VirtualDomElements.Div,
      className: 'EditorCursor',
      translate,
    })
  }
  return dom
}
