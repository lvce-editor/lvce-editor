import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as GetRunAndDebugRowVirtualDom from '../GetRunAndDebugRowVirtualDom/GetRunAndDebugRowVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export const getRunAndDebugVirtualDom2 = (rows: readonly DebugRow[]): readonly VirtualDomNode[] => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet RunAndDebug',
      tabIndex: 0,
      childCount: rows.length,
      role: AriaRoles.Tree,
    },
    ...rows.flatMap(GetRunAndDebugRowVirtualDom.getRunAndDebugRowVirtualDom),
  ]
}
