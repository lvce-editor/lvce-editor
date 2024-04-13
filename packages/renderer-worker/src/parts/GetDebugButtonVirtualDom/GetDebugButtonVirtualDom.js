import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const DebugButton = ClassNames.IconButton + ' ' + ClassNames.DebugButton

export const getDebugButtonVirtualDom = (button) => {
  const { title, icon, fn } = button
  return [
    {
      type: VirtualDomElements.Button,
      className: DebugButton + ' ' + icon,
      title,
      childCount: 1,
      // onPointerDown: fn,
      'data-command': fn,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon MaskIcon${icon}`,
      childCount: 0,
    },
  ]
}
