import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as ExplorerStrings from '../ViewletExplorer/ViewletExplorerStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getExplorerWelcomeVirtualDom = () => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
      tabIndex: 0,
      childCount: 2,
    },
    text(ExplorerStrings.youHaveNotYetOpenedAFolder()),
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonPrimary',
      childCount: 1,
    },
    text(ExplorerStrings.openFolder()),
  ]
}
