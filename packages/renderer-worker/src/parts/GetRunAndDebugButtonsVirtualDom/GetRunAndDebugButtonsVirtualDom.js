import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetDebugButtonVirtualDom from '../GetDebugButtonVirtualDom/GetDebugButtonVirtualDom.js'
import * as GetDebugButtons from '../GetDebugButtons/GetDebugButtons.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const DebugButton = ClassNames.IconButton + ' ' + ClassNames.DebugButton

export const getRunAndDebugButtonsVirtualDom = (debugState) => {
  const debugButtons = GetDebugButtons.getDebugButtons(debugState)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugButtons,
      childCount: debugButtons.length,
    },
    ...debugButtons.flatMap(GetDebugButtonVirtualDom.getDebugButtonVirtualDom),
  ]
  return dom
}
