import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const debugRow3 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow,
  childCount: 3,
  onPointerDown: DomEventListenerFunctions.HandleClickScopeValue,
}

const separator = text(': ')

export const getScopeExceptionVirtualDom = (scope) => {
  const { key, value } = scope
  return [
    debugRow3,
    {
      type: VirtualDomElements.Span,
      childCount: 1,
    },
    text(key),
    separator,

    {
      type: VirtualDomElements.Span,
      childCount: 1,
    },
    text(value),
  ]
}
