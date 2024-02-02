import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'
import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletExtensionStrings from '../ViewletExtensions/ViewletExtensionsStrings.js'

export const getExtensionHeaderVirtualDom = (placeholder, actions) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ExtensionHeader,
      childCount: 1,
    },
    ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('extensions', placeholder, 'handleExtensionsInput', actions, []),
  ]
}
