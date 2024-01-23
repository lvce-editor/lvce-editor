import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getVirtualDom = (textContent) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'DebugConsoleTop',
      childCount: 1,
    },
    text(textContent),
    {
      type: VirtualDomElements.Div,
      className: 'DebugConsoleBottom',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      onInput: 'handleInput',
      childCount: 0,
    },
  )
  return dom
}
