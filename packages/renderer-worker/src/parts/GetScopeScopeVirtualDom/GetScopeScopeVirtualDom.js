import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const debugRow3 = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugRow,
  childCount: 3,
  onPointerDown: 'handleClickScopeValue',
}

export const getScopeScopeVirtualDom = (scope) => {
  const { key, isExpanded, isFocused } = scope
  let className = ClassNames.DebugRow
  if (isFocused) {
    className += ' TreeItemActive'
  }
  return [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: 2,
      onPointerDown: 'handleClickScopeValue',
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
