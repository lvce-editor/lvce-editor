import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

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
