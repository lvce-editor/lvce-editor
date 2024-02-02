import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'

export const getExtensionHeaderVirtualDom = (placeholder) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ExtensionHeader,
      childCount: 1,
    },
    ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('extensions', placeholder, 'handleExtensionsInput', [], []),
  ]
}
