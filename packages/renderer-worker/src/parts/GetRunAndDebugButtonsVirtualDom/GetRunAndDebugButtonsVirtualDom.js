import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetDebugButtons from '../GetDebugButtons/GetDebugButtons.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const DebugButton = ClassNames.IconButton + ' ' + ClassNames.DebugButton

const getDebugButtonVirtualDom = (button) => {
  const { title, icon, fn } = button
  return [
    {
      type: VirtualDomElements.Button,
      className: DebugButton + ' ' + icon,
      title,
      childCount: 1,
      onPointerDown: fn,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon MaskIcon${icon}`,
      childCount: 0,
    },
  ]
}

export const getRunAndDebugButtonsVirtualDom = (debugState) => {
  const debugButtons = GetDebugButtons.getDebugButtons(debugState)
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DebugButtons,
      childCount: debugButtons.length,
    },
    ...debugButtons.flatMap(getDebugButtonVirtualDom),
  ]
  return dom
}
