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

export const getAboutContentVirtualDom = (lines) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'DialogMessage',
      childCount: lines.length * 2 - 1,
    },
    ...lines.flatMap(renderLine),
  ]
  return dom
}
