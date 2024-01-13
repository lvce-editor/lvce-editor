import * as GetDialogVirtualDom from '../GetDialogVirtualDom/GetDialogVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const br = {
  type: VirtualDomElements.Br,
  childCount: 0,
}

const renderLine = (line, index) => {
  if (index === 0) {
    return [text(line)]
  }
  return [br, text(line)]
}

export const getAboutVirtualDom = (productName, lines, closeMessage, okMessage, copyMessage, infoMessage) => {
  const content = [
    {
      type: VirtualDomElements.Div,
      className: 'DialogMessage',
      childCount: lines.length * 2 - 1,
    },
    ...lines.flatMap(renderLine),
  ]
  return GetDialogVirtualDom.getDialogVirtualDom(content, closeMessage, infoMessage, okMessage, copyMessage, productName)
}
