import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const separator = text(': ')

export const getScopeThisVirtualDom = (scope) => {
  const { indent, key, value, valueType } = scope
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      paddingLeft: indent,
      childCount: 3,
      onPointerDown: DomEventListenerFunctions.HandleClickScopeValue,
    },
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue DebugPropertyKey',
      childCount: 1,
    },
    text(key),
    separator,
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue ' + className,
      childCount: 1,
    },
    text(value),
  ]
}
