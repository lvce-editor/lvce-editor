import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getIconButtonVirtualDom = (iconButton) => {
  const { label, icon, disabled } = iconButton
  let className = 'IconButton'
  if (disabled) {
    className += ' IconButtonDisabled'
  }
  return [
    {
      type: VirtualDomElements.Button,
      className,
      title: label,
      ariaLaBel: label,
      childCount: 1,
      disabled: disabled ? true : undefined,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon MaskIcon${icon}`,
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
      className: 'FindWidgetMatchCount',
      childCount: 1,
    },
    text(matchCountText),
    ...buttons.flatMap(getIconButtonVirtualDom),
  )
  return dom
}
