import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getCursorsVirtualDom = (cursors) => {
  const dom = []
  for (let i = 0; i < cursors.length; i++) {
    const translate = cursors[i]
    dom.push({
      type: VirtualDomElements.Div,
      className: 'EditorCursor',
      translate,
    })
  }
  return dom
}
