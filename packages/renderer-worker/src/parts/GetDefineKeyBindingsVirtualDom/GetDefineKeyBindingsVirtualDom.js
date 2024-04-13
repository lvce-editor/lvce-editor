import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getDefineKeyBindingsVirtualDom = (message) => {
  return [
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
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      onBlur: DomEventListenerFunctions.HandleBlur,
    },
  ]
}
