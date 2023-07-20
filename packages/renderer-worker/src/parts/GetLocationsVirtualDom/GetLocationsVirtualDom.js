import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getReferenceDom = (reference) => {
  console.log({ reference })
  const { name, depth, posInSet, setSize, lineText } = reference
  return [
    {
      type: VirtualDomElements.Div,
      className: 'TreeItem',
      childCount: 1,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
    },
    text(name || lineText),
  ]
}

export const getVirtualDom = (displayReferences, message) => {
  if (message) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'LocationsMessage',
        childCount: 1,
      },
      text(message),
    ]
  }
  const dom = displayReferences.flatMap(getReferenceDom)
  return dom
}
