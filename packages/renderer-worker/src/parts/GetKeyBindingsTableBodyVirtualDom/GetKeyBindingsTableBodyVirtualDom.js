import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetKeyBindingsTableBodyRowVirtualDom from '../GetKeyBindingsTableBodyRowVirtualDom/GetKeyBindingsTableBodyRowVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getKeyBindingsTableBodyDom = (displayKeyBindings) => {
  return [
    {
      type: VirtualDomElements.TBody,
      className: ClassNames.KeyBindingsTableBody,
      childCount: displayKeyBindings.length,
    },
    ...displayKeyBindings.flatMap(GetKeyBindingsTableBodyRowVirtualDom.getKeyBindingsTableBodyRowDom),
  ]
}
