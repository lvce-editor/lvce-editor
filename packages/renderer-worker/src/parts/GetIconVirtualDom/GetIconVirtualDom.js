import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getIconVirtualDom = (icon, type = VirtualDomElements.Div) => {
  return {
    type,
    className: `MaskIcon MaskIcon${icon}`,
    role: AriaRoles.None,
    childCount: 0,
  }
}
