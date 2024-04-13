import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getDefineKeyBindingsVirtualDom = (message) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet DefineKeyBinding',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DefineKeyBindingContent',
      childCount: 2,
    },
    {
      type: VirtualDomElements.H2,
      className: 'DefineKeyBindingHeading',
      childCount: 1,
    },
    text(message),
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      childCount: 0,
      onKeyDown: 'handleKeyDown',
      onBlur: 'handleBlur',
    },
  ]
}
