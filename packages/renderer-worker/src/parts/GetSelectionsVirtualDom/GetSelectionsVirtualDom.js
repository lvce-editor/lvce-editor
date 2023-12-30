import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSelectionsVirtualDom = (selections) => {
  const dom = []
  for (let i = 0; i < selections.length; i += 4) {
    const x = selections[i]
    const y = selections[i + 1]
    const width = selections[i + 2]
    const height = selections[i + 3]
    dom.push({
      type: VirtualDomElements.Div,
      className: ClassNames.EditorSelection,
      left: x,
      top: y,
      width,
      height,
    })
  }
  return dom
}
