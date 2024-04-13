import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
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
      className: ClassNames.DefineKeyBindingContent,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DefineKeyBindingHeading,
      childCount: 1,
    },
    text(message),
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      childCount: 0,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      onBlur: DomEventListenerFunctions.HandleBlur,
    },
  ]
}
