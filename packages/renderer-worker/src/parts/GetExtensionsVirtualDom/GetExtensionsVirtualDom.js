import * as GetExtensionsListVirtualDom from '../GetExtensionsListVirtualDom/GetExtensionsListVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as GetSearchFieldVirtualDom from '../GetSearchFieldVirtualDom/GetSearchFieldVirtualDom.js'

export const getExtensionsVirtualDom = (visibleExtensions, placeholder, actions) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Extensions',
      ariaLive: 'polite',
      ariaBusy: 'true',
      role: 'none',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionsHeader',
      childCount: 1,
    },
    ...GetSearchFieldVirtualDom.getSearchFieldVirtualDom('extensions', placeholder, 'handleExtensionsInput', actions, []),
    ...GetExtensionsListVirtualDom.getExtensionsListVirtualDom(visibleExtensions),
  ]
  return dom
}
