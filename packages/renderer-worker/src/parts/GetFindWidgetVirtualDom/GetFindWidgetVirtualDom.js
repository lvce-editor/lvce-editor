import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getIconButtonVirtualDom = (iconButton) => {
  const { label, icon, enabled } = iconButton
  let className = 'IconButton'
  if (!enabled) {
    className += ' IconButtonDisabled'
  }
  return [
    {
      type: VirtualDomElements.Button,
      className,
      title: label,
      ariaLanel: label,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon',
      maskImage: icon,
      role: AriaRoles.None,
      childCount: 0,
    },
  ]
}

export const getFindWidgetVirtualDom = (matchCountText, buttons) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'FindWidgetDetails',
      childCount: 1 + buttons.length,
    },
    {
      type: VirtualDomElements.Div,
      classname: 'FindWidgetMatchCount',
      childCount: 1,
    },
    text(matchCountText),
    ...buttons.flatMap(getIconButtonVirtualDom),
  )
  return dom
}
