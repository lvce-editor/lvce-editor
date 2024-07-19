import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'
// @ts-ignore
import * as ActionType from '../ActionType/ActionType.js'
// @ts-ignore
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
// @ts-ignore
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
