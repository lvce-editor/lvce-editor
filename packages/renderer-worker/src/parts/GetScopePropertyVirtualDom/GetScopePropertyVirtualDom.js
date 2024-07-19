import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugItemFlags from '../DebugItemFlags/DebugItemFlags.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as GetDebugValueClassName from '../GetDebugValueClassName/GetDebugValueClassName.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const separator = text(': ')
const debugPropertyKey = {
  type: VirtualDomElements.Span,
  className: ClassNames.DebugValue + ' ' + ClassNames.DebugPropertyKey,
  childCount: 1,
}

export const getScopePropertyVirtualDom = (scope) => {
  const { indent, key, value, valueType, flags } = scope
  const className = GetDebugValueClassName.getDebugValueClassName(valueType)
  const isExpanded = flags & DebugItemFlags.Expanded
  const isCollapsed = flags & DebugItemFlags.Collapsed
  // @ts-ignore
  const isFocused = flags & DebugItemFlags.Focused
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.DebugRow,
    paddingLeft: indent,
    childCount: 3,
    onPointerDown: DomEventListenerFunctions.HandleClickScopeValue,
  })
  if (isExpanded) {
    dom[0].childCount++
    dom.push(GetChevronVirtualDom.getChevronDownVirtualDom(ClassNames.DebugPropertyChevron))
  } else if (isCollapsed) {
    dom[0].childCount++
    dom.push(GetChevronVirtualDom.getChevronRightVirtualDom(ClassNames.DebugPropertyChevron))
  }
  dom.push(
    debugPropertyKey,
    text(key),
    separator,
    {
      type: VirtualDomElements.Span,
      className: ClassNames.DebugValue + ' ' + className,
      childCount: 1,
    },
    text(value),
  )
  return dom
}
