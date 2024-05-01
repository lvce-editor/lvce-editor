import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugItemFlags from '../DebugItemFlags/DebugItemFlags.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getScopeScopeVirtualDom = (scope) => {
  const { key, flags } = scope
  let className = ClassNames.DebugRow
  const isFocused = flags & DebugItemFlags.Focused
  const isExpanded = flags & DebugItemFlags.Expanded
  if (isFocused) {
    className += ' TreeItemActive'
  }
  return [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: 2,
      onPointerDown: DomEventListenerFunctions.HandleClickScopeValue,
      ariaExpanded: isExpanded,
    },
    isExpanded ? GetChevronVirtualDom.getChevronDownVirtualDom() : GetChevronVirtualDom.getChevronRightVirtualDom(),
    {
      type: VirtualDomElements.Span,
      className: 'DebugValue DebugValueScopeName',
      childCount: 1,
    },
    text(key),
  ]
}
