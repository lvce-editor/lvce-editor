import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const separator = text(': ')
const debugPropertyKey = {
  type: VirtualDomElements.Span,
  className: 'DebugValue ' + ClassNames.DebugPropertyKey,
  childCount: 1,
}

export const getScopePropertyVirtualDom = (scope) => {
  const { indent, key, value, valueType } = scope
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugRow,
      paddingLeft: indent,
      childCount: 3,
      onPointerDown: 'handleClickScopeValue',
    },
    debugPropertyKey,
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
