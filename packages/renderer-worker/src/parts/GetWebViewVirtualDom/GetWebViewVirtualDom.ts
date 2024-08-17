import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getWebViewVirtualDom = () => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, 'WebView'),
    },
  ]
}
