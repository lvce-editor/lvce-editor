import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getActionButtonVirtualDom = (action) => {
  const { id, icon, command, onClick } = action
  return [
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      title: id,
      'data-command': command,
      ...(onClick && { onClick }),
      childCount: 1,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
  ]
}
